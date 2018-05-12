const FPS = 12;
const SECONDS_PER_FRAME = 1 / FPS;

export default class Animation {
  elapsed: number = 0;
  frames = [];
  name = "";
  playcount = 0;

  constructor(frames, name = "empty") {
    this.frames = frames;
    this.name = name;
  }

  getFrame(delta: number) {
    if (this.frames.length === 1) {
      return this.frames[0];
    }

    this.elapsed += delta;
    const frameNum = Math.floor(
      (this.elapsed / SECONDS_PER_FRAME) % this.frames.length
    );

    if (frameNum === this.frames.length - 1) {
      this.playcount++;
    }

    return this.frames[frameNum];
  }
}
