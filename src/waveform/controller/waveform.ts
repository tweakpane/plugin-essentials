import {BufferedValue, Controller, ViewProps} from '@tweakpane/core';

import {WaveformProps, WaveformValue, WaveformView} from '../view/waveform';

interface Config {
	value: BufferedValue<WaveformValue>;
	viewProps: ViewProps;
	props: WaveformProps;
}

// Custom controller class should implement `Controller` interface
export class WaveformController implements Controller<WaveformView> {
	public readonly value: BufferedValue<WaveformValue>;
	public readonly view: WaveformView;
	public readonly viewProps: ViewProps;
	private readonly props: WaveformProps;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.props = config.props;
		this.viewProps = config.viewProps;
		this.viewProps.handleDispose(() => {
			// Nothing to do
		});

		this.view = new WaveformView(doc, {
			value: this.value,
			viewProps: this.viewProps,
			props: this.props,
		});
	}
}
