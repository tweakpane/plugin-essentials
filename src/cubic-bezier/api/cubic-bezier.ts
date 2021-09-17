import {BladeApi, LabeledValueController, TpChangeEvent} from '@tweakpane/core';

import {CubicBezierController} from '../controller/cubic-bezier';
import {CubicBezier} from '../model/cubic-bezier';

export interface CubicBezierApiEvents {
	change: {
		event: TpChangeEvent<CubicBezier>;
	};
}

export class CubicBezierApi extends BladeApi<
	LabeledValueController<CubicBezier, CubicBezierController>
> {
	get label(): string | undefined {
		return this.controller_.props.get('label');
	}

	set label(label: string | undefined) {
		this.controller_.props.set('label', label);
	}

	get value(): CubicBezier {
		return this.controller_.valueController.value.rawValue;
	}

	set value(value: CubicBezier) {
		this.controller_.valueController.value.rawValue = value;
	}

	public on<EventName extends keyof CubicBezierApiEvents>(
		eventName: EventName,
		handler: (ev: CubicBezierApiEvents[EventName]['event']) => void,
	): this {
		const bh = handler.bind(this);
		this.controller_.valueController.value.emitter.on(eventName, (ev) => {
			bh(new TpChangeEvent(this, ev.rawValue, undefined, ev.options.last));
		});
		return this;
	}
}
