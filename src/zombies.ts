import { Zombies, Zombie, Position, Actions, Action, State, Player } from "./types";

let ZOMBIE_SPEED = 1;
let ZOMBIE_SPAWN_DELAY = 1000;

function spawn(): Zombie {
  return {
    position: {
      x: 0,
      y: 0
    },
    health: 100
  };
}

function zombiePosition(zPos: Position, dPos: Position): Position {
  let dx = zPos.x - dPos.x;
  let dy = dPos.y - zPos.y;
  let angleToDest = Math.atan2(dy, dx);
  let vx = -1 * ZOMBIE_SPEED * Math.cos(angleToDest);
  let vy = ZOMBIE_SPEED * Math.sin(angleToDest);
  return {
    x: zPos.x + vx,
    y: zPos.y + vy
  };
}

export const zombieReducer = function(zombies: Zombies, state: State, action: Action): Zombies {
  if (action.type === Actions.TIMESTEP) {
    const delta = action.delta;
    const shouldSpawn = zombies.lastSpawn > ZOMBIE_SPAWN_DELAY;
    const lastSpawn = shouldSpawn ? 0 : zombies.lastSpawn + delta;
    let spawnedZombies: Array<Zombie> = [...zombies.zombies];

    if (shouldSpawn) {
      // spawnedZombies.push(spawn());
    }

    spawnedZombies = spawnedZombies.map(zombie => {
      const position = zombiePosition(zombie.position, state.item.position);
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
