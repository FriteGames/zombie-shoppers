import { State, Scene, Actions, SceneType } from "./types";
import reducer from "./reducer";
import * as _ from "lodash";
import Animation from "./animation";
import { getImages } from "./image";

const initialState: State = {
  player: {
    position: { x: 0, y: 0 },
    health: 100,
    carryingItem: false,
    itemCarryingId: null,
    sprite: null,
    running: false,
    direction: "right",
    firing: false
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
  scene: { kind: SceneType.MENU, level: null },
  zombiesKilled: 0,
  itemsStolen: 0,
  livesRemaining: 1,
  paused: false,
  weapon: { type: "semi", ready: true, lastFire: 0 }
};

let state: State = initialState;

export default function dispatch(action) {
  state = reducer(state, action);
}

export function getState() {
  return state;
}
