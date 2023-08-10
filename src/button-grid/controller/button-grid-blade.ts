import {
	Blade,
	BladeController,
	LabelController,
	LabelProps,
	LabelView,
} from '@tweakpane/core';

import {ButtonGridController} from './button-grid.js';

interface Config {
	blade: Blade;
	labelProps: LabelProps;
	valueController: ButtonGridController;
}

export class ButtonGridBladeController extends BladeController<LabelView> {
	public readonly labelController: LabelController<ButtonGridController>;
	public readonly valueController: ButtonGridController;

	constructor(doc: Document, config: Config) {
		const bc = config.valueController;
		const lc = new LabelController(doc, {
			blade: config.blade,
			props: config.labelProps,
			valueController: bc,
		});
		super({
			blade: config.blade,
			view: lc.view,
			viewProps: bc.viewProps,
		});

		this.valueController = bc;
		this.labelController = lc;
	}
}
