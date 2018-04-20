import { State, GameStateType } from "./types";
import reducer from "./reducer";
import * as _ from "lodash";

const initialState: State = {
  player: {
    position: { x: 0, y: 0 },
    health: 100,
    carryingItem: false,
    livesRemaining: 3,
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
  gameState: { type: GameStateType.GAME, timeSinceIntro: 0 },
  zombiesKilled: 0,
  itemsStolen: 0,
  paused: false
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
