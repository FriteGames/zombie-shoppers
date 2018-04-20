import {
  State,
  Action,
  Actions,
  GameState,
  GameStateType,
  Level,
  Item,
  Position
} from "./types";
import { playerReducer } from "./player";
import { zombieReducer } from "./zombies";
import { bulletReducer } from "./bullets";
import * as _ from "lodash";
import dispatch from "./dispatch";
import loadLevel from "./level";

export default function reducer(state: State, action: Action): State {
  return {
    ...state,
    player: playerReducer(state.player, state, action),
    mousePosition: mousePositionReducer(state.mousePosition, state, action),
    mousePressed: mousePressedReducer(state.mousePressed, state, action),
    keysPressed: keyPressedReducer(state.keysPressed, state, action),
    zombies: zombieReducer(state.zombies, state, action),
    bullets: bulletReducer(state.bullets, state, action),
    items: itemsReducer(state.items, state, action),
    level: levelReducer(state.level, state, action),
    gameState: gameStateReducer(state.gameState, state, action),
    zombiesKilled: zombiesKilledReducer(state.zombiesKilled, state, action),
    itemsStolen: itemsStolenReducer(state.itemsStolen, state, action),
    paused: pausedReducer(state.paused, state, action)
  };
}

function pausedReducer(paused: boolean, state: State, action) {
  if (action.type === Actions.KEYBOARD) {
    if (action.key === "p" && action.direction === "down") {
      return !paused;
    }
  }
  return paused;
}

// function livesRemainingReducer(livesRemaining: number, state: State, action) {
//   // functional way: check state.itemStolen and state.player.health on a timestep.
//   // don't use Actions.LIFE_LOST.
//   if (action.type === Actions.LIFE_LOST) {
//     console.log("reloading level!");
//     // presentLevel(state.level.number);
//     return livesRemaining - 1;
//   }
//   return livesRemaining;
// }

function itemsStolenReducer(itemsStolen: number, state: State, action) {
  if (action.type === Actions.LOAD_LEVEL) {
    return 0;
  } else if (action.type === Actions.ITEM_STOLEN) {
    const stolen = itemsStolen + 1;
    if (stolen === state.level.itemsAvailable) {
      dispatch({ type: Actions.LIFE_LOST });
    }
    return stolen;
  }
  return itemsStolen;
}

function zombiesKilledReducer(
  zombiesKilled: number,
  state: State,
  action: Action
): number {
  if (action.type === Actions.LOAD_LEVEL) {
    return 0;
  } else if (action.type === Actions.ZOMBIE_KILLED) {
    return zombiesKilled + 1;
  }
  return zombiesKilled;
}

function gameStateReducer(
  gameState: GameState,
  state: State,
  action: Action
): GameState {
  if (action.type === Actions.KEYBOARD) {
    if (action.key === "space" && action.direction === "up") {
      if (gameState.type === GameStateType.MENU) {
        return { ...gameState, type: GameStateType.LEVELINTRO };
      }
    }
  } else if (action.type === Actions.TIMESTEP) {
    if (gameState.type === GameStateType.LEVELINTRO) {
      if (gameState.timeSinceIntro >= 3) {
        return { ...gameState, type: GameStateType.GAME };
      } else {
        return {
          ...gameState,
          timeSinceIntro: gameState.timeSinceIntro + action.delta
        };
      }
    } else if (gameState.type === GameStateType.GAME) {
      // if the player beats the level, go to the intro
      // if the player loses the level, go to the intro
    }
  }
  return gameState;
}

function levelReducer(level: Level, state: State, action: Action): Level {
  if (action.type === Actions.TIMESTEP) {
    if (state.gameState.type === GameStateType.LEVELINTRO) {
      const levelToLoad = !state.level
        ? 1
        : state.zombiesKilled === state.level.zombiesToKill
          ? state.level.number + 1
          : state.player.health <= 0 && state.player.livesRemaining > 0
            ? state.level.number
            : 1;

      return loadLevel(levelToLoad);
    }
  }
  return level;
}

function itemsReducer(
  items: Array<Item>,
  state: State,
  action: Action
): Array<Item> {
  if (action.type === Actions.LOAD_LEVEL) {
    return action.level.itemStartPositions.map(p => {
      return { position: p, carrier: null, carrierId: null };
    });
  } else if (action.type === Actions.ITEM_PICKUP) {
    return items.map((item, i) => {
      return i === action.itemId
        ? { ...item, carrier: action.carrier, carrierId: action.carrierId }
        : item;
    });
  } else if (action.type === Actions.ITEM_DROPPED) {
    return items.map((item, i) => {
      if (
        item.carrier === action.carrier &&
        item.carrierId === action.carrierId
      ) {
        return { ...item, carrier: null, carrierId: null };
      }
      return item;
    });
  } else if (action.type === Actions.TIMESTEP) {
    return items.map(item => {
      return {
        ...item,
        position:
          item.carrier === "player"
            ? state.player.position
            : item.carrier === "zombie"
              ? _.find(state.zombies.zombies, { id: item.carrierId }).position
              : item.position
      };
    });
  } else if (action.type === Actions.ITEM_STOLEN) {
    return _.filter(items, item => {
      return item.carrierId === null
        ? true
        : item.carrierId === action.zombieId
          ? false
          : true;
    });
  }

  return items;
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

function mousePositionReducer(
  mousePosition: Position,
  state,
  action
): Position {
  if (action.type == Actions.MOUSE_MOVE) {
    return action.position;
  }
  return mousePosition;
}
