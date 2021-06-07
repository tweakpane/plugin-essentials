import {
	BaseBladeParams,
	BladePlugin,
	createValue,
	LabeledValueController,
	LabelPropsObject,
	ParamsParser,
	ParamsParsers,
	parseParams,
	ValueMap,
} from '@tweakpane/core';

import {RadioGridApi} from './api/radio-grid';
import {RadioGridController} from './controller/radio-grid';

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
	return {
		id: 'radiogrid',
		type: 'blade',

		accept(params) {
			const p = ParamsParsers;
			const result = parseParams<RadioGridBladeParams<T>>(params, {
				cells: p.required.function as ParamsParser<
					(
						x: number,
						y: number,
					) => {
						title: string;
						value: T;
					}
				>,
				groupName: p.required.string,
				size: p.required.array(p.required.number) as ParamsParser<
					[number, number]
				>,
				value: p.required.raw as ParamsParser<T>,
				view: p.required.constant('radiogrid'),

				label: p.optional.string,
			});
			return result ? {params: result} : null;
		},
		controller(args) {
			return new LabeledValueController(args.document, {
				blade: args.blade,
				props: ValueMap.fromObject<LabelPropsObject>({
					label: args.params.label,
				}),
				valueController: new RadioGridController(args.document, {
					groupName: args.params.groupName,
					cellConfig: args.params.cells,
					size: args.params.size,
					value: createValue(args.params.value),
				}),
			});
		},
		api(args) {
			if (!(args.controller instanceof LabeledValueController)) {
				return null;
			}
			if (!(args.controller.valueController instanceof RadioGridController)) {
				return null;
			}
			return new RadioGridApi(args.controller);
		},
	};
})();
