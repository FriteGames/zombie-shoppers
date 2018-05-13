import { worldCoordinates, overlaps, getRect } from "./utils";
import { Player, Position, Action, Actions, State, Item } from "./types";
import { WIDTH, HEIGHT, WORLD_WIDTH, WORLD_HEIGHT } from "./config";
import * as _ from "lodash";

let PLAYER_SPEED = 10;

function boundVector(a, lower, upper) {
  if (a < lower) {
    return lower;
  } else if (a > upper) {
    return upper;
  }
  return a;
}

function playerPosition(pPos: Position, vx: number, vy: number): Position {
  const dx = vx * PLAYER_SPEED;
  const dy = vy * PLAYER_SPEED;
  const x = pPos.x + dx;
  const y = pPos.y + dy;

  return {
    x: boundVector(x, 0, WORLD_WIDTH - WIDTH.player),
    y: boundVector(y, 0, WORLD_HEIGHT - HEIGHT.player)
  };
}

function weaponAngle(player: Player, mousePos: Position): number {
  let dx = mousePos.x - player.position.x;
  let dy = player.position.y - mousePos.y;
  return Math.atan2(dx, dy) * 180 / Math.PI;
}

export function playerReducer(
  player: Player,
  state: State,
  action: Action
): Player {
  if (action.type === Actions.LOAD_LEVEL) {
    return {
      ...player,
      position: action.level.playerStartPosition,
      health: 100,
      carryingItem: false,
      itemCarryingId: null
    };
  } else if (action.type === Actions.KEYBOARD && !state.paused) {
    if (action.key === "space" && action.direction === "down") {
      const dropItem = player.carryingItem ? true : false;
      const pickupItem: Item = _.find(state.items, item => {
        return overlaps(
          getRect(player.position, "player"),
          getRect(item.position, "item")
        ) &&
          !player.carryingItem &&
          !item.carrier
          ? true
          : false;
      });

      return {
        ...player,
        carryingItem: dropItem
          ? false
          : pickupItem
            ? true
            : player.carryingItem,
        itemCarryingId: pickupItem ? pickupItem.id : player.itemCarryingId
      };
    }
  } else if (action.type === Actions.ITEM_PICKUP) {
    if (action.carrier === "zombie") {
      return {
        ...player,
        carryingItem: false
      };
    }
  } else if (action.type === Actions.COLLISION) {
    if (action.collided === "ZOMBIE_PLAYER") {
      const health = player.health - 0.1;
      return {
        ...player,
        health
      };
    }
  } else if (action.type === Actions.TIMESTEP) {
    const vx = state.keysPressed.d ? 1 : state.keysPressed.a ? -1 : 0;
    const vy = state.keysPressed.w ? -1 : state.keysPressed.s ? 1 : 0;
    const position: Position = playerPosition(player.position, vx, vy);
    const angle: number = weaponAngle(
      player,
      worldCoordinates(state.mousePosition, player.position)
    );

    return {
      ...player,
      position: position,
      weapon: {
        angle: angle
      }
    };
  }

  return player;
}
