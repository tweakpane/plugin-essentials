import {
	bindValue,
	ClassName,
	constrainRange,
	mapRange,
	SVG_NS,
	Value,
	valueToClassName,
	View,
	ViewProps,
} from '@tweakpane/core';

import {CubicBezier} from '../model/cubic-bezier.js';
import {waitToBeAddedToDom} from './util.js';

interface Config {
	selection: Value<number>;
	value: Value<CubicBezier>;
	viewProps: ViewProps;
}

const className = ClassName('cbzg');

// TODO: Apply to core
function compose<A, B, C>(
	h1: (input: A) => B,
	h2: (input: B) => C,
): (input: A) => C {
	return (input) => h2(h1(input));
}

export class CubicBezierGraphView implements View {
	public readonly element: HTMLElement;
	public previewElement: HTMLElement;
	private svgElem_: SVGElement;
	private guideElem_: SVGElement;
	private lineElem_: Element;
	private handleElems_: [HTMLElement, HTMLElement];
	private vectorElems_: [Element, Element];
	private value_: Value<CubicBezier>;
	private sel_: Value<number>;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);
		config.viewProps.bindTabIndex(this.element);

		const previewElem = doc.createElement('div');
		previewElem.classList.add(className('p'));
		this.element.appendChild(previewElem);
		this.previewElement = previewElem;

		const svgElem = doc.createElementNS(SVG_NS, 'svg');
		svgElem.classList.add(className('g'));
		this.element.appendChild(svgElem);
		this.svgElem_ = svgElem;

		const guideElem = doc.createElementNS(SVG_NS, 'path');
		guideElem.classList.add(className('u'));
		this.svgElem_.appendChild(guideElem);
		this.guideElem_ = guideElem;

		const lineElem = doc.createElementNS(SVG_NS, 'polyline');
		lineElem.classList.add(className('l'));
		this.svgElem_.appendChild(lineElem);
		this.lineElem_ = lineElem;

		this.handleElems_ = [doc.createElement('div'), doc.createElement('div')];
		this.handleElems_.forEach((elem) => {
			elem.classList.add(className('h'));
			this.element.appendChild(elem);
		});

		this.vectorElems_ = [
			doc.createElementNS(SVG_NS, 'line'),
			doc.createElementNS(SVG_NS, 'line'),
		];
		this.vectorElems_.forEach((elem) => {
			elem.classList.add(className('v'));
			this.svgElem_.appendChild(elem);
		});

		this.value_ = config.value;
		this.value_.emitter.on('change', this.onValueChange_.bind(this));

		this.sel_ = config.selection;
		this.handleElems_.forEach((elem, index) => {
			bindValue(
				this.sel_,
				compose(
					(selection) => selection === index,
					valueToClassName(elem, className('h', 'sel')),
				),
			);
		});

		waitToBeAddedToDom(this.element, () => {
			this.refresh();
		});
	}

	private getVertMargin_(h: number): number {
		return h * 0.25;
	}

	public valueToPosition(x: number, y: number): {x: number; y: number} {
		const {clientWidth: w, clientHeight: h} = this.element;
		const vm = this.getVertMargin_(h);
		return {
			x: mapRange(x, 0, 1, 0, w),
			y: mapRange(y, 0, 1, h - vm, vm),
		};
	}

	public positionToValue(x: number, y: number): {x: number; y: number} {
		const bounds = this.element.getBoundingClientRect();
		const w = bounds.width;
		const h = bounds.height;
		const vm = this.getVertMargin_(h);
		return {
			x: constrainRange(mapRange(x, 0, w, 0, 1), 0, 1),
			y: mapRange(y, h - vm, vm, 0, 1),
		};
	}

	public refresh(): void {
		this.guideElem_.setAttributeNS(
			null,
			'd',
			[0, 1]
				.map((index) => {
					const p1 = this.valueToPosition(0, index);
					const p2 = this.valueToPosition(1, index);
					return [`M ${p1.x},${p1.y}`, `L ${p2.x},${p2.y}`].join(' ');
				})
				.join(' '),
		);

		const bezier = this.value_.rawValue;
		const points: string[] = [];
		let t = 0;
		for (;;) {
			const p = this.valueToPosition(...bezier.curve(t));
			points.push([p.x, p.y].join(','));
			if (t >= 1) {
				break;
			}
			t = Math.min(t + 0.05, 1);
		}
		this.lineElem_.setAttributeNS(null, 'points', points.join(' '));

		const obj = bezier.toObject();
		[0, 1].forEach((index) => {
			const p1 = this.valueToPosition(index, index);
			const p2 = this.valueToPosition(obj[index * 2], obj[index * 2 + 1]);
			const vElem = this.vectorElems_[index];
			vElem.setAttributeNS(null, 'x1', String(p1.x));
			vElem.setAttributeNS(null, 'y1', String(p1.y));
			vElem.setAttributeNS(null, 'x2', String(p2.x));
			vElem.setAttributeNS(null, 'y2', String(p2.y));
			const hElem = this.handleElems_[index];
			hElem.style.left = `${p2.x}px`;
			hElem.style.top = `${p2.y}px`;
		});
	}

	private onValueChange_() {
		this.refresh();
	}
}
