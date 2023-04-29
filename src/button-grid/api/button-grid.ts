import {BladeApi, ButtonController, Emitter} from '@tweakpane/core';

import {ButtonGridBladeController} from '../controller/button-grid-blade.js';
import {ButtonCellApi} from './button-cell.js';
import {TpButtonGridEvent} from './tp-button-grid-event.js';

interface ButtonGridApiEvents {
	click: {
		event: TpButtonGridEvent;
	};
}

export class ButtonGridApi extends BladeApi<ButtonGridBladeController> {
	private emitter_: Emitter<ButtonGridApiEvents>;
	private cellToApiMap_: Map<ButtonController, ButtonCellApi> = new Map();

	constructor(controller: ButtonGridBladeController) {
		super(controller);

		this.emitter_ = new Emitter();

		const gc = this.controller.valueController;
		gc.cellControllers.forEach((cc, i) => {
			const api = new ButtonCellApi(cc);
			this.cellToApiMap_.set(cc, api);

			cc.emitter.on('click', () => {
				const x = i % gc.size[0];
				const y = Math.floor(i / gc.size[0]);
				this.emitter_.emit('click', {
					event: new TpButtonGridEvent(this, api, [x, y]),
				});
			});
		});
	}

	public cell(x: number, y: number): ButtonCellApi | undefined {
		const gc = this.controller.valueController;
		const cc = gc.cellControllers[y * gc.size[0] + x];
		return this.cellToApiMap_.get(cc);
	}

	public on<EventName extends keyof ButtonGridApiEvents>(
		eventName: EventName,
		handler: (ev: ButtonGridApiEvents[EventName]['event']) => void,
	): this {
		const bh = handler.bind(this);
		this.emitter_.on(eventName, (ev) => {
			bh(ev.event);
		});
		return this;
	}
}
