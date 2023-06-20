import {PointNdAssembly} from '@tweakpane/core';

export interface IntervalObject {
	max: number;
	min: number;
}

export class Interval {
	public max: number;
	public min: number;

	constructor(min: number, max: number) {
		this.min = min;
		this.max = max;
	}

	public static isObject(obj: unknown): obj is IntervalObject {
		if (typeof obj !== 'object' || obj === null) {
			return false;
		}
		const min = (obj as Record<string, any>).min;
		const max = (obj as Record<string, any>).max;
		if (typeof min !== 'number' || typeof max !== 'number') {
			return false;
		}
		return true;
	}

	public static equals(v1: Interval, v2: Interval): boolean {
		return v1.min === v2.min && v1.max === v2.max;
	}

	get length(): number {
		return this.max - this.min;
	}

	public toObject(): IntervalObject {
		return {
			min: this.min,
			max: this.max,
		};
	}
}

export const IntervalAssembly: PointNdAssembly<Interval> = {
	fromComponents: (comps) => new Interval(comps[0], comps[1]),
	toComponents: (p) => [p.min, p.max],
};
