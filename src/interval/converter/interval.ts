import {BindingTarget} from '@tweakpane/core';

import {Interval} from '../model/interval.js';

export function intervalFromUnknown(value: unknown): Interval {
	return Interval.isObject(value)
		? new Interval(value.min, value.max)
		: new Interval(0, 0);
}

export function writeInterval(target: BindingTarget, value: Interval): void {
	target.writeProperty('max', value.max);
	target.writeProperty('min', value.min);
}
