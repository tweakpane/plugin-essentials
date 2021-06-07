import {ClassName, View, ViewProps} from '@tweakpane/core';

interface Config {
	viewProps: ViewProps;
}

const className = ClassName('fps');

export class FpsView implements View {
	public readonly element: HTMLElement;
	public readonly graphElement: HTMLElement;
	public readonly valueElement: HTMLElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		this.graphElement = doc.createElement('div');
		this.graphElement.classList.add(className('g'));
		this.element.appendChild(this.graphElement);

		const labelElement = doc.createElement('div');
		labelElement.classList.add(className('l'));
		this.element.appendChild(labelElement);

		const valueElement = doc.createElement('span');
		valueElement.classList.add(className('v'));
		valueElement.textContent = '--';
		labelElement.appendChild(valueElement);
		this.valueElement = valueElement;

		const unitElement = doc.createElement('span');
		unitElement.classList.add(className('u'));
		unitElement.textContent = 'FPS';
		labelElement.appendChild(unitElement);
	}
}
