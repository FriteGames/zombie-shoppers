import { worldCoordinates, overlaps, getRect } from "./utils";
import { Player, Position, Action, Actions, State, Item } from "./types";
import { WIDTH, HEIGHT, WORLD_WIDTH, WORLD_HEIGHT } from "./config";
import * as _ from "lodash";
import Animation from "./animation";
import { getImages } from "./image";

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
      itemCarryingId: null,
      sprite: new Animation(getImages()["playerIdle"], "playerIdle")
    };
  } else if (action.type === Actions.KEYBOARD && !state.paused) {
    if (action.key === "shift" && action.direction === "down") {
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
    if (action.key === "space") {
      if (action.direction === "down") {
        if (!player.firing) {
          return {
            ...player,
            firing: true,
            sprite: new Animation(getImages()["playerAttack"], "playerAttack")
          };
        }
      } else if (action.direction === "up") {
        return {
          ...player,
          firing: false,
          running: false,
          sprite: new Animation(getImages()["playerIdle"], "playerIdle")
        };
      }
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
    const position: Position = !player.firing
      ? playerPosition(player.position, vx, vy)
      : player.position;

    // if running, and !player.running, new run sprite
    // if not running and player.running, new idle sprite
    const running = vx != 0 || vy != 0 ? true : false;
    const direction =
      vx === -1 ? "left" : vx === 1 ? "right" : player.direction;
    const sprite =
      running && !player.running && !player.firing
        ? new Animation(getImages()["playerRun"], "playerRun")
        : !running && player.running
          ? new Animation(getImages()["playerIdle"], "playerIdle")
          : player.sprite;

    return {
      ...player,
      position: position,
      running,
      sprite,
      direction
    };
  }

  return player;
}
