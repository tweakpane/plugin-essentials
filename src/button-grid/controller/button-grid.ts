import {
	ButtonController,
	ButtonPropsObject,
	Controller,
	PlainView,
	ValueMap,
	ViewProps,
} from '@tweakpane/core';

interface CellConfig {
	title: string;
}

interface Config {
	size: [number, number];
	cellConfig: (x: number, y: number) => CellConfig;
}
export type ButtonGridControllerConfig = Config;

export class ButtonGridController implements Controller<PlainView> {
	public readonly size: [number, number];
	public readonly view: PlainView;
	public readonly viewProps: ViewProps;
	private cellCs_: ButtonController[];

	constructor(doc: Document, config: Config) {
		this.size = config.size;

		const [w, h] = this.size;
		const bcs = [];
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				const bc = new ButtonController(doc, {
					props: ValueMap.fromObject<ButtonPropsObject>({
						...config.cellConfig(x, y),
					}),
					viewProps: ViewProps.create(),
				});
				bcs.push(bc);
			}
		}
		this.cellCs_ = bcs;

		this.viewProps = ViewProps.create();
		this.viewProps.handleDispose(() => {
			this.cellCs_.forEach((c) => {
				c.viewProps.set('disposed', true);
			});
		});

		this.view = new PlainView(doc, {
			viewProps: this.viewProps,
			viewName: 'btngrid',
		});
		this.view.element.style.gridTemplateColumns = `repeat(${w}, 1fr)`;

		this.cellCs_.forEach((bc) => {
			this.view.element.appendChild(bc.view.element);
		});
	}

	get cellControllers(): ButtonController[] {
		return this.cellCs_;
	}
}
