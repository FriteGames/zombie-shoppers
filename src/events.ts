import EventListener from "./EventListener";
import loadLevel from "./level";
import { State, Actions, Scene, SceneType } from "./types";
import * as _ from "lodash";
import dispatch from "./dispatch";
import levelLost from "./levelLost";
import { WORLD_WIDTH } from "./config";

// TODO: collision detection will happen here too

const events = [
  (state: State) => {
    if (state.zombiesKilled === state.scene.level.zombiesToKill) {
      const nextLevel = state.scene.level.number + 1;
      if (nextLevel === 4) {
        alert("you win");
      }

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
      if (z.sprite.name === "zombieDie" && z.sprite.playcount == 1) {
        return [
          {
            type: Actions.ZOMBIE_DID_DIE,
            zombieId: z.id
          }
        ];
      }
    }
  },
  (state: State) => {
    for (var z of state.zombies.zombies) {
      if (z.sprite.name != "zombieDie" && z.health <= 0) {
        return [
          {
            type: Actions.ZOMBIE_WILL_DIE,
            zombieId: z.id
          }
        ];
      }
    }
  },
  (state: State) => {
    for (var z of state.zombies.zombies) {
      if (z.position.x > WORLD_WIDTH && z.carryingItem) {
        return [{ type: Actions.ITEM_STOLEN, zombieId: z.id }];
      }
    }
  },
  (state: State) => {
    if (state.player.firing && state.weapon.ready) {
      return [{ type: Actions.BULLET_FIRED }];
    }
  }
];

export default events;
