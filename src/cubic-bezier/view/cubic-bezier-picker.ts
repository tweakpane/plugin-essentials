import {ClassName, View, ViewProps} from '@tweakpane/core';

interface Config {
	viewProps: ViewProps;
}

const className = ClassName('cbzp');

export class CubicBezierPickerView implements View {
	public readonly element: HTMLElement;
	public readonly graphElement: HTMLElement;
	public readonly textElement: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		const graphElem = doc.createElement('div');
		graphElem.classList.add(className('g'));
		this.element.appendChild(graphElem);
		this.graphElement = graphElem;

		const textElem = doc.createElement('div');
		textElem.classList.add(className('t'));
		this.element.appendChild(textElem);
		this.textElement = textElem;
	}
}
