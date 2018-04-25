import EventListener from "./EventListener";
import loadLevel from "./level";
import { State, Actions, Scene, SceneType } from "./types";
import * as _ from "lodash";
import dispatch from "./dispatch";

// TODO: collision detection will happen here too

const events = [
  (state: State) => {
    if (state.zombiesKilled === state.scene.level.zombiesToKill) {
      return {
        type: Actions.LOAD_LEVEL,
        level: loadLevel(state.scene.level.number + 1)
      };
    }
  },
  (state: State) => {
    if (state.itemsStolen === state.scene.level.itemsAvailable) {
      return { type: Actions.LIFE_LOST };
    }
  },
  (state: State) => {
    if (state.itemsStolen === state.scene.level.itemsAvailable) {
      return {
        type: Actions.LOAD_LEVEL,
        level: loadLevel(state.scene.level.number)
      };
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
      console.log("should dispatch life lost");
      return {
        type: Actions.LIFE_LOST
      };
    }
  },
  // (state: State) => {
  //   if (state.player.health <= 0 && state.livesRemaining) {
  //     console.log("lives remaining: " + state.livesRemaining);
  //     return {
  //       type: Actions.LOAD_LEVEL,
  //       level: loadLevel(state.scene.level.number)
  //     };
  //   }
  // },
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
  },
  (state: State) => {
    if (state.livesRemaining === 0 && state.scene.level) {
      console.log("going to game over");
      return { type: Actions.TRANSITION_SCENE, to: SceneType.GAMEOVER };
    }
  }
];

export default events;



in sceneReducer, on life lost:

    current number of lives is contained in the action payload

    if (lives left) {
        needs level = true
    } else  {
        needs level = false
    }


in events:



    if (lifeLostCondition(state)) {
        if (state.livesRemaining === 0) {
            return {type: Actions.TRANSITION_SCENE, kind: GAMEOVER}
        } else if {
            return [
                {type: Actions.LIFE_LOST}
                {type: Actions.LOAD_LEVEL, level: loadLevel(state.scene.level.number)}
            ]

        }
    }

    // OR 
    if (lifeLostCondition(state) === true && state.needsLevel) {
        return type Actions.loadLevel(state.scene.level.number) // restart this level
    } 



