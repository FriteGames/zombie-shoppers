import { Level, TileType, Tile, Position, Rect } from "./types";
import * as _ from "lodash";
import { WORLD_HEIGHT } from "./config";

const levelConfig = {
  1: {
    zombieSpawnDelay: 1, // units: seconds
    zombieSpeed: 120, // units: pixels per second,
    zombies: 100,
    itemsAvailable: 10
  },
  2: {
    zombieSpawnDelay: 1,
    zombieSpeed: 50,
    zombies: 200,
    itemsAvailable: 5
  },
  3: {
    zombieSpawnDelay: 1,
    zombieSpeed: 120,
    zombies: 20,
    itemsAvailable: 5
  }
};

const levels = [
  require("../levels/level1.json"),
  require("../levels/level2.json")
];

export default function loadLevel(levelNum: number): Level {
  console.log("loading level config for level " + levelNum);
  const levelJson = levels[0];
  const width = levelJson.width;
  const height = levelJson.height;

  const tiles = levelJson.layers[0].data.map((tileId, index): Tile => {
    const position = {
      x: (index % width) * 32,
      y: Math.floor(index / width) * 32
    };
    const boundary = false;
    const type = TileType.BACKGROUND;
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
  const itemStartPositions = _.range(30).map(i => {
    return { x: _.random(0, 500), y: _.random(0, WORLD_HEIGHT - 50) };
  });
  // const itemStartPositions = [{ x: 300, y: 0 }];
  const conf = levelConfig[levelNum];

  return {
    number: levelNum,
    width,
    height,
    tiles,
    playerStartPosition,
    itemStartPositions,
    zombieSpawnDelay: conf.zombieSpawnDelay,
    zombieSpeed: conf.zombieSpeed,
    itemsAvailable: conf.itemsAvailable,
    zombiesToKill: conf.zombies
  };
}
