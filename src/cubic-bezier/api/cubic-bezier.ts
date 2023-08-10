import {
	BladeApi,
	LabeledValueBladeController,
	TpChangeEvent,
} from '@tweakpane/core';

import {CubicBezierController} from '../controller/cubic-bezier.js';
import {CubicBezier} from '../model/cubic-bezier.js';

export interface CubicBezierApiEvents {
	change: {
		event: TpChangeEvent<CubicBezier>;
	};
}

export class CubicBezierApi extends BladeApi<
	LabeledValueBladeController<CubicBezier, CubicBezierController>
> {
	get label(): string | null | undefined {
		return this.controller.labelController.props.get('label');
	}

	set label(label: string | null | undefined) {
		this.controller.labelController.props.set('label', label);
	}

	get value(): CubicBezier {
		return this.controller.valueController.value.rawValue;
	}

	set value(value: CubicBezier) {
		this.controller.valueController.value.rawValue = value;
	}

	public on<EventName extends keyof CubicBezierApiEvents>(
		eventName: EventName,
		handler: (ev: CubicBezierApiEvents[EventName]['event']) => void,
	): this {
		const bh = handler.bind(this);
		this.controller.valueController.value.emitter.on(eventName, (ev) => {
			bh(new TpChangeEvent(this, ev.rawValue, ev.options.last));
		});
		return this;
	}
}
