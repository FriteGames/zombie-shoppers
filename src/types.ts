export type Position = {
  x: number;
  y: number;
};

export type Player = {
  position: Position;
  health: number;
  carryingItem: boolean;
  weapon: Weapon;
};

export type Item = {
  position: Position;
};

export type Weapon = {
  angle: number;
};

export type Zombie = {
  position: Position;
  health: number;
};

export type Zombies = {
  zombies: Array<Zombie>;
  lastSpawn: number;
};

export type Bullet = {
  position: Position;
  damage: number;
  readonly angle: number;
};

export type Bullets = {
  bullets: Array<Bullet>;
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

export enum GameState {
  LEVELINTRO,
  GAME
}

export type State = {
  player: Player;
  bullets: Bullets;
  zombies: Zombies;
  item: Item;
  mousePosition: Position;
  mousePressed: boolean;
  keysPressed: { [key: string]: boolean };
  level: Level;
  gameState: GameState;
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
  itemStartPosition: Position;
  playerStartPosition: Position;
  goal: Rect;
};

export enum Actions {
  LOAD_LEVEL,
  TIMESTEP,
  KEYBOARD,
  MOUSE_MOVE,
  MOUSE_CLICK,
  COLLISION,
  TRANSITION_GAME_STATE
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

export type TransitionGameStateAction = {
  type: Actions.TRANSITION_GAME_STATE;
  gameState: GameState;
};

export type Action =
  | LoadLevelAction
  | TimestepAction
  | KeyboardAction
  | MouseMoveAction
  | MouseClickAction
  | CollisionAction
  | TransitionGameStateAction;
