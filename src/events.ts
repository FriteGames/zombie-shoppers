import EventListener from "./EventListener";
import loadLevel from "./level";
import { State, Actions } from "./types";

const events = [
  (state: State) => {
    if (state.zombiesKilled === state.level.zombiesToKill) {
      return {
        type: Actions.LOAD_LEVEL,
        level: loadLevel(state.level.number + 1)
      };
    }
  },
  (state: State) => {
    if (state.itemsStolen === state.level.itemsAvailable) {
      return { type: Actions.LIFE_LOST };
    }
  },
  (state: State) => {
    if (state.itemsStolen === state.level.itemsAvailable) {
      return { type: Actions.LOAD_LEVEL, level: loadLevel(state.level.number) };
    }
  }
];

export default events;
