import {ClassName, PointNdTextController, View} from '@tweakpane/core';

import {Interval} from '../model/interval.js';
import {RangeSliderView} from './range-slider.js';

interface Config {
	sliderView: RangeSliderView;
	textView: PointNdTextController<Interval>['view'];
}

const className = ClassName('rsltxt');

export class RangeSliderTextView implements View {
	public readonly element: HTMLElement;
	private sliderView_: RangeSliderView;
	private textView_: PointNdTextController<InputEvent>['view'];

	constructor(doc: Document, config: Config) {
		this.sliderView_ = config.sliderView;
		this.textView_ = config.textView;

		this.element = doc.createElement('div');
		this.element.classList.add(className());

		const sliderElem = doc.createElement('div');
		sliderElem.classList.add(className('s'));
		sliderElem.appendChild(this.sliderView_.element);
		this.element.appendChild(sliderElem);

		const textElem = doc.createElement('div');
		textElem.classList.add(className('t'));
		textElem.appendChild(this.textView_.element);
		this.element.appendChild(textElem);
	}
}
