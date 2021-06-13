import {
	BaseInputParams,
	CompositeConstraint,
	Constraint,
	createNumberFormatter,
	createRangeConstraint,
	createStepConstraint,
	findConstraint,
	getBaseStep,
	getSuitableDecimalDigits,
	getSuitableDraggingScale,
	InputBindingPlugin,
	ParamsParsers,
	parseNumber,
	parseParams,
	PointNdTextController,
	RangeConstraint,
	TpError,
	ValueMap,
} from '@tweakpane/core';

import {IntervalConstraint} from './constraint/interval';
import {RangeSliderTextController} from './controller/range-slider-text';
import {intervalFromUnknown, writeInterval} from './converter/interval';
import {Interval, IntervalAssembly, IntervalObject} from './model/interval';

interface IntervalInputParams extends BaseInputParams {
	max?: number;
	min?: number;
	step?: number;
}

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
> = {
	id: 'input-interval',
	type: 'input',
	css: '__css__',

	accept: (exValue, params) => {
		if (!Interval.isObject(exValue)) {
			return null;
		}

		const p = ParamsParsers;
		const result = parseParams<IntervalInputParams>(params, {
			max: p.optional.number,
			min: p.optional.number,
			step: p.optional.number,
		});
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
		const rc = c.edge && findConstraint(c.edge, RangeConstraint);
		if (rc?.minValue !== undefined && rc?.maxValue !== undefined) {
			return new RangeSliderTextController(args.document, {
				baseStep: getBaseStep(c.edge),
				constraint: c.edge,
				draggingScale: getSuitableDraggingScale(rc, midValue),
				formatter: createNumberFormatter(
					getSuitableDecimalDigits(c.edge, midValue),
				),
				maxValue: rc.maxValue,
				minValue: rc.minValue,
				parser: parseNumber,
				value: v,
				viewProps: args.viewProps,
			});
		}

		const axis = {
			baseStep: getBaseStep(c.edge),
			constraint: c.edge,
			textProps: ValueMap.fromObject({
				draggingScale: midValue,
				formatter: createNumberFormatter(
					getSuitableDecimalDigits(c.edge, midValue),
				),
			}),
		};
		return new PointNdTextController(args.document, {
			assembly: IntervalAssembly,
			axes: [axis, axis],
			parser: parseNumber,
			value: v,
			viewProps: args.viewProps,
		});
	},
};
