import { SCREEN_WIDTH, WORLD_WIDTH } from "./config";
import { distanceFromWorldCenter } from "./utils";
import { Bullets, Bullet, State, Position, Action, Actions } from "./types";

const BULLET_SPEED = 3;
const BULLET_DAMAGE = 50;

function bulletPosition(bullet: Bullet): Position {
  let rad = bullet.angle / 57.2958;
  let dy = -1 * BULLET_SPEED * Math.cos(rad);
  let dx = BULLET_SPEED * Math.sin(rad);
  return {
    x: bullet.position.x + dx,
    y: bullet.position.y + dy
  };
}

function spawnBullet(playerPosition: Position, weaponAngle: number): Bullet {
  return { position: playerPosition, damage: BULLET_DAMAGE, angle: weaponAngle };
}

export function bulletReducer(bullets: Bullets, state: State, action: Action): Bullets {
  if (action.type === Actions.TIMESTEP) {
    const delta = action.delta;

    let bulletsFired = [...bullets.bullets];
    bulletsFired = bulletsFired.map(bullet => {
      const position = bulletPosition(bullet);
      return { ...bullet, position };
    });

    if (state.mousePressed && !state.player.carryingItem) {
      bulletsFired.push(spawnBullet(state.player.position, state.player.weapon.angle));
    }

    return {
      ...bullets,
      bullets: bulletsFired
    };
  } else if (action.type === Actions.COLLISION) {
    if (action.collided === "ZOMBIE_BULLET") {
      let bulletsFired = [...bullets.bullets];
      bulletsFired.splice(action.data.bullet, 1);
      return {
        bullets: bulletsFired
      };
    }
  }

  return bullets;
}
