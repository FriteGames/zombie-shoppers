import EventListener from "./EventListener";
import loadLevel from "./level";
import { State, Actions, Scene, SceneType } from "./types";
import * as _ from "lodash";
import dispatch from "./dispatch";
import levelLost from "./levelLost";

// TODO: collision detection will happen here too

const events = [
  (state: State) => {
    if (state.zombiesKilled === state.scene.level.zombiesToKill) {
      return [
        {
          type: Actions.LOAD_LEVEL,
          level: loadLevel(state.scene.level.number + 1),
          win: true
        }
      ];
    }
  },
  (state: State) => {
    if (state.player.carryingItem) {
      const item = _.find(state.items, {
        id: state.player.itemCarryingId
      });

      if (item.carrier === null) {
        return [
          {
            type: Actions.ITEM_PICKUP,
            itemId: item.id,
            carrier: "player",
            carrierId: null
          }
        ];
      }
    }
  },
  (state: State) => {
    if (levelLost(state)) {
      if (state.livesRemaining) {
        return [
          { type: Actions.LIFE_LOST },
          {
            type: Actions.LOAD_LEVEL,
            level: loadLevel(state.scene.level.number),
            win: false
          }
        ];
      } else {
        return [
          {
            type: Actions.TRANSITION_SCENE,
            to: SceneType.GAMEOVER
          }
        ];
      }
    }
  },
  (state: State) => {
    for (var z of state.zombies.zombies) {
      if (z.health <= 0) {
        return [
          {
            type: Actions.ZOMBIE_KILLED,
            zombieId: z.id
          }
        ];
      }
    }
  },
  (state: State) => {
    for (var z of state.zombies.zombies) {
      if (z.position.y <= 1 && z.carryingItem) {
        return [{ type: Actions.ITEM_STOLEN, zombieId: z.id }];
      }
    }
  }
];

export default events;
