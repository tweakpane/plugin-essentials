import {Controller, ViewProps} from '@tweakpane/core';

import {RadioProps, RadioView} from '../view/radio.js';

interface Config {
	name: string;
	props: RadioProps;
	viewProps: ViewProps;
}

export class RadioController implements Controller<RadioView> {
	public readonly props: RadioProps;
	public readonly view: RadioView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.props = config.props;
		this.viewProps = config.viewProps;
		this.view = new RadioView(doc, {
			name: config.name,
			props: this.props,
			viewProps: this.viewProps,
		});
	}
}
