import {IWaveformDrawerProvider, WaveformPoint} from './waveform';

export class LinearDrawerProvider implements IWaveformDrawerProvider {
	public readonly drawer = (point: WaveformPoint): string =>
		`L ${point[0]} ${point[1]}`;
}

export class CubicBézierDrawerProvider implements IWaveformDrawerProvider {
	private controlPoint(
		current: WaveformPoint,
		previous: WaveformPoint,
		next: WaveformPoint,
		reverse?: boolean,
	): WaveformPoint {
		// When 'current' is the first or last point of the array  'previous' or 'next' don't exist. Replace with 'current'
		const a = previous || current;
		const b = next || current;

		// The smoothing ratio
		const smoothing = 0.2;

		// Properties of the opposed-line
		const lenX = b[0] - a[0];
		const lenY = b[1] - a[1];

		// If is end-control-point, add PI to the angle to go backward
		const length = Math.sqrt(Math.pow(lenX, 2) + Math.pow(lenY, 2)) * smoothing;
		const angle = Math.atan2(lenY, lenX) + (reverse ? Math.PI : 0);

		// The control point position is relative to the current point
		const x = current[0] + Math.cos(angle) * length;
		const y = current[1] + Math.sin(angle) * length;

		return [x, y];
	}

	public readonly drawer = (
		point: WaveformPoint,
		index: number,
		points: WaveformPoint[],
	): string => {
		// start control point
		const [cpsX, cpsY] = this.controlPoint(
			points[index - 1],
			points[index - 2],
			point,
		);
		// end control point
		const [cpeX, cpeY] = this.controlPoint(
			point,
			points[index - 1],
			points[index + 1],
			true,
		);
		return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
	};
}
