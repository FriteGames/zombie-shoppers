import { worldCoordinates } from "./utils";

let PLAYER_SPEED = 10;

function weaponPosition(playerPosition) {
  return {
    x: playerPosition.x,
    y: playerPosition.y
  };
}

function position(input, state) {
  let vy = input.up ? -1 : input.down ? 1 : 0;
  let vx = input.right ? 1 : input.left ? -1 : 0;

  let dx = vx * PLAYER_SPEED;
  let dy = vy * PLAYER_SPEED;
  return {
    x: state.player.x + dx,
    y: state.player.y + dy
  };
}

function weaponAngle(input, weaponPosition, state) {
  let worldMouse = worldCoordinates(input.mousePos, state);
  let dx = worldMouse.x - weaponPosition.x;
  let dy = weaponPosition.y - worldMouse.y;
  return Math.atan2(dx, dy) * 180 / Math.PI;
}

export const player = function(delta, input, collisions, state) {
  let playerPosition = position(input, state);
  let wp = weaponPosition(playerPosition);
  let wAngle = weaponAngle(input, wp, state);

  return {
    player: {
      ...state.player,
      x: playerPosition.x,
      y: playerPosition.y,
      weapon: {
        x: wp.x,
        y: wp.y,
        angle: wAngle
      }
    }
  };
};
