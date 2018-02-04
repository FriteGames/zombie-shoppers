import { SCREEN_HEIGHT, SCREEN_WIDTH, WIDTH, HEIGHT, WORLD_HEIGHT, WORLD_WIDTH } from "./config";
import { Position, State } from "./types";

export function distanceFromScreenCenter(obj: any): number {
  let dx = obj.x - SCREEN_WIDTH / 2;
  let dy = obj.y - SCREEN_HEIGHT / 2;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

export function distanceFromWorldCenter(obj: any): number {
  let dx = obj.x - WORLD_WIDTH / 2;
  let dy = obj.y - WORLD_HEIGHT / 2;
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

export function getRect(position: Position, objname: string) {
  return {
    x: position.x,
    y: position.y,
    width: WIDTH[objname],
    height: HEIGHT[objname]
  };
}

export function worldCoordinates(screenCoordinates: Position, reference: Position): Position {
  // calculate the world's shift
  const worldshift_x = SCREEN_WIDTH / 2 - reference.x;
  const worldshift_y = SCREEN_HEIGHT / 2 - reference.y;

  return {
    x: screenCoordinates.x - worldshift_x,
    y: screenCoordinates.y - worldshift_y
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
