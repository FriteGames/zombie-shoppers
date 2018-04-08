import { Zombies, Zombie, Position, Actions, Action, State, Player, Item } from "./types";
import { distance } from "./utils";
import * as _ from "lodash";
import dispatch from "./dispatch";
import { SCREEN_WIDTH } from "./config";

function spawn(): Zombie {
  const spawnPos = { x: _.random(0, SCREEN_WIDTH), y: 0 };
  return {
    id: _.uniqueId("zombie"),
    position: spawnPos,
    spawnLocation: spawnPos,
    health: 100,
    carryingItem: false
  };
}

function zombiePosition(
  zPos: Position,
  destPos: Position,
  zombieSpeed: number,
  delta: number
): Position {
  // if the zombie is closer to the item, move towards the item.
  // if the zombie is closer to the player, move towards the player.

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

function closestTarget(zombie: Zombie, items: Array<Item>, player: Player): Position {
  const distPlayer = distance(zombie.position, player.position);

  const availableItems = items.filter(item => {
    return item.carrier ? false : true;
  });

  for (var item of availableItems) {
    const distItem = distance(zombie.position, item.position);
    if (distItem <= distPlayer) {
      return item.position;
    }
  }
  return player.position;
}

export const zombieReducer = function(zombies: Zombies, state: State, action: Action): Zombies {
  if (action.type === Actions.LOAD_LEVEL) {
    return {
      ...zombies,
      zombies: []
    };
  } else if (action.type === Actions.TIMESTEP) {
    const shouldSpawn = zombies.lastSpawn > state.level.zombieSpawnDelay;
    const lastSpawn = shouldSpawn ? 0 : zombies.lastSpawn + action.delta;
    let spawnedZombies: Array<Zombie> = [...zombies.zombies];

    if (shouldSpawn) {
      spawnedZombies.push(spawn());
    }

    spawnedZombies = spawnedZombies.map(zombie => {
      const destPos = zombie.carryingItem
        ? zombie.spawnLocation
        : closestTarget(zombie, state.items, state.player);

      const position = zombiePosition(
        zombie.position,
        destPos,
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
      const aliveZombies = zombies.zombies
        .map((zombie, i) => {
          return i === action.data.zombie ? { ...zombie, health: zombie.health - 50 } : zombie;
        })
        .filter(zombie => {
          if (zombie.health <= 0) {
            dispatch({
              type: Actions.ITEM_DROPPED,
              carrier: "zombie",
              carrierId: zombie.id
            });
            dispatch({
              type: Actions.ZOMBIE_KILLED
            });
            return false;
          }
          return true;
        });

      return {
        ...zombies,
        zombies: aliveZombies
      };
    }
  } else if (action.type === Actions.ITEM_PICKUP) {
    if (action.carrier === "zombie") {
      return {
        ...zombies,
        zombies: zombies.zombies.map(zombie => {
          return zombie.id === action.carrierId ? { ...zombie, carryingItem: true } : zombie;
        })
      };
    }
  } else if (action.type === Actions.ITEM_STOLEN) {
    return {
      ...zombies,
      zombies: _.filter(zombies.zombies, zombie => {
        return action.zombieId === zombie.id ? false : true;
      })
    };
  }

  return zombies;
};
