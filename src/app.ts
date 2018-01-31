import * as Mousetrap from "mousetrap";
import { WORLD_WIDTH, HEIGHT, WORLD_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT, WIDTH } from "./config";
import { draw } from "./draw";
import { zombieReducer } from "./zombies";
import { overlaps, worldCoordinates } from "./utils";
import { playerReducer } from "./player";
import { bulletReducer } from "./bullets";
import { State, Action, Actions, KeyboardAction, Position } from "./types";

let canvas;
let ctx;

const initialState: State = {
  player: {
    position: { x: 0, y: 0 },
    health: 100,
    carryingItem: false,
    weapon: {
      angle: 0
    }
  },
  bullets: {
    bullets: []
  },
  zombies: {
    lastSpawn: 0,
    zombies: []
  },
  item: {
    position: {
      x: WORLD_WIDTH - HEIGHT.item * 2,
      y: WORLD_HEIGHT / 2 - HEIGHT.item / 2
    }
  },
  background: {
    position: {
      x: 0,
      y: 0
    },
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT
  },
  mousePosition: { x: 0, y: 0 },
  mousePressed: false,
  keysPressed: { w: false, a: false, s: false, d: false }
};

let state: State = initialState;

function dispatch(action) {
  state = reducer(state, action);
}

function reducer(state: State = initialState, action: Action): State {
  return {
    ...state,
    player: playerReducer(state.player, state, action),
    mousePosition: mousePositionReducer(state.mousePosition, state, action),
    mousePressed: mousePressedReducer(state.mousePressed, state, action),
    keysPressed: keyPressedReducer(state.keysPressed, state, action),
    zombies: zombieReducer(state.zombies, state, action),
    bullets: bulletReducer(state.bullets, state, action)
  };
}

function keyPressedReducer(
  keysPressed: { [key: string]: boolean },
  state,
  action
): { [key: string]: boolean } {
  if (action.type === Actions.KEYBOARD) {
    if (action.direction === "down") {
      return { ...keysPressed, [action.key]: true };
    } else if (action.direction === "up") {
      return { ...keysPressed, [action.key]: false };
    }
  }

  return keysPressed;
}

function mousePressedReducer(mousePressed: boolean, state, action): boolean {
  if (action.type === Actions.MOUSE_CLICK) {
    if (action.direction === "mousedown") {
      return true;
    }
    return false;
  }
  return mousePressed;
}

function mousePositionReducer(mousePosition: Position, state, action): Position {
  if (action.type == Actions.MOUSE_MOVE) {
    return action.position;
  }
  return mousePosition;
}

function getMousePos(e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function init() {
  canvas = document.getElementById("canvas");
  canvas.width = SCREEN_WIDTH;
  ctx = canvas.getContext("2d");
  canvas.height = SCREEN_HEIGHT;

  function createKeyboardAction(key, direction): KeyboardAction {
    return { type: Actions.KEYBOARD, key, direction };
  }

  ["w", "s", "a", "d"].forEach(key => {
    Mousetrap.bind(key, () => dispatch(createKeyboardAction(key, "down")), "keydown");
    Mousetrap.bind(key, () => dispatch(createKeyboardAction(key, "up")), "keyup");
  });

  canvas.addEventListener("mousemove", e => {
    dispatch({ type: Actions.MOUSE_MOVE, position: getMousePos(e) });
  });
  canvas.addEventListener("mousedown", () => {
    dispatch({ type: Actions.MOUSE_CLICK, direction: "mousedown" });
  });
  canvas.addEventListener("mouseup", () => {
    dispatch({ type: Actions.MOUSE_CLICK, direction: "mouseup" });
  });

  gameLoop(0);
}

// function checkCollisions(state: State) {
//   var collisions = [];
//   for (var zombie of state.zombies.zombies) {
//     for (var bullet of state.bullets.bullets) {
//       if (
//         overlaps(
//           {
//             x: bullet.position.x,
//             y: bullet.position.y,
//             width: WIDTH.bullet,
//             height: HEIGHT.bullet
//           },
//           { x: zombie.position.x, y: zombie.position.y, width: WIDTH.zombie, height: HEIGHT.zombie }
//         )
//       ) {
//         collisions.push({
//           collided: "ZOMBIE_BULLET",
//           zombie: state.zombies.zombies.indexOf(zombie),
//           bullet: state.bullets.bullets.indexOf(bullet)
//         });
//       }
//     }
//   }
//   return collisions;
// }

let previousTimestamp;
function gameLoop(timestamp) {
  if (!previousTimestamp) {
    window.requestAnimationFrame(gameLoop);
    previousTimestamp = timestamp;
    return;
  }
  let delta = timestamp - previousTimestamp;

  // check for collisions right here
  checkCollisions(state);
  dispatch({ type: Actions.TIMESTEP, delta });
  draw(ctx, state);

  window.requestAnimationFrame(gameLoop);
  previousTimestamp = timestamp;
}

window.onload = init;

function checkCollisions(state: State) {
  for (var z of state.zombies.zombies) {
    for (var b of state.bullets.bullets) {
      if (
        overlaps(
          { x: z.position.x, y: z.position.y, width: WIDTH.zombie, height: HEIGHT.zombie },
          { x: b.position.x, y: b.position.y, width: WIDTH.bullet, height: HEIGHT.bullet }
        )
      ) {
        dispatch({
          type: Actions.COLLISION,
          collided: "ZOMBIE_BULLET",
          data: {
            zombie: state.zombies.zombies.indexOf(z),
            bullet: state.bullets.bullets.indexOf(b)
          }
        });
      }
    }
  }
}

window._dispatch = dispatch;
window.checkCollisions = checkCollisions;
