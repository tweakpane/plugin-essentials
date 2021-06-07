import {
	BaseBladeParams,
	BladePlugin,
	Constants,
	initializeBuffer,
	IntervalTicker,
	LabelController,
	LabelPropsObject,
	ManualTicker,
	ParamsParsers,
	parseParams,
	Ticker,
	ValueMap,
} from '@tweakpane/core';

import {FpsGraphBladeApi} from './api/fps-graph';
import {FpsGraphController} from './controller/fps-graph';

export interface FpsGraphBladeParams extends BaseBladeParams {
	view: 'fpsgraph';

	interval?: number;
	label?: string;
	lineCount?: number;
	max?: number;
	min?: number;
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
	accept(params) {
		const p = ParamsParsers;
		const result = parseParams<FpsGraphBladeParams>(params, {
			view: p.required.constant('fpsgraph'),

			interval: p.optional.number,
			label: p.optional.string,
			lineCount: p.optional.number,
			max: p.optional.number,
			min: p.optional.number,
		});
		return result ? {params: result} : null;
	},
	controller(args) {
		const interval = args.params.interval ?? 500;
		return new LabelController(args.document, {
			blade: args.blade,
			props: ValueMap.fromObject<LabelPropsObject>({
				label: args.params.label,
			}),
			valueController: new FpsGraphController(args.document, {
				lineCount: args.params.lineCount ?? 2,
				maxValue: args.params.max ?? 90,
				minValue: args.params.min ?? 0,
				ticker: createTicker(args.document, interval),
				value: initializeBuffer(80),
				viewProps: args.viewProps,
			}),
		});
	},
	api(args) {
		if (!(args.controller instanceof LabelController)) {
			return null;
		}
		if (!(args.controller.valueController instanceof FpsGraphController)) {
			return null;
		}
		return new FpsGraphBladeApi(args.controller);
	},
};
