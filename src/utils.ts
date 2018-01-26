import { SCREEN_HEIGHT, SCREEN_WIDTH, WIDTH, HEIGHT } from "./config";

export function distFromCenter(obj: any): number {
  let dx = obj.x - SCREEN_WIDTH / 2;
  let dy = obj.y - SCREEN_HEIGHT / 2;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

export function worldCoordinates(screenCoordinates, state) {
  let shift_x = state.player.x - SCREEN_WIDTH / 2;
  let shift_y = state.player.y - SCREEN_HEIGHT / 2;

  return {
    x: screenCoordinates.x - state.background.x + shift_x,
    y: screenCoordinates.y - state.background.y + shift_y
  };
}

export function overlaps(r1, r2) {
  return (
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y
  );
}
