import { Level, TileType, Tile, Position, Rect } from "./types";

const levelConfig = {
  1: {
    zombieSpawnDelay: 1, // units: seconds
    zombieSpeed: 150, // units: pixels per second,
    zombies: 1,
    itemsAvailable: 3
  },
  2: {
    zombieSpawnDelay: 1,
    zombieSpeed: 20,
    zombies: 4,
    itemsAvailable: 3
  }
};

const levels = [
  require("../levels/level1.json"),
  require("../levels/level2.json")
];

export default function loadLevel(levelNum: number): Level {
  const levelJson = levels[levelNum - 1];

  const width = levelJson.width;
  const height = levelJson.height;

  const tiles = levelJson.layers[0].data.map((tileId, index): Tile => {
    const position = {
      x: (index % width) * 32,
      y: Math.floor(index / width) * 32
    };
    const boundary = false;
    const type = tileId === 1 ? TileType.BACKGROUND : TileType.GOAL;
    return { position, boundary, type };
  });

  function position(obj): Position {
    return { x: obj.x, y: obj.y };
  }

  function rect(obj): Rect {
    return {
      position: position(obj),
      width: obj.width,
      height: obj.height
    };
  }

  const playerStartPosition = position(levelJson.layers[1].objects[0]);
  // const itemStartPosition = position(levelJson.layers[1].objects[1]);
  const itemStartPositions = [
    { x: 500, y: 500 },
    { x: 550, y: 500 },
    { x: 600, y: 500 }
  ];
  // const itemStartPositions = [{ x: 300, y: 0 }];
  const goal = rect(levelJson.layers[1].objects[2]);
  const conf = levelConfig[levelNum];

  return {
    number: levelNum,
    width,
    height,
    tiles,
    goal,
    playerStartPosition,
    itemStartPositions,
    zombieSpawnDelay: conf.zombieSpawnDelay,
    zombieSpeed: conf.zombieSpeed,
    itemsAvailable: conf.itemsAvailable,
    zombiesToKill: conf.zombies
  };
}
