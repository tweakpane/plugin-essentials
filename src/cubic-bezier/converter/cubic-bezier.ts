import {createNumberFormatter} from '@tweakpane/core';

import {CubicBezier} from '../model/cubic-bezier.js';

export function cubicBezierToString(cb: CubicBezier): string {
	const formatter = createNumberFormatter(2);
	const comps = cb.toObject().map((c) => formatter(c));
	return `cubic-bezier(${comps.join(', ')})`;
}

const COMPS_EMPTY = [0, 0.5, 0.5, 1];

export function cubicBezierFromString(text: string): CubicBezier {
	const m = text.match(
		/^cubic-bezier\s*\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\)$/,
	);
	if (!m) {
		return new CubicBezier(...COMPS_EMPTY);
	}

	const comps = [m[1], m[2], m[3], m[4]].reduce(
		(comps: number[] | null, comp) => {
			if (!comps) {
				return null;
			}

			const n = Number(comp);
			if (isNaN(n)) {
				return null;
			}
			return [...comps, n];
		},
		[],
	);
	return new CubicBezier(...(comps ?? COMPS_EMPTY));
}
