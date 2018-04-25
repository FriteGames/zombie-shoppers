import { State } from "./types";

export default function levelLost(state: State) {
  return state.player.health <= 0 ||
    state.itemsStolen === state.scene.level.itemsAvailable
    ? true
    : false;
}
