import EventListener from "./EventListener";
import loadLevel from "./level";
import { State, Actions } from "./types";
import * as _ from "lodash";

// TODO: collision detection will happen here too

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
  },
  (state: State) => {
    if (state.player.carryingItem) {
      const item = _.find(state.items, {
        id: state.player.itemCarryingId
      });

      if (item.carrier === null) {
        return {
          type: Actions.ITEM_PICKUP,
          itemId: item.id,
          carrier: "player",
          carrierId: null
        };
      }
    }
  },
  (state: State) => {
    if (state.player.health <= 0) {
      return {
        type: Actions.LIFE_LOST
      };
    }
  },
  (state: State) => {
    if (state.player.health <= 0) {
      return { type: Actions.LOAD_LEVEL, level: loadLevel(state.level.number) };
    }
  },
  (state: State) => {
    for (var z of state.zombies.zombies) {
      if (z.health <= 0) {
        return {
          type: Actions.ZOMBIE_KILLED,
          zombieId: z.id
        };
      }
    }
  },
  (state: State) => {
    for (var z of state.zombies.zombies) {
      if (z.position.y <= 1 && z.carryingItem) {
        return { type: Actions.ITEM_STOLEN, zombieId: z.id };
      }
    }
  }
];

export default events;
