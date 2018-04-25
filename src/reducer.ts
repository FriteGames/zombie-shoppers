import {
  State,
  Action,
  Actions,
  Scene,
  Level,
  Item,
  Position,
  SceneType
} from "./types";
import { playerReducer } from "./player";
import { zombieReducer } from "./zombies";
import { bulletReducer } from "./bullets";
import * as _ from "lodash";
import presentLevel from "./PresentLevel";
import loadLevel from "./level";
import { dirname } from "path";

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
    scene: sceneReducer(state.scene, state, action),
    zombiesKilled: zombiesKilledReducer(state.zombiesKilled, state, action),
    itemsStolen: itemsStolenReducer(state.itemsStolen, state, action),
    livesRemaining: livesRemainingReducer(state.livesRemaining, state, action),
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

function livesRemainingReducer(livesRemaining: number, state: State, action) {
  if (action.type === Actions.LIFE_LOST) {
    return livesRemaining - 1;
  }
  return livesRemaining;
}

function itemsStolenReducer(itemsStolen: number, state: State, action) {
  if (action.type === Actions.LOAD_LEVEL) {
    return 0;
  } else if (action.type === Actions.ITEM_STOLEN) {
    return itemsStolen + 1;
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

// TODO: have a watcher for this and trigger load level
// function sceneReducer(scene: Scene, state: State, action: Action): Scene {
//   if (action.type === Actions.KEYBOARD) {
//     if (action.key === "space" && action.direction === "down") {
//       return scene === Scene.MENU
//         ? Scene.INTRO
//         : Scene.INTRO
//           ? Scene.LEVEL
//           : scene;
//     }
//   } else if (action.type === Actions.TRANSITION_GAME_STATE) {
//     return action.scene;
//   }
//   return scene;
// }

function sceneReducer(scene: Scene, state: State, action) {
  if (action.type === Actions.LOAD_LEVEL) {
    return {
      ...scene,
      level: action.level,
      kind: SceneType.INTRO
    };
  } else if (action.type === Actions.KEYBOARD) {
    if (action.key === "space" && action.direction === "down") {
      if (scene.kind === SceneType.INTRO) {
        return { ...scene, kind: SceneType.LEVEL };
      }
    }
  } else if (action.type === Actions.TRANSITION_SCENE) {
    if (action.to === SceneType.GAMEOVER) {
      console.log("setting scene to gameover");
      console.log(action);
      return { ...scene, kind: action.to, level: null };
    }
  }

  return scene;

  // TODO: why do i need this?
  // } else if (action.type === Actions.TRANSITION_GAME_STATE) {
  //   // rename action to TRANSITION_SCENE
  //   const level = actions.scene === "MENU" ? null : scene.level;
  //   return { ...scene, type: action.scene, level: level };
  // }
}

// function levelReducer(level: Level, state: State, action: Action): Level {
//   if (action.type === Actions.LOAD_LEVEL) {
//     console.log("load level called!");
//     return action.level;
//   }
//   return level;
// }

function itemsReducer(
  items: Array<Item>,
  state: State,
  action: Action
): Array<Item> {
  if (action.type === Actions.LOAD_LEVEL) {
    return action.level.itemStartPositions.map(p => {
      return {
        id: _.uniqueId("item-"),
        position: p,
        carrier: null,
        carrierId: null
      };
    });
  } else if (action.type === Actions.ITEM_PICKUP) {
    return items.map(item => {
      return item.id === action.itemId
        ? { ...item, carrier: action.carrier, carrierId: action.carrierId }
        : item;
    });
  } else if (action.type === Actions.ZOMBIE_KILLED) {
    return items.map(item => {
      return item.carrier === "zombie" && item.carrierId === action.zombieId
        ? { ...item, carrier: null, carrierId: null }
        : item;
    });
  } else if (action.type === Actions.KEYBOARD) {
    if (action.key === "space" && action.direction === "down") {
      return items.map(item => {
        return item.carrier === "player" ? { ...item, carrier: null } : item;
      });
    }
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
