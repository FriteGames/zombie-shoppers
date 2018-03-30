import { worldCoordinates, overlaps, getRect } from "./utils";
import { Player, Position, Action, Actions, State } from "./types";
import { WIDTH, HEIGHT } from "./config";

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

function shouldCarryItem(player: Player, itemPos: Position) {
  if (!player.carryingItem) {
    if (overlaps(getRect(player.position, "player"), getRect(itemPos, "item"))) {
      return true;
    }
  }
  return false;
}

export function playerReducer(player: Player, state: State, action: Action): Player {
  if (action.type === Actions.LOAD_LEVEL) {
    return {
      ...player,
      position: action.level.playerStartPosition
    };
  }

  if (action.type === Actions.KEYBOARD) {
    if (action.key === "space" && action.direction === "down") {
      const carryingItem = shouldCarryItem(player, state.item.position);
      return {
        ...player,
        carryingItem
      };
    }
  }

  if (action.type === Actions.COLLISION) {
    if (action.collided === "ZOMBIE_PLAYER") {
      const health = player.health - 0.1;
      return {
        ...player,
        health
      };
    }
  }

  if (action.type === Actions.TIMESTEP) {
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
