const FPS = 12;
const SECONDS_PER_FRAME = 1 / FPS;

export default class Animation {
  elapsed: number = 0;
  frames = [];
  constructor(frames) {
    this.frames = frames;
  }

  getFrame(delta: number) {
    if (this.frames.length === 1) {
      return this.frames[0];
    }

    this.elapsed += delta;
    const fractionalTime = this.elapsed % 1;
    const frameNum = Math.floor(
      fractionalTime / SECONDS_PER_FRAME * (this.frames.length / FPS)
    );
    return this.frames[frameNum];
  }
}
