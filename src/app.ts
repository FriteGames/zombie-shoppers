import * as Mousetrap from "mousetrap";
import { WORLD_WIDTH, HEIGHT, WORLD_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT, WIDTH } from "./config";
import { draw } from "./draw";
import { overlaps, getRect } from "./utils";

import loadLevel from "./level";
import * as _ from "lodash";
import dispatch, { getState } from "./dispatch";
import { KeyboardAction, Actions, GameState, State } from "./types";
import presentLevel from "./PresentLevel";

let canvas;
let ctx;

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

  ["w", "s", "a", "d", "space", "p"].forEach(key => {
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
  draw(ctx, state);

  // check for collisions right here
  if (state.gameState === GameState.GAME) {
    if (!state.paused) {
      checkCollisions(state);
      dispatch({ type: Actions.TIMESTEP, delta });

      if (state.zombiesKilled === state.level.zombiesToKill) {
        console.log("you've killed all the zombies! go to next level");
        presentLevel(state.level.number + 1); // this should be a dispatch action.
      }

      if (state.livesRemaining === 0) {
        console.log("you lose!"); // go to main menu
        dispatch({ type: Actions.TRANSITION_GAME_STATE, gameState: GameState.MENU });
      }
    }
    ctx.font = "14px serif";
    ctx.fillStyle = "#000";
    ctx.fillText(`FPS: ${fps}`, 10, 20);
    ctx.fillText(`Items Stolen: ${state.itemsStolen} / ${state.level.itemsAvailable}`, 10, 40);
    ctx.fillText(`Zombies Killed: ${state.zombiesKilled} / ${state.level.zombiesToKill}`, 10, 60);
    ctx.fillText(`Lives Remaining: ${state.livesRemaining}`, 10, 80);
  }

  window.requestAnimationFrame(gameLoop);
  previousTimestamp = timestamp;
}

window.onload = init;

function checkCollisions(state: State) {
  for (var z of state.zombies.zombies) {
    for (var b of state.bullets) {
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
            bullet: state.bullets.indexOf(b)
          }
        });
      }
    }
  }

  for (var z of state.zombies.zombies) {
    const r1 = { x: z.position.x, y: z.position.y, width: WIDTH.zombie, height: HEIGHT.zombie };
    const r2 = {
      x: state.player.position.x,
      y: state.player.position.y,
      width: WIDTH.player,
      height: HEIGHT.player
    };
    if (overlaps(r1, r2)) {
      dispatch({
        type: Actions.COLLISION,
        collided: "ZOMBIE_PLAYER"
      });
    }
  }

  for (var z of state.zombies.zombies.filter(z => {
    return z.carryingItem === false;
  })) {
    const availableItems = state.items.filter(item => {
      return item.carrier === "player" || !item.carrier ? true : false;
    });

    for (var i of availableItems) {
      const r1 = { x: z.position.x, y: z.position.y, width: WIDTH.zombie, height: HEIGHT.zombie };
      const r2 = {
        x: i.position.x,
        y: i.position.y,
        width: WIDTH.item,
        height: HEIGHT.item
      };

      if (overlaps(r1, r2)) {
        dispatch({
          type: Actions.ITEM_PICKUP,
          itemId: state.items.indexOf(i),
          carrier: "zombie",
          carrierId: z.id
        });
      }
      break;
    }
  }

  // if a zombie returns to its starting position,
  // dispatch ZOMBIE_STOLE_ITEM with params zombie id
  for (var z of state.zombies.zombies) {
    if (z.position.y <= 1 && z.carryingItem) {
      dispatch({
        type: Actions.ITEM_STOLEN,
        zombieId: z.id
      });
    }
  }
}
