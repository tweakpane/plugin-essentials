import {
	BaseBladeParams,
	BladePlugin,
	LabelController,
	LabelPropsObject,
	ParamsParser,
	ParamsParsers,
	parseParams,
	ValueMap,
} from '@tweakpane/core';

import {ButtonGridApi} from './api/button-grid';
import {ButtonGridController} from './controller/button-grid';

export interface ButtonGridBladeParams extends BaseBladeParams {
	cells: (x: number, y: number) => {title: string};
	size: [number, number];
	view: 'buttongrid';

	label?: string;
}

export const ButtonGridBladePlugin: BladePlugin<ButtonGridBladeParams> = {
	id: 'buttongrid',
	type: 'blade',
	// TODO:
	css: '__css__',

	accept(params) {
		const p = ParamsParsers;
		const result = parseParams<ButtonGridBladeParams>(params, {
			cells: p.required.function as ParamsParser<
				(x: number, y: number) => {title: string}
			>,
			size: p.required.array(p.required.number) as ParamsParser<
				[number, number]
			>,
			view: p.required.constant('buttongrid'),

			label: p.optional.string,
		});
		return result ? {params: result} : null;
	},
	controller(args) {
		return new LabelController(args.document, {
			blade: args.blade,
			props: ValueMap.fromObject<LabelPropsObject>({
				label: args.params.label,
			}),
			valueController: new ButtonGridController(args.document, {
				cellConfig: args.params.cells,
				size: args.params.size,
			}),
		});
	},
	api(args) {
		if (!(args.controller instanceof LabelController)) {
			return null;
		}
		if (!(args.controller.valueController instanceof ButtonGridController)) {
			return null;
		}
		return new ButtonGridApi(args.controller);
	},
};
