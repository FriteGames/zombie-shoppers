import * as Mousetrap from "mousetrap";

let canvas;
let ctx;
let alive = true;
const SCREEN_WIDTH = 1080;
const SCREEN_HEIGHT = 720;
const WORLD_WIDTH = SCREEN_WIDTH * 1.5;
const WORLD_HEIGHT = SCREEN_HEIGHT * 1.5;

function l(...args) {
  console.log(...args);
}

function init() {
  canvas = document.getElementById("canvas");
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  ctx = canvas.getContext("2d");

  canvas.addEventListener("mousemove", e => {
    let pos = getMousePos(canvas, e);
    weapon.crosshair = pos;
  });

  canvas.addEventListener("click", handleClick);

  window.setInterval(spawnZombie, 1000);
  requestAnimationFrame(gameLoop);
}

function handleClick() {
  if (!player.carryingItem) {
    bullets.push(new Bullet(weapon.x, weapon.y, weapon.angle));
  }
}

function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawPlayer(player) {
  drawRect(player.x, player.y, player.width, player.height, player.color);
}

function drawWeapon(weapon) {
  if (!player.carryingItem) {
    ctx.save();
    ctx.translate(weapon.x, weapon.y + weapon.height / 2);
    ctx.rotate((weapon.angle + 180) * Math.PI / 180);
    drawRect(0, 0, weapon.width, weapon.height, weapon.color);
    ctx.restore();
  }
}

function drawBullets(bullets) {
  for (var b of bullets) {
    drawRect(b.x, b.y, b.width, b.height, "blue");
  }
}

function drawZombies(zombies) {
  for (var z of zombies) {
    drawRect(z.x, z.y, z.width, z.height, "black");
  }
}

function drawBackground(background) {
  drawRect(
    background.x,
    background.y,
    background.width,
    background.height,
    "cyan"
  );
}

function drawItem(item) {
  drawRect(item.x, item.y, 30, 30, "gold");
}

const pressedKeys = new Set();

let player = {
  x: 300,
  y: 300,
  width: 32,
  height: 64,
  color: "magenta",
  carryingItem: false
};

let weapon = {
  x: 100,
  y: 100,
  width: 8,
  height: 32,
  color: "brown",
  angle: 0,
  crosshair: { x: 0, y: 0 }
};

function getRect(obj) {
  return { x: obj.x, y: obj.y, w: obj.width, h: obj.height };
}

let background = {
  x: 0,
  y: 0,
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT
};

let zombies = [];
let Zombie = function(x, y) {
  this.x = x;
  this.y = y;
  this.width = 32;
  this.height = 64;
};

let Bullet = function(x, y, angle) {
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.width = 8;
  this.height = 8;
};
let bullets = [];

let item = {
  x: WORLD_WIDTH - 60,
  y: WORLD_HEIGHT / 2 - 15,
  width: 30,
  height: 30
};

function drawGoal(goal) {
  drawRect(goal.x, goal.y, goal.width, goal.height, "green");
}

let goal = { x: 30, y: WORLD_HEIGHT / 2 - 50, width: 100, height: 100 };

const PLAYER_SPEED = 10;
const BULLET_SPEED = 20;
const ZOMBIE_SPEED = 3;
Mousetrap.bind("d", () => pressedKeys.add("right"));
Mousetrap.bind("d", () => pressedKeys.delete("right"), "keyup");
Mousetrap.bind("a", () => pressedKeys.add("left"));
Mousetrap.bind("a", () => pressedKeys.delete("left"), "keyup");
Mousetrap.bind("w", () => pressedKeys.add("up"));
Mousetrap.bind("w", () => pressedKeys.delete("up"), "keyup");
Mousetrap.bind("s", () => pressedKeys.add("down"));
Mousetrap.bind("s", () => pressedKeys.delete("down"), "keyup");

function getMousePos(canvas, e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function updatePlayer() {
  if (pressedKeys.has("right")) {
    player.x += PLAYER_SPEED;
  }

  if (pressedKeys.has("left")) {
    player.x -= PLAYER_SPEED;
  }

  if (pressedKeys.has("up")) {
    player.y -= PLAYER_SPEED;
  }

  if (pressedKeys.has("down")) {
    player.y += PLAYER_SPEED;
  }

  let pwc = toWorldCoordinates(player.x, player.y);
  if (pwc.x < 0) {
    player.x = background.x;
  }
  if (pwc.x > WORLD_WIDTH - player.width) {
    player.x = background.x + background.width - player.width;
  }
  if (pwc.y < 0) {
    player.y = background.y;
  }
  if (pwc.y > WORLD_HEIGHT - player.height) {
    player.y = background.y + background.height - player.height;
  }

  if (player.carryingItem) {
    item.x = player.x;
    item.y = player.y;
  }
}

function updateWeapon() {
  weapon.x = player.x;
  weapon.y = player.y;
  let dx = weapon.crosshair.x - weapon.x;
  let dy = weapon.y - weapon.crosshair.y;
  weapon.angle = Math.atan2(dx, dy) * 180 / Math.PI;
}

function updateBullets() {
  for (var b of bullets) {
    let rad = b.angle / 57.2958;
    let dy = -1 * BULLET_SPEED * Math.cos(rad);
    let dx = BULLET_SPEED * Math.sin(rad);
    b.x += dx;
    b.y += dy;
  }
}

function spawnZombie() {
  let q = Math.random();
  let r = Math.random();
  let x;
  let y;
  if (q < 0.25) {
    // top
    x = r * WORLD_WIDTH / 2;
    y = -100;
  } else if (q < 0.5) {
    // bottom
    x = r * WORLD_WIDTH / 2;
    y = 100 + WORLD_HEIGHT;
  } else if (q < 0.75) {
    // left
    x = -100;
    y = r * WORLD_HEIGHT;
  }
  let zCoords = toScreenCoordinates(x, y);
  let zombie = new Zombie(zCoords.x, zCoords.y);
  zombies.push(zombie);
}

window.spawnZombie = spawnZombie;

function updateZombies() {
  for (var z of zombies) {
    let dx = z.x - item.x;
    let dy = item.y - z.y;
    let angle = Math.atan2(dy, dx);
    let vx = -1 * ZOMBIE_SPEED * Math.cos(angle);
    let vy = ZOMBIE_SPEED * Math.sin(angle);
    z.x += vx;
    z.y += vy;
  }
}

function handleZombieCollision() {
  for (var z of zombies) {
    if (overlaps(getRect(z), getRect(player))) {
      alive = false;
      return;
    }
    if (overlaps(getRect(z), getRect(item))) {
      alive = false;
      return;
    }
  }
}

function handleBulletCollisions() {
  for (var z of zombies) {
    for (var b of bullets) {
      if (
        overlaps(
          { x: z.x, y: z.y, w: z.width, h: z.height },
          { x: b.x, y: b.y, w: b.width, h: b.height }
        )
      ) {
        let z_index = zombies.indexOf(z);
        let b_index = bullets.indexOf(b);
        bullets.splice(b_index, 1);
        zombies.splice(z_index, 1);
      }
    }
  }
}

function overlaps(r1, r2) {
  return (
    r1.x < r2.x + r2.w &&
    r1.x + r1.w > r2.x &&
    r1.y < r2.y + r2.h &&
    r1.y + r1.h > r2.y
  );
}

function toScreenCoordinates(x, y) {
  let shift_x = background.x + x;
  let shift_y = background.y + y;
  return {
    x: shift_x,
    y: shift_y
  };
}

function toWorldCoordinates(x, y) {
  let shift_x = x - background.x;
  let shift_y = y - background.y;
  return {
    x: shift_x,
    y: shift_y
  };
}

function setCameraPosition(x, y) {
  let shift_x = SCREEN_WIDTH / 2 - x;
  let shift_y = SCREEN_HEIGHT / 2 - y;
  player.x += shift_x;
  player.y += shift_y;
  weapon.x += shift_x;
  weapon.y += shift_y;
  background.x += shift_x;
  background.y += shift_y;
  item.x += shift_x;
  item.y += shift_y;
  goal.x += shift_x;
  goal.y += shift_y;
  for (var z of zombies) {
    z.x += shift_x;
    z.y += shift_y;
  }
  for (var b of bullets) {
    b.x += shift_x;
    b.y += shift_y;
  }
}

Mousetrap.bind("space", handleItemPickup, "keydown");

function handleItemPickup() {
  if (!player.carryingItem) {
    if (overlaps(getRect(player), getRect(item))) {
      player.carryingItem = true;
    }
  } else {
    player.carryingItem = false;
  }
}

function handleTargetReached() {
  if (player.carryingItem) {
    if (overlaps(getRect(goal), getRect(player))) {
      l("did it");
    }
  }
}

function gameLoop(timestamp) {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, "#666");

  updatePlayer();
  updateWeapon();
  updateBullets();
  updateZombies();
  handleBulletCollisions();
  handleZombieCollision();
  handleTargetReached();
  setCameraPosition(player.x, player.y);

  drawBackground(background);
  drawGoal(goal);
  drawPlayer(player);
  drawWeapon(weapon);
  drawBullets(bullets);
  drawZombies(zombies);
  drawItem(item);

  if (alive) {
    requestAnimationFrame(gameLoop);
  } else {
    console.log("dead.");
  }
}

window.onload = init;
