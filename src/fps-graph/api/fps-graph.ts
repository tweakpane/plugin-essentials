import {BladeApi, LabelController} from '@tweakpane/core';

import {FpsGraphController} from '../controller/fps-graph';

export class FpsGraphBladeApi extends BladeApi<
	LabelController<FpsGraphController>
> {
	public begin(): void {
		this.controller_.valueController.begin();
	}

	public end(): void {
		this.controller_.valueController.end();
	}
}
