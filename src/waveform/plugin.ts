import {
	BaseMonitorParams,
	Controller,
	MonitorBindingPlugin,
	ParamsParsers,
	parseParams,
	ValueMap,
	View,
} from '@tweakpane/core';
import {BindingReader} from '@tweakpane/core/dist/cjs/common/binding/binding';

import {WaveformController} from './controller/waveform';
import {WaveformStyles, WaveformValue} from './view/waveform';

export interface WaveformMonitorParams extends BaseMonitorParams {
	max?: number;
	min?: number;
	style?: WaveformStyles;
}

function shouldShowWaveform(params: WaveformMonitorParams): boolean {
	return 'view' in params && params.view === 'waveform';
}

function isWaveformType(value: unknown): value is WaveformValue & boolean {
	if (typeof value === 'object') {
		return 'length' in (value as Record<string, unknown>);
	}
	return false;
}

export const WaveformPlugin: MonitorBindingPlugin<
	WaveformValue,
	WaveformMonitorParams
> = {
	id: 'monitor-waveform',
	type: 'monitor',
	css: '__css__',

	accept: (value, params) => {
		if (!isWaveformType(value)) {
			return null;
		}
		const p = ParamsParsers;
		const result = parseParams<WaveformMonitorParams>(params, {
			max: p.optional.number,
			min: p.optional.number,
			style: p.optional.custom<WaveformStyles>((value) =>
				value === 'linear' || value === 'bezier' ? value : undefined,
			),
			view: p.optional.string,
		});
		return result ? {initialValue: value, params: result} : null;
	},
	binding: {
		defaultBufferSize: (params) => (shouldShowWaveform(params) ? 64 : 1),
		reader:
			(_args): BindingReader<WaveformValue> =>
			(exValue: unknown): WaveformValue => {
				if (isWaveformType(exValue)) {
					return exValue as WaveformValue;
				}
				return [];
			},
	},
	controller: (args) => {
		return new WaveformController(args.document, {
			props: ValueMap.fromObject({
				maxValue: ('max' in args.params ? args.params.max : null) ?? 100,
				minValue: ('min' in args.params ? args.params.min : null) ?? 0,
				lineStyle:
					('style' in args.params ? args.params.style : null) ?? 'linear',
			}),
			value: args.value,
			viewProps: args.viewProps,
		});
	},
};
