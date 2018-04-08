import { State, GameState } from "./types";
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
  bullets: {
    bullets: []
  },
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
  livesRemaining: 3
};

let state: State = initialState;

let actionQueue = [];

export default function dispatch(action) {
  actionQueue.push(action);
  if (actionQueue.length === 1) {
    runActions(actionQueue);
  }
}

function runActions(pending) {
  pending.forEach(action => {
    state = reducer(state, action);
    actionQueue.shift();
  });

  // run whatever has been added to the queue since the last invocation
  if (actionQueue.length > 0) {
    runActions(actionQueue);
  }
}

export function getState() {
  return state;
}
