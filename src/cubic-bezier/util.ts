import {Constraint, PointNdConstraint, RangeConstraint} from '@tweakpane/core';

import {CubicBezier} from '..';
import {CubicBezierAssembly} from './model/cubic-bezier';

export function createConstraint(): Constraint<CubicBezier> {
	return new PointNdConstraint<CubicBezier>({
		assembly: CubicBezierAssembly,
		components: [0, 1, 2, 3].map((index) =>
			index % 2 === 0
				? new RangeConstraint({
						min: 0,
						max: 1,
				  })
				: undefined,
		),
	});
}
