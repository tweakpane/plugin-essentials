import {
	BaseInputParams,
	createNumberFormatter,
	InputBindingPlugin,
	ParamsParsers,
	parseParams,
	PickerLayout,
	ValueMap,
} from '@tweakpane/core';

import {CubicBezier} from '..';
import {CubicBezierController} from './controller/cubic-bezier';
import {CubicBezierObject} from './model/cubic-bezier';
import {createConstraint} from './util';

export interface NumberArrayCubicBezierInputParams extends BaseInputParams {
	expanded?: boolean;
	picker?: PickerLayout;
	view: 'cubicbezier';
}

export const NumberArrayCubicBezierInputPlugin: InputBindingPlugin<
	CubicBezier,
	CubicBezierObject,
	NumberArrayCubicBezierInputParams
> = {
	id: 'input-cubic-bezier-number-array',
	type: 'input',
	accept(value, params) {
		if (!CubicBezier.isObject(value)) {
			return null;
		}

		const p = ParamsParsers;
		const result = parseParams<NumberArrayCubicBezierInputParams>(params, {
			expanded: p.optional.boolean,
			picker: p.optional.custom<PickerLayout>((v) => {
				return v === 'inline' || v === 'popup' ? v : undefined;
			}),
			view: p.required.constant('cubicbezier'),
		});
		if (!result) {
			return null;
		}

		return {
			initialValue: value,
			params: result,
		};
	},
	binding: {
		reader: (_args) => (value) => {
			if (!CubicBezier.isObject(value)) {
				return new CubicBezier();
			}
			return CubicBezier.fromObject(value);
		},
		constraint: createConstraint,
		equals: CubicBezier.equals,
		writer: (_args) => (target, inValue) => {
			target.write(inValue.toObject());
		},
	},
	controller(args) {
		return new CubicBezierController(args.document, {
			axis: {
				baseStep: 0.1,
				textProps: ValueMap.fromObject({
					draggingScale: 0.01,
					formatter: createNumberFormatter(2),
				}),
			},
			expanded: args.params.expanded ?? false,
			pickerLayout: args.params.picker ?? 'popup',
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
