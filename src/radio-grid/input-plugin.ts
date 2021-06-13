import {
	BaseInputParams,
	InputBindingPlugin,
	numberFromUnknown,
	ParamsParser,
	ParamsParsers,
	parseParams,
	writePrimitive,
} from '@tweakpane/core';

import {RadioGridController} from './controller/radio-grid';

interface RadioGridInputParams<T> extends BaseInputParams {
	cells: (
		x: number,
		y: number,
	) => {
		title: string;
		value: T;
	};
	groupName: string;
	size: [number, number];
	view: 'radiogrid';
}

export const RadioGridNumberInputPlugin: InputBindingPlugin<
	number,
	number,
	RadioGridInputParams<number>
> = {
	id: 'input-radiogrid',
	type: 'input',
	accept(value, params) {
		if (typeof value !== 'number') {
			return null;
		}

		const p = ParamsParsers;
		const result = parseParams<RadioGridInputParams<number>>(params, {
			cells: p.required.function as ParamsParser<
				(
					x: number,
					y: number,
				) => {
					title: string;
					value: number;
				}
			>,
			groupName: p.required.string,
			size: p.required.array(p.required.number) as ParamsParser<
				[number, number]
			>,
			view: p.required.constant('radiogrid'),
		});
		return result
			? {
					initialValue: value,
					params: result,
			  }
			: null;
	},
	binding: {
		reader: (_args) => numberFromUnknown,
		writer: (_args) => writePrimitive,
	},
	controller: (args) => {
		return new RadioGridController(args.document, {
			cellConfig: args.params.cells,
			groupName: args.params.groupName,
			size: args.params.size,
			value: args.value,
		});
	},
};
