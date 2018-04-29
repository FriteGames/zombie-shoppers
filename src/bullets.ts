import { SCREEN_WIDTH, WORLD_WIDTH } from "./config";
import { distanceFromWorldCenter } from "./utils";
import { Bullet, State, Position, Action, Actions } from "./types";

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

function spawnBullet(playerPosition: Position, weaponAngle: number): Bullet {
  return {
    position: playerPosition,
    damage: BULLET_DAMAGE,
    angle: weaponAngle
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
    let bulletsFired = [...bullets];

    bulletsFired = bulletsFired.map(bullet => {
      const position = bulletPosition(bullet, action.delta);
      return { ...bullet, position };
    });

    if (state.mousePressed && !state.player.carryingItem) {
      bulletsFired.push(
        spawnBullet(state.player.position, state.player.weapon.angle)
      );
    }

    return bulletsFired;
  } else if (action.type === Actions.COLLISION) {
    if (action.collided === "ZOMBIE_BULLET") {
      let bulletsFired = [...bullets];
      bulletsFired.splice(action.data.bullet, 1);
      return bulletsFired;
    }
  }

  return bullets;
}
