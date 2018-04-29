import { State, Actions } from "./types";
import { overlaps } from "./utils";
import { WIDTH, HEIGHT } from "./config";
import dispatch, { getState } from "./dispatch";

const collisions = [
  (state: State) => {
    for (var z of state.zombies.zombies) {
      for (var b of state.bullets) {
        if (
          overlaps(
            {
              x: z.position.x,
              y: z.position.y,
              width: WIDTH.zombie,
              height: HEIGHT.zombie
            },
            {
              x: b.position.x,
              y: b.position.y,
              width: WIDTH.bullet,
              height: HEIGHT.bullet
            }
          )
        ) {
          return [
            {
              type: Actions.COLLISION,
              collided: "ZOMBIE_BULLET",
              data: {
                zombie: z.id,
                bullet: state.bullets.indexOf(b)
              }
            }
          ];
        }
      }
    }
  },
  (state: State) => {
    for (var z of state.zombies.zombies) {
      const r1 = {
        x: z.position.x,
        y: z.position.y,
        width: WIDTH.zombie,
        height: HEIGHT.zombie
      };
      const r2 = {
        x: state.player.position.x,
        y: state.player.position.y,
        width: WIDTH.player,
        height: HEIGHT.player
      };
      if (overlaps(r1, r2)) {
        return [
          {
            type: Actions.COLLISION,
            collided: "ZOMBIE_PLAYER"
          }
        ];
      }
    }
  },
  (state: State) => {
    for (var z of state.zombies.zombies.filter(z => {
      return z.carryingItem === false;
    })) {
      const availableItems = state.items.filter(item => {
        return item.carrier === "player" || !item.carrier ? true : false;
      });

      for (var i of availableItems) {
        const r1 = {
          x: z.position.x,
          y: z.position.y,
          width: WIDTH.zombie,
          height: HEIGHT.zombie
        };
        const r2 = {
          x: i.position.x,
          y: i.position.y,
          width: WIDTH.item,
          height: HEIGHT.item
        };

        if (overlaps(r1, r2)) {
          return [
            {
              type: Actions.ITEM_PICKUP,
              itemId: i.id,
              carrier: "zombie",
              carrierId: z.id
            }
          ];
        }
        break;
      }
    }
  }
];

export default function checkCollisions() {
  // TODO: reconcile this with EventListener
  const state = getState();
  const collided = collisions
    .map(collision => {
      return collision(state);
    })
    .filter(action => {
      return action !== undefined;
    });

  const queue = [].concat(...collided);

  queue.forEach(action => {
    dispatch(action);
  });
}
