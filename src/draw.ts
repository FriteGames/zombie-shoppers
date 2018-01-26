import { WIDTH, HEIGHT, COLORS, SCREEN_WIDTH, SCREEN_HEIGHT } from "./config";

function drawRect(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawAngledRect(ctx, pivotX, pivotY, width, height, angle, color) {
  ctx.save();
  ctx.translate(pivotX, pivotY);
  ctx.rotate(angle * Math.PI / 180);
  drawRect(ctx, 0, 0, width, height, color);
  ctx.restore();
}

function drawPlayer(ctx, playerState) {
  drawRect(ctx, playerState.x, playerState.y, WIDTH.player, HEIGHT.player, COLORS.player);
  drawAngledRect(
    ctx,
    playerState.weapon.x,
    playerState.weapon.y,
    WIDTH.weapon,
    HEIGHT.weapon,
    playerState.weapon.angle,
    COLORS.weapon
  );
}

function drawBullets(ctx, bullets) {
  for (var b of bullets) {
    drawRect(ctx, b.x, b.y, WIDTH.bullet, HEIGHT.bullet, COLORS.bullet);
  }
}

function drawZombies(ctx, zombies) {
  for (var z of zombies) {
    drawRect(ctx, z.x, z.y, WIDTH.zombie, HEIGHT.zombie, COLORS.zombie);
  }
}

function shiftPos(obj, shift_x, shift_y) {
  return { ...obj, x: obj.x + shift_x, y: obj.y + shift_y };
}

function setCameraPosition(x, y, state) {
  let shift_x = SCREEN_WIDTH / 2 - x;
  let shift_y = SCREEN_HEIGHT / 2 - y;

  let drawState = { ...state };
  drawState.zombie = {};
  drawState.zombie = { ...state.zombie };

  drawState.background = shiftPos(drawState.background, shift_x, shift_y);
  drawState.player = shiftPos(drawState.player, shift_x, shift_y);
  drawState.player.weapon = shiftPos(drawState.player.weapon, shift_x, shift_y);
  drawState.bullets = drawState.bullets.map(bullet => shiftPos(bullet, shift_x, shift_y));
  drawState.zombie.zombies = drawState.zombie.zombies.map(zombie =>
    shiftPos(zombie, shift_x, shift_y)
  );

  return drawState;
}

export function draw(ctx, state) {
  let drawState = setCameraPosition(state.player.x, state.player.y, state);

  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  drawRect(
    ctx,
    drawState.background.x,
    drawState.background.y,
    drawState.background.width,
    drawState.background.height,
    "#666"
  );
  drawPlayer(ctx, drawState.player);
  drawZombies(ctx, drawState.zombie.zombies);
  drawBullets(ctx, drawState.bullets);
}
