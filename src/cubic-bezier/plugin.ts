import {
	BladePlugin,
	Constraint,
	createNumberFormatter,
	createValue,
	LabeledValueController,
	ParamsParsers,
	parseParams,
	PickerLayout,
	PointNdConstraint,
	RangeConstraint,
	ValueMap,
} from '@tweakpane/core';
import {BaseBladeParams} from 'tweakpane';

import {CubicBezierApi} from './api/cubic-bezier';
import {CubicBezierController} from './controller/cubic-bezier';
import {CubicBezier, CubicBezierAssembly} from './model/cubic-bezier';

export interface CubicBezierBladeParams extends BaseBladeParams {
	value: [number, number, number, number];
	view: 'cubicbezier';

	expanded?: boolean;
	label?: string;
	picker?: PickerLayout;
}

function createConstraint(): Constraint<CubicBezier> {
	return new PointNdConstraint<CubicBezier>({
		assembly: CubicBezierAssembly,
		components: [0, 1, 2, 3].map((index) =>
			index % 2 === 0
				? new RangeConstraint({
						min: 0,
						max: 1,
				  })
				: undefined,
		),
	});
}

export const CubicBezierBladePlugin: BladePlugin<CubicBezierBladeParams> = {
	id: 'cubic-bezier',
	type: 'blade',
	css: '__css__',

	accept(params) {
		const p = ParamsParsers;
		const result = parseParams(params, {
			value: p.required.array(p.required.number),
			view: p.required.constant('cubicbezier'),

			expanded: p.optional.boolean,
			label: p.optional.string,
			picker: p.optional.custom<PickerLayout>((v) => {
				return v === 'inline' || v === 'popup' ? v : undefined;
			}),
		});
		return result ? {params: result} : null;
	},
	controller(args) {
		const rv = new CubicBezier(...args.params.value);
		const v = createValue(rv, {
			constraint: createConstraint(),
			equals: CubicBezier.equals,
		});
		const vc = new CubicBezierController(args.document, {
			axis: {
				baseStep: 0.1,
				textProps: ValueMap.fromObject({
					draggingScale: 0.01,
					formatter: createNumberFormatter(2),
				}),
			},
			expanded: args.params.expanded ?? false,
			pickerLayout: args.params.picker ?? 'popup',
			value: v,
			viewProps: args.viewProps,
		});
		return new LabeledValueController(args.document, {
			blade: args.blade,
			props: ValueMap.fromObject({
				label: args.params.label,
			}),
			valueController: vc,
		});
	},
	api(args) {
		if (!(args.controller instanceof LabeledValueController)) {
			return null;
		}
		if (!(args.controller.valueController instanceof CubicBezierController)) {
			return null;
		}
		return new CubicBezierApi(args.controller);
	},
};
