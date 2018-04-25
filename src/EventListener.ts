import { State, Action, Actions } from "./types";
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
      console.log(`there are ${queue.length} items in the queue`);
      queue.forEach(action => {
        console.log(`dispatching: ${Actions[action.type]}`);
        dispatch(action);
      });

      this.listen();
    }
  }
}
export default EventListener;
