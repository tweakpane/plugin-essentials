import {ButtonController, TpEvent} from '@tweakpane/core';

interface ButtonCellApiEvents {
	click: {
		event: TpEvent;
	};
}

export class ButtonCellApi {
	private controller_: ButtonController;

	constructor(controller: ButtonController) {
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

	public on<EventName extends keyof ButtonCellApiEvents>(
		eventName: EventName,
		handler: (ev: ButtonCellApiEvents[EventName]['event']) => void,
	): this {
		const bh = handler.bind(this);
		const emitter = this.controller_.emitter;
		emitter.on(eventName, () => {
			bh(new TpEvent(this));
		});
		return this;
	}
}
