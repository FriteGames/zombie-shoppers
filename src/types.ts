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

export type State = {
  player: Player;
  bullets: Bullets;
  zombies: Zombies;
  item: Item;
  background: Background;
  mousePosition: Position;
  mousePressed: boolean;
  keysPressed: { [key: string]: boolean };
};

export enum Actions {
  LOAD_LEVEL,
  TIMESTEP,
  KEYBOARD,
  MOUSE_MOVE,
  MOUSE_CLICK,
  COLLISION
}

export type LoadLevelAction = {
  type: Actions.LOAD_LEVEL;
  level: number;
};

export type TimestepAction = {
  type: Actions.TIMESTEP;
  delta: number;
};

export type KeyboardAction = {
  type: Actions.KEYBOARD;
  key: "w" | "a" | "s" | "d";
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

export type Action =
  | LoadLevelAction
  | TimestepAction
  | KeyboardAction
  | MouseMoveAction
  | MouseClickAction
  | CollisionAction;
