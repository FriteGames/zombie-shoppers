import { State, GameState, Actions } from "./types";
import reducer from "./reducer";
import * as _ from "lodash";

const initialState: State = {
  player: {
    position: { x: 0, y: 0 },
    health: 100,
    carryingItem: false,
    weapon: {
      angle: 0
    }
  },
  bullets: [],
  zombies: {
    lastSpawn: 0,
    zombies: []
  },
  items: [],
  mousePosition: { x: 0, y: 0 },
  mousePressed: false,
  keysPressed: { w: false, a: false, s: false, d: false },
  level: null,
  gameState: GameState.GAME,
  zombiesKilled: 0,
  itemsStolen: 0,
  livesRemaining: 3,
  paused: false
};

let state: State = initialState;

export default function dispatch(action) {
  state = reducer(state, action);
}

export function getState() {
  return state;
}
