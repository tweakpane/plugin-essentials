import {TpEvent} from '@tweakpane/core';

import {ButtonCellApi} from './button-cell.js';

export class TpButtonGridEvent extends TpEvent {
	public readonly cell: ButtonCellApi;
	public readonly index: [number, number];

	constructor(target: unknown, cell: ButtonCellApi, index: [number, number]) {
		super(target);

		this.cell = cell;
		this.index = index;
	}
}
