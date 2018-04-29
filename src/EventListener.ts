import { State, Action, Actions, SceneType } from "./types";
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

    // temporary
    if (
      state.scene.kind === SceneType.MENU ||
      state.scene.kind === SceneType.GAMEOVER
    ) {
      return;
    }

    const rawQueue = this.events
      .map(event => {
        return event(state);
      })
      .filter(action => {
        return action !== undefined;
      });

    const queue = [].concat(...rawQueue);

    if (queue.length) {
      queue.forEach(action => {
        dispatch(action);
      });

      this.listen();
    }
  }
}
export default EventListener;
