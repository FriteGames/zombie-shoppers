import { worldCoordinates } from "./utils";
import { Player, Position, Action, Actions, State, Input } from "./types";

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

export function playerReducer(player: Player, state: State, action: Action): Player {
  // if (action.type === Actions.KEYBOARD) {
  //   if (action.direction === "down") {
  //     const vx = action.key === "d" ? 1 : action.key === "a" ? -1 : player.vx;
  //     const vy = action.key === "w" ? -1 : action.key === "s" ? 1 : player.vy;
  //     return { ...player, vx, vy };
  //   } else if (action.direction === "up") {
  //     if (
  //       (action.key === "a" && player.vx === 1) ||
  //       (action.key === "d" && player.vx === -1) ||
  //       (action.key === "w" && player.vy === 1) ||
  //       (action.key === "s" && player.vy === -1)
  //     ) {
  //       return player;
  //     } else {
  //       const vy = action.key === "w" || action.key === "s" ? 0 : player.vy;
  //       const vx = action.key === "a" || action.key === "d" ? 0 : player.vx;
  //       return { ...player, vx, vy };
  //     }
  //   } else {
  //     return player;
  //   }
  // }

  if (action.type === Actions.TIMESTEP) {
    const vx = state.keysPressed.d ? 1 : state.keysPressed.a ? -1 : 0;
    const vy = state.keysPressed.w ? -1 : state.keysPressed.s ? 1 : 0;
    const position: Position = playerPosition(player.position, vx, vy);
    const angle: number = weaponAngle(player, state.mousePosition);
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
