import {RadioController} from '../controller/radio.js';

export class RadioCellApi {
	private controller_: RadioController;

	constructor(controller: RadioController) {
		this.controller_ = controller;
	}

	get disabled(): boolean {
		return this.controller_.viewProps.get('disabled');
	}

	set disabled(disabled: boolean) {
		this.controller_.viewProps.set('disabled', disabled);
	}

	get title(): string {
		return this.controller_.props.get('title') ?? '';
	}

	set title(title: string) {
		this.controller_.props.set('title', title);
	}
}
