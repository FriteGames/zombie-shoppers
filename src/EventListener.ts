import { State } from "./types";
import dispatch, { getState } from "./dispatch";

type event = {
  predicate: (State) => object;
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
      .map(event => {
        return event.predicate(state);
      })
      .filter(action => {
        return action !== undefined;
      });

    if (queue.length) {
      queue.forEach(action => {
        dispatch(action);
      });

      this.listen();
    }
  }
}
export default EventListener;
