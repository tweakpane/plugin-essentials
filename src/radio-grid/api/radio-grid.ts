import {BladeApi, LabeledValueController, Value} from '@tweakpane/core';

import {RadioController} from '../controller/radio';
import {RadioGridController} from '../controller/radio-grid';
import {RadioCellApi} from './radio-cell-api';
import {TpRadioGridChangeEvent} from './tp-radio-grid-event';

interface RadioGridApiEvents<T> {
	change: {
		event: TpRadioGridChangeEvent<T>;
	};
}

export class RadioGridApi<T> extends BladeApi<
	LabeledValueController<T, RadioGridController<T>>
> {
	private cellToApiMap_: Map<RadioController, RadioCellApi> = new Map();

	constructor(controller: LabeledValueController<T, RadioGridController<T>>) {
		super(controller);

		const gc = this.controller_.valueController;
		gc.cellControllers.forEach((cc) => {
			const api = new RadioCellApi(cc);
			this.cellToApiMap_.set(cc, api);
		});
	}

	get value(): Value<T> {
		return this.controller_.value;
	}

	public cell(x: number, y: number): RadioCellApi | undefined {
		const gc = this.controller_.valueController;
		const cc = gc.cellControllers[y * gc.size[0] + x];
		return this.cellToApiMap_.get(cc);
	}

	public on<EventName extends keyof RadioGridApiEvents<T>>(
		eventName: EventName,
		handler: (ev: RadioGridApiEvents<T>[EventName]['event']) => void,
	): void {
		const bh = handler.bind(this);
		this.controller_.value.emitter.on(eventName, (ev) => {
			const gc = this.controller_.valueController;
			const cc = gc.findCellByValue(ev.rawValue);
			if (!cc) {
				return;
			}
			const capi = this.cellToApiMap_.get(cc);
			if (!capi) {
				return;
			}
			const i = gc.cellControllers.indexOf(cc);
			bh(
				new TpRadioGridChangeEvent(
					this,
					capi,
					[i % gc.size[0], Math.floor(i / gc.size[0])],
					ev.rawValue,
					undefined,
				),
			);
		});
	}
}
