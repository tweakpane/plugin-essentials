interface Timestamp {
	frameCount: number;
	time: number;
}

const MAX_TIMESTAMPS = 20;

export class Fpswatch {
	private start_: number | null = null;
	private duration_ = 0;
	private fps_: number | null = null;
	private frameCount_ = 0;
	private timestamps_: Timestamp[] = [];

	get duration(): number {
		return this.duration_;
	}

	get fps(): number | null {
		return this.fps_;
	}

	public begin(now: Date): void {
		this.start_ = now.getTime();
	}

	private calculateFps_(nowTime: number): number | null {
		if (this.timestamps_.length === 0) {
			return null;
		}

		const ts = this.timestamps_[0];
		return (1000 * (this.frameCount_ - ts.frameCount)) / (nowTime - ts.time);
	}

	private compactTimestamps_(): void {
		if (this.timestamps_.length <= MAX_TIMESTAMPS) {
			return;
		}

		const len = this.timestamps_.length - MAX_TIMESTAMPS;
		this.timestamps_.splice(0, len);

		const df = this.timestamps_[0].frameCount;
		this.timestamps_.forEach((ts) => {
			ts.frameCount -= df;
		});
		this.frameCount_ -= df;
	}

	public end(now: Date): void {
		if (this.start_ === null) {
			return;
		}

		const t = now.getTime();
		this.duration_ = t - this.start_;
		this.start_ = null;

		this.fps_ = this.calculateFps_(t);

		this.timestamps_.push({
			frameCount: this.frameCount_,
			time: t,
		});
		++this.frameCount_;

		this.compactTimestamps_();
	}
}
