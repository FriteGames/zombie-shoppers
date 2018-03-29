import * as Mousetrap from "mousetrap";
import { WORLD_WIDTH, HEIGHT, WORLD_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT, WIDTH } from "./config";
import { draw } from "./draw";
import { zombieReducer } from "./zombies";
import { overlaps, worldCoordinates, getRect } from "./utils";
import { playerReducer } from "./player";
import { bulletReducer } from "./bullets";
import {
  State,
  Action,
  Actions,
  KeyboardAction,
  Position,
  Item,
  Level,
  Tile,
  TileType,
  Rect,
  GameState,
  TransitionGameStateAction
} from "./types";

import loadLevel from "./level";

let canvas;
let ctx;

// do i even need this?
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
  item: null,
  mousePosition: { x: 0, y: 0 },
  mousePressed: false,
  keysPressed: { w: false, a: false, s: false, d: false },
  level: null,
  gameState: GameState.GAME
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
    bullets: bulletReducer(state.bullets, state, action),
    item: itemReducer(state.item, state, action),
    level: levelReducer(state.level, state, action),
    gameState: gameStateReducer(state.gameState, state, action)
  };
}

function gameStateReducer(gameState: GameState, state: State, action: Action): GameState {
  if (action.type === Actions.TRANSITION_GAME_STATE) {
    return action.gameState;
  }
  return gameState;
}

function levelReducer(level: Level, state: State, action: Action): Level {
  if (action.type === Actions.LOAD_LEVEL) {
    return action.level;
  }
  return level;
}

function itemReducer(item: Item, state: State, action: Action): Item {
  if (action.type === Actions.LOAD_LEVEL) {
    return { position: action.level.itemStartPosition };
  }

  if (action.type === Actions.TIMESTEP) {
    const position = state.player.carryingItem ? state.player.position : item.position;
    return {
      position
    };
  }

  return item;
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

  ["w", "s", "a", "d", "space"].forEach(key => {
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

  presentLevel(1);
  gameLoop(0);
}

function presentLevel(levelNum: number) {
  dispatch({ type: Actions.LOAD_LEVEL, level: loadLevel(levelNum) });
  // dispatch({ type: Actions.TRANSITION_GAME_STATE, gameState: GameState.LEVELINTRO });
  // setTimeout(() => {
  //   dispatch({ type: Actions.TRANSITION_GAME_STATE, gameState: GameState.GAME });
  // }, 2000);
}

let previousTimestamp;
function gameLoop(timestamp) {
  if (!previousTimestamp) {
    window.requestAnimationFrame(gameLoop);
    previousTimestamp = timestamp;
    return;
  }
  let delta = (timestamp - previousTimestamp) / 1000; // units: seconds

  // check for collisions right here
  checkCollisions(state);
  if (state.gameState === GameState.GAME) {
    dispatch({ type: Actions.TIMESTEP, delta });
  }

  draw(ctx, state);

  if (
    overlaps(getRect(state.item.position, "item"), {
      x: state.level.goal.position.x,
      y: state.level.goal.position.y,
      width: state.level.goal.width,
      height: state.level.goal.height
    })
  ) {
    presentLevel(state.level.number + 1);
  }

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
