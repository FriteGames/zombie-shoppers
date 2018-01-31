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

function zombiePosition(zPos: Position, pPos: Position): Position {
  let dx = zPos.x - pPos.x;
  let dy = pPos.y - zPos.y;
  let angleToPlayer = Math.atan2(dy, dx);
  let vx = -1 * ZOMBIE_SPEED * Math.cos(angleToPlayer);
  let vy = ZOMBIE_SPEED * Math.sin(angleToPlayer);
  return {
    x: zPos.x + vx,
    y: zPos.y + vy
  };
}

export const zombieReducer = function(zombies: Zombies, state: State, action: Action): Zombies {
  if (action.type === Actions.TIMESTEP) {
    const delta = action.delta;

    let spawnedZombies: Array<Zombie> = [...zombies.zombies];
    let lastSpawn: number = zombies.lastSpawn;

    if (zombies.lastSpawn > ZOMBIE_SPAWN_DELAY) {
      spawnedZombies.push(spawn());
      lastSpawn = 0;
    } else {
      lastSpawn += delta;
    }

    spawnedZombies = spawnedZombies.map(zombie => {
      const position = zombiePosition(zombie.position, state.player.position);
      return { ...zombie, position };
    });

    return {
      ...zombies,
      lastSpawn,
      zombies: spawnedZombies
    };
  } else if (action.type === Actions.COLLISION) {
    if (action.collided === "ZOMBIE_BULLET") {
      let spawnedZombies: Array<Zombie> = [...zombies.zombies];
      return {
        ...zombies,
        zombies: spawnedZombies.splice(action.data.zombie)
      };
    }
  }

  return zombies;
};
