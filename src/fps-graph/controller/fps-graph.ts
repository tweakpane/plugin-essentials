import {
	BufferedValue,
	Controller,
	createNumberFormatter,
	createPushedBuffer,
	GraphLogController,
	Ticker,
	ViewProps,
} from '@tweakpane/core';
// TODO: Export GraphLogProps in @tweakpane/core
import {GraphLogProps} from '@tweakpane/core/dist/monitor-binding/number/view/graph-log.js';

import {Fpswatch} from '../model/stopwatch.js';
import {FpsView} from '../view/fps.js';

interface Config {
	props: GraphLogProps;
	rows: number;
	ticker: Ticker;
	value: BufferedValue<number>;
	viewProps: ViewProps;
}

export class FpsGraphController implements Controller<FpsView> {
	public readonly props: GraphLogProps;
	public readonly ticker: Ticker;
	public readonly view: FpsView;
	public readonly viewProps: ViewProps;
	private readonly value_: BufferedValue<number>;
	private readonly graphC_: GraphLogController;
	private readonly stopwatch_ = new Fpswatch();

	constructor(doc: Document, config: Config) {
		this.onTick_ = this.onTick_.bind(this);

		this.ticker = config.ticker;
		this.ticker.emitter.on('tick', this.onTick_);

		this.props = config.props;
		this.value_ = config.value;
		this.viewProps = config.viewProps;

		this.view = new FpsView(doc, {
			viewProps: this.viewProps,
		});

		this.graphC_ = new GraphLogController(doc, {
			formatter: createNumberFormatter(0),
			props: this.props,
			rows: config.rows,
			value: this.value_,
			viewProps: this.viewProps,
		});
		this.view.graphElement.appendChild(this.graphC_.view.element);

		this.viewProps.handleDispose(() => {
			this.graphC_.viewProps.set('disposed', true);
			this.ticker.dispose();
		});
	}

	get fps(): number | null {
		return this.stopwatch_.fps;
	}

	public begin(): void {
		this.stopwatch_.begin(new Date());
	}

	public end(): void {
		this.stopwatch_.end(new Date());
	}

	private onTick_(): void {
		const fps = this.fps;
		if (fps !== null) {
			const buffer = this.value_.rawValue;
			this.value_.rawValue = createPushedBuffer(buffer, fps);
			this.view.valueElement.textContent = fps.toFixed(0);
		}
	}
}
