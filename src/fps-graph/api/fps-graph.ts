import {BladeApi} from '@tweakpane/core';

import {FpsGraphBladeController} from '../controller/fps-graph-blade.js';

export class FpsGraphBladeApi extends BladeApi<FpsGraphBladeController> {
	get fps(): number | null {
		return this.controller.valueController.fps;
	}

	get max(): number {
		return this.controller.valueController.props.get('max');
	}

	set max(max: number) {
		this.controller.valueController.props.set('max', max);
	}

	get min(): number {
		return this.controller.valueController.props.get('min');
	}

	set min(min: number) {
		this.controller.valueController.props.set('min', min);
	}

	public begin(): void {
		this.controller.valueController.begin();
	}

	public end(): void {
		this.controller.valueController.end();
	}
}
