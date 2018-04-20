import { State } from "./types";
import dispatch, { getState } from "./dispatch";

type event = {
  predicate: (State) => [boolean, object];
};

interface EventListener {
  events: Array<event>;
}

class EventListener {
  constructor() {
    this.events = [];
  }

  register(predicate) {
    this.events.push({ predicate });
  }

  listen() {
    const state = getState();
    const queue = this.events
      .map(watcher => {
        const [shouldAct, action] = watcher.predicate(state);
        return shouldAct ? action : null;
      })
      .filter(action => {
        return action !== null;
      });

    if (queue.length) {
      queue.forEach(action => {
        console.log("dispatching " + action.type);
        dispatch(action);
      });

      this.listen();
    }
  }
}
export default EventListener;

// watcher.register(state, predicate, action);
// watcher.register(state, predicate, action);
// watcher.register(state, predicate, action);

// function loop() {
//   dispatch("timestep"); // this will modify the state via reducers
//   watch();
//   draw(state);
// }

// function watch() {
//   // for each registered watcher,
//   // if the predicate is true, add the action to the dispatch queue

//   // dispatch each action in the queue synchronously

//   // because we have changed the state, we need to call watch() again!

//   // only return from the watch function if no actions have been added to the queue.
//   // this means that the state is stable, and can be drawn safely.

//   if (queue) {
//     queue.forEach(action => {
//       dispatch(action);
//     });
//     watch();
//   }
// }
