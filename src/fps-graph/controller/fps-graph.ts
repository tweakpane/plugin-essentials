import {
	BufferedValue,
	Controller,
	createNumberFormatter,
	createPushedBuffer,
	GraphLogController,
	Ticker,
	ViewProps,
} from '@tweakpane/core';

import {Fpswatch} from '../model/stopwatch';
import {FpsView} from '../view/fps';

interface Config {
	lineCount: number;
	maxValue: number;
	minValue: number;
	ticker: Ticker;
	value: BufferedValue<number>;
	viewProps: ViewProps;
}

export class FpsGraphController implements Controller<FpsView> {
	public readonly view: FpsView;
	public readonly viewProps: ViewProps;
	private readonly value_: BufferedValue<number>;
	private readonly graphC_: GraphLogController;
	private readonly stopwatch_ = new Fpswatch();
	private ticker_: Ticker;

	constructor(doc: Document, config: Config) {
		this.onTick_ = this.onTick_.bind(this);

		this.ticker_ = config.ticker;
		this.ticker_.emitter.on('tick', this.onTick_);

		this.value_ = config.value;
		this.viewProps = config.viewProps;

		this.view = new FpsView(doc, {
			viewProps: this.viewProps,
		});

		this.graphC_ = new GraphLogController(doc, {
			formatter: createNumberFormatter(0),
			lineCount: config.lineCount,
			maxValue: config.maxValue,
			minValue: config.minValue,
			value: this.value_,
			viewProps: this.viewProps,
		});
		this.view.graphElement.appendChild(this.graphC_.view.element);

		this.viewProps.handleDispose(() => {
			this.graphC_.viewProps.set('disposed', true);
			this.ticker_.dispose();
		});
	}

	public begin(): void {
		this.stopwatch_.begin(new Date());
	}

	public end(): void {
		this.stopwatch_.end(new Date());
	}

	private onTick_(): void {
		const fps = this.stopwatch_.fps;
		if (fps !== null) {
			const buffer = this.value_.rawValue;
			this.value_.rawValue = createPushedBuffer(buffer, fps);
			this.view.valueElement.textContent = fps.toFixed(0);
		}
	}
}
