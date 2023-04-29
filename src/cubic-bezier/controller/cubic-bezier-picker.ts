import {
	Controller,
	NumberTextProps,
	parseNumber,
	PointNdTextController,
	RangeConstraint,
	Value,
	ViewProps,
} from '@tweakpane/core';

import {CubicBezier, CubicBezierAssembly} from '../model/cubic-bezier.js';
import {CubicBezierPickerView} from '../view/cubic-bezier-picker.js';
import {CubicBezierGraphController} from './cubic-bezier-graph.js';

interface Axis {
	textProps: NumberTextProps;
}

interface Config {
	axis: Axis;
	value: Value<CubicBezier>;
	viewProps: ViewProps;
}

export class CubicBezierPickerController
	implements Controller<CubicBezierPickerView>
{
	public readonly value: Value<CubicBezier>;
	public readonly view: CubicBezierPickerView;
	public readonly viewProps: ViewProps;
	private gc_: CubicBezierGraphController;
	private tc_: PointNdTextController<CubicBezier>;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.viewProps = config.viewProps;

		this.view = new CubicBezierPickerView(doc, {
			viewProps: this.viewProps,
		});

		this.gc_ = new CubicBezierGraphController(doc, {
			keyScale: config.axis.textProps.value('keyScale'),
			value: this.value,
			viewProps: this.viewProps,
		});
		this.view.graphElement.appendChild(this.gc_.view.element);

		const xAxis = {
			...config.axis,
			constraint: new RangeConstraint({max: 1, min: 0}),
		};
		const yAxis = {
			...config.axis,
			constraint: undefined,
		};
		this.tc_ = new PointNdTextController(doc, {
			assembly: CubicBezierAssembly,
			axes: [xAxis, yAxis, xAxis, yAxis],
			parser: parseNumber,
			value: this.value,
			viewProps: this.viewProps,
		});
		this.view.textElement.appendChild(this.tc_.view.element);
	}

	get allFocusableElements(): HTMLElement[] {
		return [
			this.gc_.view.element,
			...this.tc_.view.textViews.map((v) => v.inputElement),
		];
	}

	public refresh(): void {
		this.gc_.refresh();
	}
}
