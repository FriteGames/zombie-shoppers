import * as Mousetrap from "mousetrap";
import {
  WORLD_WIDTH,
  HEIGHT,
  WORLD_HEIGHT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  WIDTH
} from "./config";
import { draw } from "./draw";
import { overlaps, getRect } from "./utils";

import loadLevel from "./level";
import * as _ from "lodash";
import dispatch, { getState } from "./dispatch";
import { KeyboardAction, Actions, State, Scene, SceneType } from "./types";
import EventListener from "./EventListener";
import events from "./events";
import checkCollisions from "./collisions";
import { loadImages } from "./image";

let canvas;
let ctx;
let eventListener = new EventListener(events);

function getMousePos(e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

async function init() {
  await loadImages();

  canvas = document.getElementById("canvas");
  canvas.width = SCREEN_WIDTH;
  ctx = canvas.getContext("2d");
  canvas.height = SCREEN_HEIGHT;

  function createKeyboardAction(key, direction): KeyboardAction {
    return { type: Actions.KEYBOARD, key, direction };
  }

  ["w", "s", "a", "d", "space", "p", "shift"].forEach(key => {
    Mousetrap.bind(
      key,
      () => dispatch(createKeyboardAction(key, "down")),
      "keydown"
    );
    Mousetrap.bind(
      key,
      () => dispatch(createKeyboardAction(key, "up")),
      "keyup"
    );
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

let previousTimestamp;

function gameLoop(timestamp) {
  if (!previousTimestamp) {
    window.requestAnimationFrame(gameLoop);
    previousTimestamp = timestamp;
    return;
  }
  let delta = (timestamp - previousTimestamp) / 1000; // units: seconds
  const fps = 1 / delta;
  const state = getState();

  if (state.scene.kind === SceneType.LEVEL && !state.paused) {
    dispatch({ type: Actions.TIMESTEP, delta });
    eventListener.listen();
    checkCollisions();
  } else if (state.scene.kind === SceneType.MENU) {
    // TODO: figure out a way to turn this into an event to listen to
    // problem: there are only events that should be listened for when sceneType is level
    if (state.keysPressed.space) {
      dispatch({ type: Actions.LOAD_LEVEL, level: loadLevel(1) });
    }
  } else if (state.scene.kind === SceneType.GAMEOVER) {
    if (state.keysPressed.p) {
      dispatch({ type: Actions.TRANSITION_SCENE, to: SceneType.MENU });
    }
  }

  draw(ctx, state, fps);
  window.requestAnimationFrame(gameLoop);
  previousTimestamp = timestamp;
}
//
window.onload = init;
// window.onload = loadImages;
//

// note to future zach: instead of treating keyboard events as actions, have keyboard events dispatch actions.
