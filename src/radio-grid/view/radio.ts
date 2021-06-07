import {
	bindValueMap,
	ClassName,
	ValueMap,
	View,
	ViewProps,
} from '@tweakpane/core';

export type RadioPropsObject = {
	title: string;
};

export type RadioProps = ValueMap<RadioPropsObject>;

interface Config {
	name: string;
	props: RadioProps;
	viewProps: ViewProps;
}

const className = ClassName('rad');

export class RadioView implements View {
	public readonly element: HTMLElement;
	public readonly inputElement: HTMLInputElement;

	constructor(doc: Document, config: Config) {
		this.element = doc.createElement('div');
		this.element.classList.add(className());
		config.viewProps.bindClassModifiers(this.element);

		const labelElem = doc.createElement('label');
		labelElem.classList.add(className('l'));
		this.element.appendChild(labelElem);

		const inputElem = doc.createElement('input');
		inputElem.classList.add(className('i'));
		inputElem.name = config.name;
		inputElem.type = 'radio';
		config.viewProps.bindDisabled(inputElem);
		labelElem.appendChild(inputElem);
		this.inputElement = inputElem;

		const bodyElem = doc.createElement('div');
		bodyElem.classList.add(className('b'));
		labelElem.appendChild(bodyElem);

		const titleElem = doc.createElement('div');
		titleElem.classList.add(className('t'));
		bodyElem.appendChild(titleElem);
		bindValueMap(config.props, 'title', (title) => {
			titleElem.textContent = title;
		});
	}
}
