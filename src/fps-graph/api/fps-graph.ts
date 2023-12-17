import {BladeApi, TpEvent} from '@tweakpane/core';

import {FpsGraphBladeController} from '../controller/fps-graph-blade.js';

export interface FpsGraphBladeApiEvents {
	tick: TpEvent<FpsGraphBladeApi>;
}

export class FpsGraphBladeApi extends BladeApi<FpsGraphBladeController> {
	get fps(): number | null {
		return this.controller.valueController.fps;
	}

	get max(): number {
		return this.controller.valueController.props.get('max');
	}

	set max(max: number) {
		this.controller.valueController.props.set('max', max);
	}

	get min(): number {
		return this.controller.valueController.props.get('min');
	}

	set min(min: number) {
		this.controller.valueController.props.set('min', min);
	}

	public begin(): void {
		this.controller.valueController.begin();
	}

	public end(): void {
		this.controller.valueController.end();
	}

	public on<EventName extends keyof FpsGraphBladeApiEvents>(
		eventName: EventName,
		handler: (ev: FpsGraphBladeApiEvents[EventName]) => void,
	): this {
		const bh = handler.bind(this);
		const emitter = this.controller.valueController.ticker.emitter;
		emitter.on(eventName, () => {
			bh(new TpEvent(this));
		});
		return this;
	}
}
