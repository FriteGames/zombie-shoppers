import { State, Action } from "./types";
import dispatch, { getState } from "./dispatch";

type event = (State) => Action;

interface EventListener {
  events: Array<event>;
}

class EventListener {
  constructor(events) {
    this.events = events;
  }

  listen() {
    const state = getState();
    const queue = this.events
      .map(event => {
        return event(state);
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
