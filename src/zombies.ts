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
  itemPos: Position,
  playerPos: Position,
  zombieSpeed: number,
  delta: number
): Position {
  // if the zombie is closer to the item, move towards the item.
  // if the zombie is closer to the player, move towards the player.

  function d(p1: Position, p2: Position): number {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }

  const distToPlayer = d(zPos, playerPos);
  const distToItem = d(zPos, itemPos);
  const destPos = distToPlayer <= distToItem ? playerPos : itemPos;

  const dx = zPos.x - destPos.x;
  const dy = destPos.y - zPos.y;
  const angleToDest = Math.atan2(dy, dx);
  const vx = -1 * zombieSpeed * Math.cos(angleToDest) * delta;
  const vy = zombieSpeed * Math.sin(angleToDest) * delta;
  return {
    x: zPos.x + vx,
    y: zPos.y + vy
  };
}

export const zombieReducer = function(zombies: Zombies, state: State, action: Action): Zombies {
  if (action.type === Actions.TIMESTEP) {
    const shouldSpawn = zombies.lastSpawn > state.level.zombieSpawnDelay;
    const lastSpawn = shouldSpawn ? 0 : zombies.lastSpawn + action.delta;
    let spawnedZombies: Array<Zombie> = [...zombies.zombies];

    if (shouldSpawn) {
      spawnedZombies.push(spawn());
    }

    spawnedZombies = spawnedZombies.map(zombie => {
      const position = zombiePosition(
        zombie.position,
        state.item.position,
        state.player.position,
        state.level.zombieSpeed,
        action.delta
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
