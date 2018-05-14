import { SCREEN_WIDTH, WORLD_WIDTH, WIDTH, HEIGHT } from "./config";
import { Bullet, State, Position, Action, Actions } from "./types";
import { worldCoordinates } from "./utils";

const BULLET_SPEED = 500;
const BULLET_DAMAGE = 50;

function bulletPosition(bullet: Bullet, delta: number): Position {
  let rad = bullet.angle / 57.2958;
  let dy = -1 * BULLET_SPEED * Math.cos(rad) * delta;
  let dx = BULLET_SPEED * Math.sin(rad) * delta;
  return {
    x: bullet.position.x + dx,
    y: bullet.position.y + dy
  };
}

function spawnBullet(playerPosition: Position, direction: string): Bullet {
  return {
    position: {
      x: playerPosition.x + WIDTH["player"] / 2,
      y: playerPosition.y + HEIGHT["player"] / 2 - 30
    },
    damage: BULLET_DAMAGE,
    angle: direction === "left" ? -90 : 90
  };
}

export function bulletReducer(
  bullets: Array<Bullet>,
  state: State,
  action: Action
): Array<Bullet> {
  if (action.type === Actions.LOAD_LEVEL) {
    return [];
  } else if (action.type === Actions.TIMESTEP) {
    return bullets.map(bullet => {
      const position = bulletPosition(bullet, action.delta);
      return { ...bullet, position };
    });
  } else if (action.type === Actions.BULLET_FIRED) {
    return bullets.concat([
      spawnBullet(state.player.position, state.player.direction)
    ]);
  } else if (action.type === Actions.COLLISION) {
    if (action.collided === "ZOMBIE_BULLET") {
      let bulletsFired = [...bullets];
      bulletsFired.splice(action.data.bullet, 1);
      return bulletsFired;
    }
  }

  return bullets;
}
