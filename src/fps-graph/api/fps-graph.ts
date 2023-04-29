import {BladeApi} from '@tweakpane/core';

import {FpsGraphBladeController} from '../controller/fps-graph-blade.js';

export class FpsGraphBladeApi extends BladeApi<FpsGraphBladeController> {
	public begin(): void {
		this.controller.valueController.begin();
	}

	public end(): void {
		this.controller.valueController.end();
	}
}
