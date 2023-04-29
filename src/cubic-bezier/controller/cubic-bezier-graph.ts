import {
	createValue,
	getHorizontalStepKeys,
	getStepForKey,
	getVerticalStepKeys,
	isArrowKey,
	PointerHandler,
	PointerHandlerEvent,
	Value,
	ValueChangeOptions,
	ValueController,
	ViewProps,
} from '@tweakpane/core';

import {CubicBezier} from '../model/cubic-bezier.js';
import {CubicBezierGraphView} from '../view/cubic-bezier-graph.js';
import {CubicBezierPreviewView} from '../view/cubic-bezier-preview.js';

interface Config {
	keyScale: Value<number>;
	value: Value<CubicBezier>;
	viewProps: ViewProps;
}

function getDistance(x1: number, y1: number, x2: number, y2: number): number {
	const dx = x2 - x1;
	const dy = y2 - y1;
	return Math.sqrt(dx * dx + dy * dy);
}

function lockAngle(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
): {x: number; y: number} {
	const d = getDistance(x1, y1, x2, y2);
	const a = Math.atan2(y2 - y1, x2 - x1);
	const la = (Math.round(a / (Math.PI / 4)) * Math.PI) / 4;
	return {
		x: x1 + Math.cos(la) * d,
		y: y1 + Math.sin(la) * d,
	};
}

export class CubicBezierGraphController
	implements ValueController<CubicBezier, CubicBezierGraphView>
{
	public readonly value: Value<CubicBezier>;
	public readonly view: CubicBezierGraphView;
	public readonly viewProps: ViewProps;
	private readonly prevView_: CubicBezierPreviewView;
	private sel_: Value<number>;
	private keyScale_: Value<number>;

	constructor(doc: Document, config: Config) {
		this.onKeyDown_ = this.onKeyDown_.bind(this);
		this.onKeyUp_ = this.onKeyUp_.bind(this);
		this.onPointerDown_ = this.onPointerDown_.bind(this);
		this.onPointerMove_ = this.onPointerMove_.bind(this);
		this.onPointerUp_ = this.onPointerUp_.bind(this);

		this.keyScale_ = config.keyScale;
		this.value = config.value;
		this.sel_ = createValue(0);

		this.viewProps = config.viewProps;
		this.view = new CubicBezierGraphView(doc, {
			selection: this.sel_,
			value: this.value,
			viewProps: this.viewProps,
		});
		this.view.element.addEventListener('keydown', this.onKeyDown_);
		this.view.element.addEventListener('keyup', this.onKeyUp_);

		this.prevView_ = new CubicBezierPreviewView(doc, {
			value: this.value,
			viewProps: this.viewProps,
		});
		this.prevView_.element.addEventListener('mousedown', (ev) => {
			ev.stopImmediatePropagation();
			ev.preventDefault();
			this.prevView_.play();
		});
		this.view.previewElement.appendChild(this.prevView_.element);

		const ptHandler = new PointerHandler(this.view.element);
		ptHandler.emitter.on('down', this.onPointerDown_);
		ptHandler.emitter.on('move', this.onPointerMove_);
		ptHandler.emitter.on('up', this.onPointerUp_);
	}

	public refresh(): void {
		this.view.refresh();

		this.prevView_.refresh();
		this.prevView_.play();
	}

	private updateValue_(
		point: {x: number; y: number},
		locksAngle: boolean,
		opts: ValueChangeOptions,
	): void {
		const index = this.sel_.rawValue;
		const comps = this.value.rawValue.toObject();
		const vp = this.view.positionToValue(point.x, point.y);
		const v = locksAngle ? lockAngle(index, index, vp.x, vp.y) : vp;
		comps[index * 2] = v.x;
		comps[index * 2 + 1] = v.y;
		this.value.setRawValue(new CubicBezier(...comps), opts);
	}

	private onPointerDown_(ev: PointerHandlerEvent): void {
		const data = ev.data;
		if (!data.point) {
			return;
		}

		const bezier = this.value.rawValue;
		const p1 = this.view.valueToPosition(bezier.x1, bezier.y1);
		const d1 = getDistance(data.point.x, data.point.y, p1.x, p1.y);
		const p2 = this.view.valueToPosition(bezier.x2, bezier.y2);
		const d2 = getDistance(data.point.x, data.point.y, p2.x, p2.y);
		this.sel_.rawValue = d1 <= d2 ? 0 : 1;
		this.updateValue_(data.point, ev.shiftKey, {
			forceEmit: false,
			last: false,
		});
	}

	private onPointerMove_(ev: PointerHandlerEvent): void {
		const data = ev.data;
		if (!data.point) {
			return;
		}
		this.updateValue_(data.point, ev.shiftKey, {
			forceEmit: false,
			last: false,
		});
	}

	private onPointerUp_(ev: PointerHandlerEvent): void {
		const data = ev.data;
		if (!data.point) {
			return;
		}
		this.updateValue_(data.point, ev.shiftKey, {
			forceEmit: true,
			last: true,
		});
	}

	private onKeyDown_(ev: KeyboardEvent): void {
		if (isArrowKey(ev.key)) {
			ev.preventDefault();
		}

		const index = this.sel_.rawValue;
		const comps = this.value.rawValue.toObject();
		const keyScale = this.keyScale_.rawValue;
		comps[index * 2] += getStepForKey(keyScale, getHorizontalStepKeys(ev));
		comps[index * 2 + 1] += getStepForKey(keyScale, getVerticalStepKeys(ev));
		this.value.setRawValue(new CubicBezier(...comps), {
			forceEmit: false,
			last: false,
		});
	}

	private onKeyUp_(ev: KeyboardEvent): void {
		if (isArrowKey(ev.key)) {
			ev.preventDefault();
		}

		const keyScale = this.keyScale_.rawValue;
		const xStep = getStepForKey(keyScale, getHorizontalStepKeys(ev));
		const yStep = getStepForKey(keyScale, getVerticalStepKeys(ev));
		if (xStep === 0 && yStep === 0) {
			return;
		}

		this.value.setRawValue(this.value.rawValue, {
			forceEmit: true,
			last: true,
		});
	}
}
