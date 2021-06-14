import {BladeApi, LabeledValueController} from '@tweakpane/core';

import {CubicBezierController} from '../controller/cubic-bezier';
import {CubicBezier} from '../model/cubic-bezier';

export class CubicBezierApi extends BladeApi<
	LabeledValueController<CubicBezier, CubicBezierController>
> {
	get label(): string | undefined {
		return this.controller_.props.get('label');
	}

	set label(label: string | undefined) {
		this.controller_.props.set('label', label);
	}

	get value(): CubicBezier {
		return this.controller_.valueController.value.rawValue;
	}
}
