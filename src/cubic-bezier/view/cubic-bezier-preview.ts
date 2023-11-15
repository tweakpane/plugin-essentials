import {
	ClassName,
	constrainRange,
	mapRange,
	SVG_NS,
	Value,
	View,
	ViewProps,
} from '@tweakpane/core';

import {CubicBezier} from '../model/cubic-bezier.js';
import {waitToBeAddedToDom} from './util.js';

interface Config {
	value: Value<CubicBezier>;
	viewProps: ViewProps;
}

const TICK_COUNT = 24;
const PREVIEW_DELAY = 400;
const PREVIEW_DURATION = 1000;
const className = ClassName('cbzprv');

export class CubicBezierPreviewView implements View {
	public readonly element: HTMLElement;
	private readonly svgElem_: Element;
	private readonly ticksElem_: Element;
	private readonly markerElem_: HTMLElement;
	private readonly value_: Value<CubicBezier>;
	private stopped_ = true;
	private startTime_ = -1;

	constructor(doc: Document, config: Config) {
		this.onDispose_ = this.onDispose_.bind(this);
		this.onTimer_ = this.onTimer_.bind(this);
		this.onValueChange_ = this.onValueChange_.bind(this);

		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		const svgElem = doc.createElementNS(SVG_NS, 'svg');
		svgElem.classList.add(className('g'));
		this.element.appendChild(svgElem);
		this.svgElem_ = svgElem;

		const ticksElem = doc.createElementNS(SVG_NS, 'path');
		ticksElem.classList.add(className('t'));
		this.svgElem_.appendChild(ticksElem);
		this.ticksElem_ = ticksElem;

		const markerElem = doc.createElement('div');
		markerElem.classList.add(className('m'));
		this.element.appendChild(markerElem);
		this.markerElem_ = markerElem;

		this.value_ = config.value;
		this.value_.emitter.on('change', this.onValueChange_);

		config.viewProps.handleDispose(this.onDispose_);
		waitToBeAddedToDom(this.element, () => {
			this.refresh();
		});
	}

	public play(): void {
		this.stop();

		this.updateMarker_(0);
		this.markerElem_.classList.add(className('m', 'a'));

		this.startTime_ = new Date().getTime() + PREVIEW_DELAY;
		this.stopped_ = false;
		requestAnimationFrame(this.onTimer_);
	}

	public stop(): void {
		this.stopped_ = true;
		this.markerElem_.classList.remove(className('m', 'a'));
	}

	private onDispose_(): void {
		this.stop();
	}

	private updateMarker_(progress: number): void {
		const p = this.value_.rawValue.y(constrainRange(progress, 0, 1));
		this.markerElem_.style.left = `${p * 100}%`;
	}

	public refresh(): void {
		const {clientWidth: w, clientHeight: h} = this.svgElem_;
		const ds: string[] = [];
		const bezier = this.value_.rawValue;
		for (let i = 0; i < TICK_COUNT; i++) {
			const px = mapRange(i, 0, TICK_COUNT - 1, 0, 1);
			const x = mapRange(bezier.y(px), 0, 1, 0, w);
			ds.push(`M ${x},0 v${h}`);
		}
		this.ticksElem_.setAttributeNS(null, 'd', ds.join(' '));
	}

	private onTimer_(): void {
		if (this.startTime_ === null) {
			return;
		}

		const dt = new Date().getTime() - this.startTime_;
		const p = dt / PREVIEW_DURATION;
		this.updateMarker_(p);

		if (dt > PREVIEW_DURATION + PREVIEW_DELAY) {
			this.stop();
		}

		if (!this.stopped_) {
			requestAnimationFrame(this.onTimer_);
		}
	}

	private onValueChange_() {
		this.refresh();

		this.play();
	}
}
