let ZOMBIE_SPEED = 1;

function spawn() {
  return {
    x: 0,
    y: 0
  };
}

function setZombiePosition(zombie, player) {
  let dx = zombie.x - player.x;
  let dy = player.y - zombie.y;
  let angle = Math.atan2(dy, dx);
  let vx = -1 * ZOMBIE_SPEED * Math.cos(angle);
  let vy = ZOMBIE_SPEED * Math.sin(angle);
  zombie.x = zombie.x + vx;
  zombie.y = zombie.y + vy;
  return zombie;
}

export const zombies = function(delta, input, collisions, state) {
  let zState = { ...state.zombie };

  if (zState.lastSpawn > 1000 && !zState.zombies.length) {
    zState.zombies.push(spawn());
    zState.lastSpawn = 0;
  } else {
    zState.lastSpawn += delta;
  }

  zState.zombies = zState.zombies.map(zombie =>
    setZombiePosition(zombie, state.player)
  );

  let bulletHits = collisions.filter(c => c.collided == "ZOMBIE_BULLET");
  for (var bhit of bulletHits) {
    zState.zombies.splice(bhit.zombie, 1);
  }

  return { zombie: zState };
};
