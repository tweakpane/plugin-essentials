import {TpPlugin} from '@tweakpane/core';

import {ButtonGridBladePlugin} from './button-grid/plugin';
import {CubicBezierBladePlugin} from './cubic-bezier/plugin-blade';
import {NumberArrayCubicBezierInputPlugin} from './cubic-bezier/plugin-input-number-array';
import {FpsGraphBladePlugin} from './fps-graph/plugin';
import {IntervalInputPlugin} from './interval/plugin';
import {RadioGridBladePlugin} from './radio-grid/blade-plugin';
import {RadioGridNumberInputPlugin} from './radio-grid/input-plugin';

export {CubicBezier} from './cubic-bezier/model/cubic-bezier';

export const plugins: TpPlugin[] = [
	ButtonGridBladePlugin,
	FpsGraphBladePlugin,
	IntervalInputPlugin,
	RadioGridBladePlugin,
	RadioGridNumberInputPlugin,
	// cubic-bezier
	CubicBezierBladePlugin,
	NumberArrayCubicBezierInputPlugin,
];
