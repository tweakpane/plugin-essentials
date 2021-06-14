import {
	bindValueMap,
	ClassName,
	Foldable,
	PickerLayout,
	SVG_NS,
	valueToClassName,
	View,
	ViewProps,
} from '@tweakpane/core';

interface Config {
	foldable: Foldable;
	pickerLayout: PickerLayout;
	viewProps: ViewProps;
}

const className = ClassName('cbz');

export class CubicBezierView implements View {
	public readonly element: HTMLElement;
	public readonly buttonElement: HTMLButtonElement;
	public readonly textElement: HTMLElement;
	public readonly pickerElement: HTMLElement | null;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);
		config.foldable.bindExpandedClass(
			this.element,
			className(undefined, 'expanded'),
		);
		bindValueMap(
			config.foldable,
			'completed',
			valueToClassName(this.element, className(undefined, 'cpl')),
		);

		const headElem = doc.createElement('div');
		headElem.classList.add(className('h'));
		this.element.appendChild(headElem);

		const buttonElem = doc.createElement('button');
		buttonElem.classList.add(className('b'));
		config.viewProps.bindDisabled(buttonElem);
		const iconElem = doc.createElementNS(SVG_NS, 'svg');
		iconElem.innerHTML = '<path d="M2 13C8 13 8 3 14 3"/>';
		buttonElem.appendChild(iconElem);
		headElem.appendChild(buttonElem);
		this.buttonElement = buttonElem;

		const textElem = doc.createElement('div');
		textElem.classList.add(className('t'));
		headElem.appendChild(textElem);
		this.textElement = textElem;

		if (config.pickerLayout === 'inline') {
			const pickerElem = doc.createElement('div');
			pickerElem.classList.add(className('p'));
			this.element.appendChild(pickerElem);
			this.pickerElement = pickerElem;
		} else {
			this.pickerElement = null;
		}
	}
}
