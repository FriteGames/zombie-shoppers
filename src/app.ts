import * as Mousetrap from "mousetrap";
import { WORLD_WIDTH, HEIGHT, WORLD_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT, WIDTH } from "./config";
import { draw } from "./draw";
import { zombies } from "./zombies";
import { overlaps } from "./utils";
import { player } from "./player";
import { bullet } from "./bullets";

let canvas;
let ctx;
let input = {
  mousePos: { x: 0, y: 0 },
  mousepress: false,
  left: false,
  right: false,
  up: false,
  down: false
};

let state = {
  player: {
    x: 0,
    y: 0,
    touchingItem: false,
    touchingZombie: false,
    weapon: {
      x: 0,
      y: 0,
      angle: 0
    }
  },
  bullets: [],
  zombie: {
    lastSpawn: 0,
    zombies: []
  },
  item: {
    x: WORLD_WIDTH - HEIGHT.item * 2,
    y: WORLD_HEIGHT / 2 - HEIGHT.item / 2
  },
  background: {
    x: 0,
    y: 0,
    width: WORLD_WIDTH,
    height: WORLD_HEIGHT
  }
};

function getMousePos(e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function initMousetrap(key, action) {
  Mousetrap.bind(key, () => {
    input[action] = true;
  });
  Mousetrap.bind(
    key,
    () => {
      input[action] = false;
    },
    "keyup"
  );
}

function init() {
  canvas = document.getElementById("canvas");
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  ctx = canvas.getContext("2d");

  initMousetrap("w", "up");
  initMousetrap("s", "down");
  initMousetrap("a", "left");
  initMousetrap("d", "right");

  canvas.addEventListener("mousemove", e => {
    input.mousePos = getMousePos(e);
  });
  canvas.addEventListener("mousedown", () => {
    input.mousepress = true;
  });
  canvas.addEventListener("mouseup", () => {
    input.mousepress = false;
  });

  gameLoop(0);
}

function checkCollisions(state) {
  var collisions = [];
  for (var zombie of state.zombie.zombies) {
    for (var bullet of state.bullets) {
      if (
        overlaps(
          { x: bullet.x, y: bullet.y, width: WIDTH.bullet, height: HEIGHT.bullet },
          { x: zombie.x, y: zombie.y, width: WIDTH.zombie, height: HEIGHT.zombie }
        )
      ) {
        collisions.push({
          collided: "ZOMBIE_BULLET",
          zombie: state.zombie.zombies.indexOf(zombie),
          bullet: state.bullets.indexOf(bullet)
        });
      }
    }
  }
  return collisions;
}

function reducer(state, stateFragment) {
  return { ...state, ...stateFragment };
}

function update(delta, input, collisions, state) {
  let states = [player, zombies, bullet].map(actor => actor(delta, input, collisions, state));
  return states.reduce(reducer, state);
}

let previousTimestamp;
function gameLoop(timestamp) {
  if (!previousTimestamp) {
    window.requestAnimationFrame(gameLoop);
    previousTimestamp = timestamp;
    return;
  }
  let delta = timestamp - previousTimestamp;

  let collisions = checkCollisions(state);
  let currentState = update(delta, input, collisions, state);
  draw(ctx, currentState);

  window.requestAnimationFrame(gameLoop);
  previousTimestamp = timestamp;
  state = currentState;
}

window.onload = init;
