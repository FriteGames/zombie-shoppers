import { Zombies, Zombie, Position, Actions, Action, State, Player } from "./types";

function spawn(): Zombie {
  return {
    position: {
      x: 0,
      y: 0
    },
    health: 100
  };
}

function zombiePosition(
  zPos: Position,
  dPos: Position,
  zombieSpeed: number,
  delta: number
): Position {
  let dx = zPos.x - dPos.x;
  let dy = dPos.y - zPos.y;
  let angleToDest = Math.atan2(dy, dx);
  let vx = -1 * zombieSpeed * Math.cos(angleToDest) * delta / 1000;
  let vy = zombieSpeed * Math.sin(angleToDest) * delta / 1000;
  return {
    x: zPos.x + vx,
    y: zPos.y + vy
  };
}

export const zombieReducer = function(zombies: Zombies, state: State, action: Action): Zombies {
  if (action.type === Actions.TIMESTEP) {
    const delta = action.delta;
    const shouldSpawn = zombies.lastSpawn > state.level.zombieSpawnDelay;
    const lastSpawn = shouldSpawn ? 0 : zombies.lastSpawn + delta;
    let spawnedZombies: Array<Zombie> = [...zombies.zombies];

    if (shouldSpawn) {
      spawnedZombies.push(spawn());
    }

    spawnedZombies = spawnedZombies.map(zombie => {
      const position = zombiePosition(
        zombie.position,
        state.item.position,
        state.level.zombieSpeed,
        delta
      );
      return { ...zombie, position };
    });

    return {
      lastSpawn,
      zombies: spawnedZombies
    };
  } else if (action.type === Actions.COLLISION) {
    if (action.collided === "ZOMBIE_BULLET") {
      let spawnedZombies: Array<Zombie> = [...zombies.zombies];
      spawnedZombies.splice(action.data.zombie, 1);
      return {
        ...zombies,
        zombies: spawnedZombies
      };
    }
  }

  return zombies;
};
