import {
	bindValue,
	PlainView,
	Value,
	ValueController,
	ValueMap,
	ViewProps,
} from '@tweakpane/core';

import {RadioPropsObject} from '../view/radio.js';
import {RadioController} from './radio.js';

interface CellConfig<T> {
	title: string;
	value: T;
}

interface Config<T> {
	groupName: string;
	size: [number, number];
	cellConfig: (x: number, y: number) => CellConfig<T>;
	value: Value<T>;
}

export class RadioGridController<T> implements ValueController<T, PlainView> {
	public readonly size: [number, number];
	public readonly value: Value<T>;
	public readonly view: PlainView;
	public readonly viewProps: ViewProps;
	private cellCs_: RadioController[] = [];
	private cellValues_: T[] = [];

	constructor(doc: Document, config: Config<T>) {
		this.onCellInputChange_ = this.onCellInputChange_.bind(this);

		this.size = config.size;

		const [w, h] = this.size;
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				const bc = new RadioController(doc, {
					name: config.groupName,
					props: ValueMap.fromObject<RadioPropsObject>({
						...config.cellConfig(x, y),
					}),
					viewProps: ViewProps.create(),
				});
				this.cellCs_.push(bc);
				this.cellValues_.push(config.cellConfig(x, y).value);
			}
		}

		this.value = config.value;
		bindValue(this.value, (value) => {
			const cc = this.findCellByValue(value);
			if (!cc) {
				return;
			}
			cc.view.inputElement.checked = true;
		});

		this.viewProps = ViewProps.create();
		this.view = new PlainView(doc, {
			viewProps: this.viewProps,
			viewName: 'radgrid',
		});
		this.view.element.style.gridTemplateColumns = `repeat(${w}, 1fr)`;

		this.cellCs_.forEach((bc) => {
			bc.view.inputElement.addEventListener('change', this.onCellInputChange_);
			this.view.element.appendChild(bc.view.element);
		});
	}

	public get cellControllers(): RadioController[] {
		return this.cellCs_;
	}

	public findCellByValue(value: T): RadioController | null {
		const index = this.cellValues_.findIndex((v) => v === value);
		if (index < 0) {
			return null;
		}
		return this.cellCs_[index];
	}

	private onCellInputChange_(ev: Event): void {
		const inputElem = ev.currentTarget;
		const index = this.cellCs_.findIndex(
			(c) => c.view.inputElement === inputElem,
		);
		if (index < 0) {
			return;
		}

		this.value.rawValue = this.cellValues_[index];
	}
}
