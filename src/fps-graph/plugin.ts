import {
	BaseBladeParams,
	BladePlugin,
	Constants,
	createValue,
	initializeBuffer,
	IntervalTicker,
	LabelPropsObject,
	ManualTicker,
	parseRecord,
	Ticker,
	ValueMap,
	VERSION,
} from '@tweakpane/core';

import {FpsGraphBladeApi} from './api/fps-graph.js';
import {FpsGraphController} from './controller/fps-graph.js';
import {FpsGraphBladeController} from './controller/fps-graph-blade.js';

export interface FpsGraphBladeParams extends BaseBladeParams {
	view: 'fpsgraph';

	interval?: number;
	label?: string;
	max?: number;
	min?: number;
	rows?: number;
}

function createTicker(
	document: Document,
	interval: number | undefined,
): Ticker {
	return interval === 0
		? new ManualTicker()
		: new IntervalTicker(
				document,
				interval ?? Constants.monitor.defaultInterval,
		  );
}

export const FpsGraphBladePlugin: BladePlugin<FpsGraphBladeParams> = {
	id: 'fpsgraph',
	type: 'blade',
	core: VERSION,

	accept(params) {
		const result = parseRecord<FpsGraphBladeParams>(params, (p) => ({
			view: p.required.constant('fpsgraph'),

			interval: p.optional.number,
			label: p.optional.string,
			rows: p.optional.number,
			max: p.optional.number,
			min: p.optional.number,
		}));
		return result ? {params: result} : null;
	},
	controller(args) {
		const interval = args.params.interval ?? 500;
		return new FpsGraphBladeController(args.document, {
			blade: args.blade,
			labelProps: ValueMap.fromObject<LabelPropsObject>({
				label: args.params.label,
			}),
			valueController: new FpsGraphController(args.document, {
				rows: args.params.rows ?? 2,
				maxValue: args.params.max ?? 90,
				minValue: args.params.min ?? 0,
				ticker: createTicker(args.document, interval),
				value: createValue(initializeBuffer(80)),
				viewProps: args.viewProps,
			}),
		});
	},
	api(args) {
		if (!(args.controller instanceof FpsGraphBladeController)) {
			return null;
		}
		return new FpsGraphBladeApi(args.controller);
	},
};
