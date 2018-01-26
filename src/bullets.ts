import SCREEN_WIDTH from "./config";
import { distFromCenter } from "./utils";
let BULLET_SPEED = 3;

function bulletPosition(bullet) {
  let rad = bullet.angle / 57.2958;
  let dy = -1 * BULLET_SPEED * Math.cos(rad);
  let dx = BULLET_SPEED * Math.sin(rad);
  return {
    x: (bullet.x += dx),
    y: (bullet.y += dy)
  };
}

export const bullet = function(delta, input, collisions, state) {
  let bState = state.bullets;

  if (input.mousepress) {
    bState.push({
      x: state.player.x,
      y: state.player.y,
      angle: state.player.weapon.angle
    });
  }

  for (var bullet of bState) {
    let pos = bulletPosition(bullet);
    bullet.x = pos.x;
    bullet.y = pos.y;
  }

  let bulletHits = collisions.filter(c => c.collided == "ZOMBIE_BULLET");
  for (var bhit of bulletHits) {
    bState.splice(bhit.bullet, 1);
  }

  for (var bullet of bState) {
    if (distFromCenter(bullet) > SCREEN_WIDTH) {
      bState.splice(bState.indexOf(bullet), 1);
    }
  }

  return { bullets: bState };
};
