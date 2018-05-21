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
        x: state.player.position.x - 25,
        y: state.player.position.y,
        width: WIDTH.player + 50,
        height: HEIGHT.player
      };
      if (overlaps(r1, r2)) {
        return [
          {
            type: Actions.COLLISION,
            collided: "ZOMBIE_PLAYER",
            data: {
              zombie: z.id
            }
          }
        ];
      } else if (z.attacking) {
        return [
          {
            type: Actions.COLLISION_END,
            data: { zombie: z.id }
          }
        ];
      }
    }
  },
  (state: State) => {
    const zombiesAvailable = state.zombies.zombies.filter(z => {
      return z.carryingItem === false;
    });

    let collisionActions = [];
    let pickedUp = new WeakSet();

    for (var z of zombiesAvailable) {
      const availableItems = state.items.filter(item => {
        return (
          (item.carrier === "player" || !item.carrier) && !pickedUp.has(item)
        );
      });

      collisionActions = collisionActions.concat(
        availableItems
          .map(item => {
            const r1 = {
              x: z.position.x,
              y: z.position.y,
              width: WIDTH.zombie,
              height: HEIGHT.zombie
            };
            const r2 = {
              x: item.position.x,
              y: item.position.y,
              width: WIDTH.item,
              height: HEIGHT.item
            };
            if (overlaps(r1, r2)) {
              pickedUp.add(item);
              return {
                type: Actions.ITEM_PICKUP,
                itemId: item.id,
                carrier: "zombie",
                carrierId: z.id
              };
            }
          })
          .filter(action => (action === undefined ? false : true))
      );
    }
    return collisionActions;
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
