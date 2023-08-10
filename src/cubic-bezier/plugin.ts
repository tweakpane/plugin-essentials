import {
	BladePlugin,
	Constraint,
	createNumberFormatter,
	createPlugin,
	createValue,
	LabeledValueBladeController,
	LabelPropsObject,
	parseRecord,
	PickerLayout,
	PointNdConstraint,
	RangeConstraint,
	ValueMap,
} from '@tweakpane/core';
import {BaseBladeParams} from 'tweakpane';

import {CubicBezierApi} from './api/cubic-bezier.js';
import {CubicBezierController} from './controller/cubic-bezier.js';
import {CubicBezier, CubicBezierAssembly} from './model/cubic-bezier.js';

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

export const CubicBezierBladePlugin: BladePlugin<CubicBezierBladeParams> =
	createPlugin({
		id: 'cubicbezier',
		type: 'blade',

		accept(params) {
			const result = parseRecord(params, (p) => ({
				value: p.required.array(p.required.number),
				view: p.required.constant('cubicbezier'),

				expanded: p.optional.boolean,
				label: p.optional.string,
				picker: p.optional.custom<PickerLayout>((v) => {
					return v === 'inline' || v === 'popup' ? v : undefined;
				}),
			}));
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
					textProps: ValueMap.fromObject({
						keyScale: 0.1,
						pointerScale: 0.01,
						formatter: createNumberFormatter(2),
					}),
				},
				expanded: args.params.expanded ?? false,
				pickerLayout: args.params.picker ?? 'popup',
				value: v,
				viewProps: args.viewProps,
			});
			return new LabeledValueBladeController(args.document, {
				blade: args.blade,
				props: ValueMap.fromObject({
					label: args.params.label,
				} as LabelPropsObject),
				value: v,
				valueController: vc,
			});
		},
		api(args) {
			if (!(args.controller instanceof LabeledValueBladeController)) {
				return null;
			}
			if (!(args.controller.valueController instanceof CubicBezierController)) {
				return null;
			}
			return new CubicBezierApi(args.controller);
		},
	});
