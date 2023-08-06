import {
	BaseInputParams,
	CompositeConstraint,
	Constraint,
	createNumberTextInputParamsParser,
	createNumberTextPropsObject,
	createPlugin,
	createRangeConstraint,
	createStepConstraint,
	DefiniteRangeConstraint,
	findConstraint,
	InputBindingPlugin,
	NumberInputParams,
	parseNumber,
	parseRecord,
	PointAxis,
	PointNdTextController,
	TpError,
	ValueMap,
} from '@tweakpane/core';

import {IntervalConstraint} from './constraint/interval.js';
import {RangeSliderTextController} from './controller/range-slider-text.js';
import {intervalFromUnknown, writeInterval} from './converter/interval.js';
import {Interval, IntervalAssembly, IntervalObject} from './model/interval.js';

interface IntervalInputParams extends NumberInputParams, BaseInputParams {}

function createConstraint(params: IntervalInputParams): Constraint<Interval> {
	const constraints = [];
	const rc = createRangeConstraint(params);
	if (rc) {
		constraints.push(rc);
	}
	const sc = createStepConstraint(params);
	if (sc) {
		constraints.push(sc);
	}

	return new IntervalConstraint(new CompositeConstraint(constraints));
}

export const IntervalInputPlugin: InputBindingPlugin<
	Interval,
	IntervalObject,
	IntervalInputParams
> = createPlugin({
	id: 'input-interval',
	type: 'input',

	accept: (exValue, params) => {
		if (!Interval.isObject(exValue)) {
			return null;
		}

		const result = parseRecord<IntervalInputParams>(params, (p) => ({
			...createNumberTextInputParamsParser(p),
			readonly: p.optional.constant(false),
		}));
		return result
			? {
					initialValue: new Interval(exValue.min, exValue.max),
					params: result,
			  }
			: null;
	},
	binding: {
		reader: (_args) => intervalFromUnknown,
		constraint: (args) => createConstraint(args.params),
		equals: Interval.equals,
		writer: (_args) => writeInterval,
	},
	controller(args) {
		const v = args.value;
		const c = args.constraint;
		if (!(c instanceof IntervalConstraint)) {
			throw TpError.shouldNeverHappen();
		}

		const midValue = (v.rawValue.min + v.rawValue.max) / 2;
		const textProps = ValueMap.fromObject(
			createNumberTextPropsObject(args.params, midValue),
		);
		const drc = c.edge && findConstraint(c.edge, DefiniteRangeConstraint);
		if (drc) {
			return new RangeSliderTextController(args.document, {
				constraint: c.edge,
				parser: parseNumber,
				sliderProps: new ValueMap({
					keyScale: textProps.value('keyScale'),
					max: drc.values.value('max'),
					min: drc.values.value('min'),
				}),
				textProps: textProps,
				value: v,
				viewProps: args.viewProps,
			});
		}

		const axis = {
			constraint: c.edge,
			textProps: textProps,
		} as PointAxis;
		return new PointNdTextController(args.document, {
			assembly: IntervalAssembly,
			axes: [axis, axis],
			parser: parseNumber,
			value: v,
			viewProps: args.viewProps,
		});
	},
});
