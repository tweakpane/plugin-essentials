import {
	bindFoldable,
	bindValue,
	connectValues,
	findNextTarget,
	Foldable,
	forceCast,
	NumberTextProps,
	PickerLayout,
	PopupController,
	supportsTouch,
	TextController,
	Value,
	ValueController,
	ValueMap,
	ViewProps,
} from '@tweakpane/core';

import {
	cubicBezierFromString,
	cubicBezierToString,
} from '../converter/cubic-bezier.js';
import {CubicBezier} from '../model/cubic-bezier.js';
import {CubicBezierView} from '../view/cubic-bezier.js';
import {CubicBezierPickerController} from './cubic-bezier-picker.js';

interface Axis {
	textProps: NumberTextProps;
}

interface Config {
	axis: Axis;
	expanded: boolean;
	pickerLayout: PickerLayout;
	value: Value<CubicBezier>;
	viewProps: ViewProps;
}

export class CubicBezierController
	implements ValueController<CubicBezier, CubicBezierView>
{
	public readonly value: Value<CubicBezier>;
	public readonly view: CubicBezierView;
	public readonly viewProps: ViewProps;
	private readonly tc_: TextController<CubicBezier>;
	private readonly popC_: PopupController | null;
	private readonly pickerC_: CubicBezierPickerController;
	private readonly foldable_: Foldable;

	constructor(doc: Document, config: Config) {
		this.onButtonBlur_ = this.onButtonBlur_.bind(this);
		this.onButtonClick_ = this.onButtonClick_.bind(this);
		this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
		this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);

		this.value = config.value;
		this.viewProps = config.viewProps;
		this.foldable_ = Foldable.create(config.expanded);

		this.view = new CubicBezierView(doc, {
			foldable: this.foldable_,
			pickerLayout: config.pickerLayout,
			viewProps: this.viewProps,
		});
		this.view.buttonElement.addEventListener('blur', this.onButtonBlur_);
		this.view.buttonElement.addEventListener('click', this.onButtonClick_);

		this.tc_ = new TextController(doc, {
			parser: cubicBezierFromString,
			props: ValueMap.fromObject({
				formatter: cubicBezierToString,
			}),
			value: this.value,
			viewProps: this.viewProps,
		});
		this.view.textElement.appendChild(this.tc_.view.element);

		this.popC_ =
			config.pickerLayout === 'popup'
				? new PopupController(doc, {
						viewProps: this.viewProps,
				  })
				: null;

		const pickerC = new CubicBezierPickerController(doc, {
			axis: config.axis,
			value: this.value,
			viewProps: this.viewProps,
		});
		pickerC.allFocusableElements.forEach((elem) => {
			elem.addEventListener('blur', this.onPopupChildBlur_);
			elem.addEventListener('keydown', this.onPopupChildKeydown_);
		});
		this.pickerC_ = pickerC;

		if (this.popC_) {
			this.view.element.appendChild(this.popC_.view.element);
			this.popC_.view.element.appendChild(this.pickerC_.view.element);
			bindValue(this.popC_.shows, (shows) => {
				if (shows) {
					pickerC.refresh();
				}
			});
			connectValues({
				primary: this.foldable_.value('expanded'),
				secondary: this.popC_.shows,
				forward: (p) => p,
				backward: (_, s) => s,
			});
		} else if (this.view.pickerElement) {
			this.view.pickerElement.appendChild(this.pickerC_.view.element);
			bindFoldable(this.foldable_, this.view.pickerElement);
		}
	}

	private onButtonBlur_(ev: FocusEvent): void {
		if (!this.popC_) {
			return;
		}

		const nextTarget: HTMLElement | null = forceCast(ev.relatedTarget);
		if (!nextTarget || !this.popC_.view.element.contains(nextTarget)) {
			this.popC_.shows.rawValue = false;
		}
	}

	private onButtonClick_(): void {
		this.foldable_.set('expanded', !this.foldable_.get('expanded'));
		if (this.foldable_.get('expanded')) {
			this.pickerC_.allFocusableElements[0].focus();
		}
	}

	private onPopupChildBlur_(ev: FocusEvent): void {
		if (!this.popC_) {
			return;
		}

		const elem = this.popC_.view.element;
		const nextTarget = findNextTarget(ev);
		if (nextTarget && elem.contains(nextTarget)) {
			// Next target is in the popup
			return;
		}
		if (
			nextTarget &&
			nextTarget === this.view.buttonElement &&
			!supportsTouch(elem.ownerDocument)
		) {
			// Next target is the trigger button
			return;
		}

		this.popC_.shows.rawValue = false;
	}

	private onPopupChildKeydown_(ev: KeyboardEvent): void {
		if (!this.popC_) {
			return;
		}

		if (ev.key === 'Escape') {
			this.popC_.shows.rawValue = false;
		}
	}
}
