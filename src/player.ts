import { worldCoordinates, overlaps, getRect } from "./utils";
import {
  Player,
  Position,
  Action,
  Actions,
  State,
  Item,
  GameStateType
} from "./types";
import { WIDTH, HEIGHT } from "./config";
import dispatch from "./dispatch";
import * as _ from "lodash";

let PLAYER_SPEED = 10;

function playerPosition(pPos: Position, vx: number, vy: number): Position {
  const dx = vx * PLAYER_SPEED;
  const dy = vy * PLAYER_SPEED;
  const x = pPos.x + dx;
  const y = pPos.y + dy;
  return { x, y };
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
  if (action.type === Actions.KEYBOARD && !state.paused) {
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

      if (pickupItem) {
        // functional solution to dispatch problem:
        // set player.carryingItem and itemId
        // on a timestep action of the item, check to see if item is what is being carried by the player
        // set carrier on item
        dispatch({
          type: Actions.ITEM_PICKUP,
          itemId: state.items.indexOf(pickupItem),
          carrier: "player",
          carrierId: null
        });
      } else if (dropItem) {
        dispatch({
          type: Actions.ITEM_DROPPED,
          carrier: "player",
          carrierId: null
        });
      }

      return {
        ...player,
        carryingItem: dropItem ? false : pickupItem ? true : player.carryingItem
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
    if (state.gameState.type === GameStateType.LEVELINTRO && state.level) {
      return {
        ...player,
        position: state.level.playerStartPosition,
        health: 100,
        carryingItem: false
      };
    }

    const vx = state.keysPressed.d ? 1 : state.keysPressed.a ? -1 : 0;
    const vy = state.keysPressed.w ? -1 : state.keysPressed.s ? 1 : 0;
    const position: Position = playerPosition(player.position, vx, vy);
    const angle: number = weaponAngle(
      player,
      worldCoordinates(state.mousePosition, player.position)
    );

    if (player.health <= 0) {
      return {
        ...player,
        livesRemaining: player.livesRemaining - 1
      };
    }

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
