import {
	BaseBladeParams,
	BladePlugin,
	createPlugin,
	LabelPropsObject,
	MicroParser,
	parseRecord,
	ValueMap,
} from '@tweakpane/core';

import {ButtonGridApi} from './api/button-grid.js';
import {ButtonGridController} from './controller/button-grid.js';
import {ButtonGridBladeController} from './controller/button-grid-blade.js';

export interface ButtonGridBladeParams extends BaseBladeParams {
	cells: (x: number, y: number) => {title: string};
	size: [number, number];
	view: 'buttongrid';

	label?: string;
}

export const ButtonGridBladePlugin: BladePlugin<ButtonGridBladeParams> =
	createPlugin({
		id: 'buttongrid',
		type: 'blade',

		accept(params) {
			const result = parseRecord<ButtonGridBladeParams>(params, (p) => ({
				cells: p.required.function as MicroParser<
					(x: number, y: number) => {title: string}
				>,
				size: p.required.array(p.required.number) as MicroParser<
					[number, number]
				>,
				view: p.required.constant('buttongrid'),

				label: p.optional.string,
			}));
			return result ? {params: result} : null;
		},
		controller(args) {
			return new ButtonGridBladeController(args.document, {
				blade: args.blade,
				labelProps: ValueMap.fromObject<LabelPropsObject>({
					label: args.params.label,
				}),
				valueController: new ButtonGridController(args.document, {
					cellConfig: args.params.cells,
					size: args.params.size,
				}),
			});
		},
		api(args) {
			if (args.controller instanceof ButtonGridBladeController) {
				return new ButtonGridApi(args.controller);
			}
			return null;
		},
	});
