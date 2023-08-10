import {
	ClassName,
	constrainRange,
	mapRange,
	SliderProps,
	Value,
	View,
	ViewProps,
} from '@tweakpane/core';

import {Interval} from '../model/interval.js';

interface Config {
	sliderProps: SliderProps;
	value: Value<Interval>;
	viewProps: ViewProps;
}

const className = ClassName('rsl');

export class RangeSliderView implements View {
	public readonly element: HTMLElement;
	public readonly knobElements: [HTMLElement, HTMLElement];
	public readonly barElement: HTMLElement;
	public readonly trackElement: HTMLElement;
	private readonly sliderProps_: SliderProps;
	private readonly value_: Value<Interval>;

	constructor(doc: Document, config: Config) {
		this.onSliderPropsChange_ = this.onSliderPropsChange_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.sliderProps_ = config.sliderProps;
		this.sliderProps_.emitter.on('change', this.onSliderPropsChange_);

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		this.value_ = config.value;
		this.value_.emitter.on('change', this.onValueChange_);

		const trackElem = doc.createElement('div');
		trackElem.classList.add(className('t'));
		this.element.appendChild(trackElem);
		this.trackElement = trackElem;

		const barElem = doc.createElement('div');
		barElem.classList.add(className('b'));
		trackElem.appendChild(barElem);
		this.barElement = barElem;

		const knobElems = ['min', 'max'].map((modifier) => {
			const elem = doc.createElement('div');
			elem.classList.add(className('k'), className('k', modifier));
			trackElem.appendChild(elem);
			return elem;
		});
		this.knobElements = [knobElems[0], knobElems[1]];

		this.update_();
	}

	private valueToX_(value: number): number {
		const min = this.sliderProps_.get('min');
		const max = this.sliderProps_.get('max');
		return constrainRange(mapRange(value, min, max, 0, 1), 0, 1) * 100;
	}

	private update_(): void {
		const v = this.value_.rawValue;

		if (v.length === 0) {
			this.element.classList.add(className(undefined, 'zero'));
		} else {
			this.element.classList.remove(className(undefined, 'zero'));
		}

		const xs = [this.valueToX_(v.min), this.valueToX_(v.max)];
		this.barElement.style.left = `${xs[0]}%`;
		this.barElement.style.right = `${100 - xs[1]}%`;

		this.knobElements.forEach((elem, index) => {
			elem.style.left = `${xs[index]}%`;
		});
	}

	private onSliderPropsChange_() {
		this.update_();
	}

	private onValueChange_() {
		this.update_();
	}
}
