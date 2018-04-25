export type Position = {
  x: number;
  y: number;
};

export type Player = {
  position: Position;
  health: number;
  carryingItem: boolean;
  itemCarryingId: string;
  weapon: Weapon;
};

export type Item = {
  id: string;
  carrier?: string; // 'zombie' or 'player'
  carrierId?: string;
  position: Position;
};

export type Weapon = {
  angle: number;
};

export type Zombie = {
  id: string;
  position: Position;
  health: number;
  carryingItem: boolean;
  spawnLocation: Position;
};

export type Zombies = {
  zombies: Array<Zombie>;
  lastSpawn: number; // TODO get rid of this, and put in global state.
};

export type Bullet = {
  position: Position;
  damage: number;
  readonly angle: number;
};

export type Background = {
  position: Position;
  width: number;
  height: number;
};

export type Rect = {
  position: Position;
  width: number;
  height: number;
};

export enum SceneType {
  MENU,
  INTRO,
  LEVEL,
  GAMEOVER
}

export type Scene = {
  kind: SceneType;
  level: Level;
};

export type State = {
  player: Player;
  bullets: Array<Bullet>;
  zombies: Zombies;
  items: Array<Item>;
  mousePosition: Position;
  mousePressed: boolean;
  keysPressed: { [key: string]: boolean };
  scene: Scene;
  itemsStolen: number;
  zombiesKilled: number;
  livesRemaining: number;
  paused: boolean;
};

export enum TileType {
  BACKGROUND,
  GOAL
}

export type Tile = {
  position: Position;
  type: TileType;
  boundary: boolean;
};

export type Level = {
  number: number;
  zombieSpawnDelay: number;
  zombieSpeed: number;
  width: number;
  height: number;
  tiles: Array<Tile>;
  itemStartPositions: Array<Position>;
  playerStartPosition: Position;
  goal: Rect;
  itemsAvailable: number;
  zombiesToKill: number;
};

export enum Actions {
  LOAD_LEVEL,
  TIMESTEP,
  KEYBOARD,
  MOUSE_MOVE,
  MOUSE_CLICK,
  COLLISION,
  TRANSITION_SCENE,
  ITEM_PICKUP,
  ITEM_DROPPED,
  ITEM_STOLEN,
  ZOMBIE_KILLED,
  LIFE_LOST
}

export type LoadLevelAction = {
  type: Actions.LOAD_LEVEL;
  level: Level;
};

export type TimestepAction = {
  type: Actions.TIMESTEP;
  delta: number;
};

export type KeyboardAction = {
  type: Actions.KEYBOARD;
  key: "w" | "a" | "s" | "d" | "space";
  direction: "up" | "down";
};

export type MouseMoveAction = {
  type: Actions.MOUSE_MOVE;
  position: Position;
};

export type MouseClickAction = {
  type: Actions.MOUSE_CLICK;
  direction: "mousedown" | "mouseup";
};

export type CollisionAction = {
  type: Actions.COLLISION;
  collided: string;
  data: any;
};

export type TransitionSceneAction = {
  type: Actions.TRANSITION_SCENE;
  to: SceneType;
};

export type ItemPickupAction = {
  type: Actions.ITEM_PICKUP;
  itemId: string;
  carrier: string;
  carrierId?: string;
};

export type ItemDroppedAction = {
  type: Actions.ITEM_DROPPED;
  carrier: string;
  carrierId?: string;
};

export type ItemStolenAction = {
  type: Actions.ITEM_STOLEN;
  zombieId: string;
};

export type ZombieKilledAction = {
  type: Actions.ZOMBIE_KILLED;
  zombieId: string;
};

export type Action =
  | LoadLevelAction
  | TimestepAction
  | KeyboardAction
  | MouseMoveAction
  | MouseClickAction
  | CollisionAction
  | TransitionSceneAction
  | ItemPickupAction
  | ItemDroppedAction
  | ItemStolenAction
  | ZombieKilledAction;
