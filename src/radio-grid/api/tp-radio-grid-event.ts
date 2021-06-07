import {TpChangeEvent} from '@tweakpane/core';

import {RadioCellApi} from './radio-cell-api';

export class TpRadioGridChangeEvent<T> extends TpChangeEvent<T> {
	public readonly cell: RadioCellApi;
	public readonly index: [number, number];

	constructor(
		target: unknown,
		cell: RadioCellApi,
		index: [number, number],
		value: T,
		presetKey?: string,
	) {
		super(target, value, presetKey);

		this.cell = cell;
		this.index = index;
	}
}
