import {TpPlugin} from '@tweakpane/core';

import {ButtonGridBladePlugin} from './button-grid/plugin.js';
import {CubicBezierBladePlugin} from './cubic-bezier/plugin.js';
import {FpsGraphBladePlugin} from './fps-graph/plugin.js';
import {IntervalInputPlugin} from './interval/plugin.js';
import {RadioGridBladePlugin} from './radio-grid/blade-plugin.js';
import {
	RadioGruidBooleanInputPlugin,
	RadioGruidNumberInputPlugin,
	RadioGruidStringInputPlugin,
} from './radio-grid/input-plugin.js';

export const id = 'essentials';
export const css = '__css__';
export const plugins: TpPlugin[] = [
	ButtonGridBladePlugin,
	CubicBezierBladePlugin,
	FpsGraphBladePlugin,
	IntervalInputPlugin,
	RadioGridBladePlugin,
	RadioGruidBooleanInputPlugin,
	RadioGruidNumberInputPlugin,
	RadioGruidStringInputPlugin,
];

export * from './button-grid/api/button-cell.js';
export * from './button-grid/api/button-grid.js';
export * from './button-grid/controller/button-grid.js';

export * from './cubic-bezier/api/cubic-bezier.js';
export * from './cubic-bezier/controller/cubic-bezier.js';
export * from './cubic-bezier/controller/cubic-bezier-graph.js';
export * from './cubic-bezier/controller/cubic-bezier-picker.js';
export * from './cubic-bezier/model/cubic-bezier.js';
export * from './cubic-bezier/view/cubic-bezier.js';
export * from './cubic-bezier/view/cubic-bezier-graph.js';
export * from './cubic-bezier/view/cubic-bezier-picker.js';
export * from './cubic-bezier/view/cubic-bezier-preview.js';

export * from './fps-graph/api/fps-graph.js';
export * from './fps-graph/controller/fps-graph.js';
export * from './fps-graph/model/stopwatch.js';
export * from './fps-graph/view/fps.js';

export * from './interval/constraint/interval.js';
export * from './interval/controller/range-slider.js';
export * from './interval/controller/range-slider-text.js';
export * from './interval/model/interval.js';
export * from './interval/view/range-slider.js';
export * from './interval/view/range-slider-text.js';

export * from './radio-grid/api/radio-cell-api.js';
export * from './radio-grid/api/radio-grid.js';
export * from './radio-grid/api/tp-radio-grid-event.js';
export * from './radio-grid/controller/radio.js';
export * from './radio-grid/controller/radio-grid.js';
export * from './radio-grid/view/radio.js';
