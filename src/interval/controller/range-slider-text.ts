import {
	Constraint,
	NumberTextProps,
	Parser,
	PointAxis,
	PointNdTextController,
	SliderProps,
	Value,
	ValueController,
	ViewProps,
} from '@tweakpane/core';

import {Interval, IntervalAssembly} from '../model/interval.js';
import {RangeSliderTextView} from '../view/range-slider-text.js';
import {RangeSliderController} from './range-slider.js';

interface Config {
	constraint: Constraint<number> | undefined;
	parser: Parser<number>;
	sliderProps: SliderProps;
	textProps: NumberTextProps;
	value: Value<Interval>;
	viewProps: ViewProps;
}

export class RangeSliderTextController
	implements ValueController<Interval, RangeSliderTextView>
{
	public readonly value: Value<Interval>;
	public readonly view: RangeSliderTextView;
	public readonly viewProps: ViewProps;
	private readonly sc_: RangeSliderController;
	private readonly tc_: PointNdTextController<Interval>;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.sc_ = new RangeSliderController(doc, config);

		const axis = {
			constraint: config.constraint,
			textProps: config.textProps,
		} as PointAxis;
		this.tc_ = new PointNdTextController(doc, {
			assembly: IntervalAssembly,
			axes: [axis, axis],
			parser: config.parser,
			value: this.value,
			viewProps: config.viewProps,
		});

		this.view = new RangeSliderTextView(doc, {
			sliderView: this.sc_.view,
			textView: this.tc_.view,
		});
	}

	public get textController(): PointNdTextController<Interval> {
		return this.tc_;
	}
}
