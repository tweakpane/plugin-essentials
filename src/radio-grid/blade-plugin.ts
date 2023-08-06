import {
	BaseBladeParams,
	BladePlugin,
	createPlugin,
	createValue,
	LabeledValueBladeController,
	LabelPropsObject,
	MicroParser,
	parseRecord,
	ValueMap,
} from '@tweakpane/core';

import {RadioGridApi} from './api/radio-grid.js';
import {RadioGridController} from './controller/radio-grid.js';

export interface RadioGridBladeParams<T> extends BaseBladeParams {
	cells: (
		x: number,
		y: number,
	) => {
		title: string;
		value: T;
	};
	groupName: string;
	size: [number, number];
	value: T;
	view: 'radiogrid';

	label?: string;
}

export const RadioGridBladePlugin = (function <T>(): BladePlugin<
	RadioGridBladeParams<T>
> {
	return createPlugin({
		id: 'radiogrid',
		type: 'blade',

		accept(params) {
			const result = parseRecord<RadioGridBladeParams<T>>(params, (p) => ({
				cells: p.required.function as MicroParser<
					(
						x: number,
						y: number,
					) => {
						title: string;
						value: T;
					}
				>,
				groupName: p.required.string,
				size: p.required.array(p.required.number) as MicroParser<
					[number, number]
				>,
				value: p.required.raw as MicroParser<T>,
				view: p.required.constant('radiogrid'),

				label: p.optional.string,
			}));
			return result ? {params: result} : null;
		},
		controller(args) {
			const value = createValue(args.params.value);
			return new LabeledValueBladeController(args.document, {
				blade: args.blade,
				props: ValueMap.fromObject<LabelPropsObject>({
					label: args.params.label,
				}),
				value: value,
				valueController: new RadioGridController(args.document, {
					groupName: args.params.groupName,
					cellConfig: args.params.cells,
					size: args.params.size,
					value: value,
				}),
			});
		},
		api(args) {
			if (!(args.controller instanceof LabeledValueBladeController)) {
				return null;
			}
			if (!(args.controller.valueController instanceof RadioGridController)) {
				return null;
			}
			return new RadioGridApi(args.controller);
		},
	});
})();
