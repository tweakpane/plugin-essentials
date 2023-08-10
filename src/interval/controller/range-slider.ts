import {
	mapRange,
	PointerData,
	PointerHandler,
	PointerHandlerEvent,
	SliderProps,
	Value,
	ValueChangeOptions,
	ValueController,
	ViewProps,
} from '@tweakpane/core';

import {Interval} from '../model/interval.js';
import {RangeSliderView} from '../view/range-slider.js';

interface Config {
	sliderProps: SliderProps;
	value: Value<Interval>;
	viewProps: ViewProps;
}

type Grabbing = 'min' | 'length' | 'max';

export class RangeSliderController
	implements ValueController<Interval, RangeSliderView>
{
	public readonly sliderProps: SliderProps;
	public readonly value: Value<Interval>;
	public readonly view: RangeSliderView;
	public readonly viewProps: ViewProps;
	private grabbing_: Grabbing | null = null;
	private grabOffset_ = 0;

	constructor(doc: Document, config: Config) {
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.sliderProps = config.sliderProps;
		this.viewProps = config.viewProps;

		this.value = config.value;
		this.view = new RangeSliderView(doc, {
			sliderProps: this.sliderProps,
			value: this.value,
			viewProps: config.viewProps,
		});

		const ptHandler = new PointerHandler(this.view.trackElement);
		ptHandler.emitter.on('down', this.onPointerDown_);
		ptHandler.emitter.on('move', this.onPointerMove_);
		ptHandler.emitter.on('up', this.onPointerUp_);
	}

	private ofs_(): number {
		if (this.grabbing_ === 'min') {
			return this.view.knobElements[0].getBoundingClientRect().width / 2;
		}
		if (this.grabbing_ === 'max') {
			return -this.view.knobElements[1].getBoundingClientRect().width / 2;
		}
		return 0;
	}

	private valueFromData_(data: PointerData): number | null {
		if (!data.point) {
			return null;
		}

		const p = (data.point.x + this.ofs_()) / data.bounds.width;
		const min = this.sliderProps.get('min');
		const max = this.sliderProps.get('max');
		return mapRange(p, 0, 1, min, max);
	}

	private onPointerDown_(ev: PointerHandlerEvent) {
		if (!ev.data.point) {
			return;
		}

		const p = ev.data.point.x / ev.data.bounds.width;
		const v = this.value.rawValue;
		const min = this.sliderProps.get('min');
		const max = this.sliderProps.get('max');
		const pmin = mapRange(v.min, min, max, 0, 1);
		const pmax = mapRange(v.max, min, max, 0, 1);

		if (Math.abs(pmax - p) <= 0.025) {
			this.grabbing_ = 'max';
		} else if (Math.abs(pmin - p) <= 0.025) {
			this.grabbing_ = 'min';
		} else if (p >= pmin && p <= pmax) {
			this.grabbing_ = 'length';
			this.grabOffset_ = mapRange(p - pmin, 0, 1, 0, max - min);
		} else if (p < pmin) {
			this.grabbing_ = 'min';
			this.onPointerMove_(ev);
		} else if (p > pmax) {
			this.grabbing_ = 'max';
			this.onPointerMove_(ev);
		}
	}

	private applyPointToValue_(
		data: PointerData,
		opts: ValueChangeOptions,
	): void {
		const v = this.valueFromData_(data);
		if (v === null) {
			return;
		}

		const rmin = this.sliderProps.get('min');
		const rmax = this.sliderProps.get('max');
		if (this.grabbing_ === 'min') {
			this.value.setRawValue(new Interval(v, this.value.rawValue.max), opts);
		} else if (this.grabbing_ === 'max') {
			this.value.setRawValue(new Interval(this.value.rawValue.min, v), opts);
		} else if (this.grabbing_ === 'length') {
			const len = this.value.rawValue.length;
			let min = v - this.grabOffset_;
			let max = min + len;
			if (min < rmin) {
				min = rmin;
				max = rmin + len;
			} else if (max > rmax) {
				min = rmax - len;
				max = rmax;
			}
			this.value.setRawValue(new Interval(min, max), opts);
		}
	}

	private onPointerMove_(ev: PointerHandlerEvent) {
		this.applyPointToValue_(ev.data, {
			forceEmit: false,
			last: false,
		});
	}

	private onPointerUp_(ev: PointerHandlerEvent) {
		this.applyPointToValue_(ev.data, {
			forceEmit: true,
			last: true,
		});
		this.grabbing_ = null;
	}
}
