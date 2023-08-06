import {
	BaseInputParams,
	boolFromUnknown,
	createPlugin,
	InputBindingPlugin,
	MicroParser,
	numberFromUnknown,
	parseRecord,
	stringFromUnknown,
	writePrimitive,
} from '@tweakpane/core';

import {RadioGridController} from './controller/radio-grid.js';

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

function createRadioGridInputPlugin<T>(config: {
	isType: (value: unknown) => value is T;
	binding: InputBindingPlugin<T, T, RadioGridInputParams<T>>['binding'];
}): InputBindingPlugin<T, T, RadioGridInputParams<T>> {
	return createPlugin({
		id: 'input-radiogrid',
		type: 'input',

		accept(value, params) {
			if (!config.isType(value)) {
				return null;
			}

			const result = parseRecord<RadioGridInputParams<T>>(params, (p) => ({
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
				view: p.required.constant('radiogrid'),
			}));
			return result
				? {
						initialValue: value,
						params: result,
				  }
				: null;
		},
		binding: config.binding,
		controller: (args) => {
			return new RadioGridController(args.document, {
				cellConfig: args.params.cells,
				groupName: args.params.groupName,
				size: args.params.size,
				value: args.value,
			});
		},
	});
}

export const RadioGruidNumberInputPlugin = createRadioGridInputPlugin<number>({
	isType: (value: unknown): value is number => {
		return typeof value === 'number';
	},
	binding: {
		reader: (_args) => numberFromUnknown,
		writer: (_args) => writePrimitive,
	},
});

export const RadioGruidStringInputPlugin = createRadioGridInputPlugin<string>({
	isType: (value: unknown): value is string => {
		return typeof value === 'string';
	},
	binding: {
		reader: (_args) => stringFromUnknown,
		writer: (_args) => writePrimitive,
	},
});

export const RadioGruidBooleanInputPlugin = createRadioGridInputPlugin<boolean>(
	{
		isType: (value: unknown): value is boolean => {
			return typeof value === 'boolean';
		},
		binding: {
			reader: (_args) => boolFromUnknown,
			writer: (_args) => writePrimitive,
		},
	},
);
