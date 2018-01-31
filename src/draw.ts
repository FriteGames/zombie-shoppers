import { WIDTH, HEIGHT, COLORS, SCREEN_WIDTH, SCREEN_HEIGHT } from "./config";
import { State, Player, Weapon, Bullets, Zombies, Position } from "./types";

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

function drawPlayer(ctx, player: Player) {
  drawRect(
    ctx,
    player.position.x,
    player.position.y,
    WIDTH["player"],
    HEIGHT["player"],
    COLORS["player"]
  );
  drawAngledRect(
    ctx,
    player.position.x,
    player.position.y,
    WIDTH["weapon"],
    HEIGHT["weapon"],
    player.weapon.angle,
    COLORS["weapon"]
  );
}

function drawBullets(ctx, bullets: Bullets) {
  for (var b of bullets.bullets) {
    drawRect(ctx, b.position.x, b.position.y, WIDTH["bullet"], HEIGHT["bullet"], COLORS["bullet"]);
  }
}

function drawZombies(ctx, zombies: Zombies) {
  for (var z of zombies.zombies) {
    drawRect(ctx, z.position.x, z.position.y, WIDTH["zombie"], HEIGHT["zombie"], COLORS["zombie"]);
  }
}

function shiftPos(obj, shift_x, shift_y) {
  let position = {
    x: obj.position.x + shift_x,
    y: obj.position.y + shift_y
  };
  return { ...obj, position };
}

function setCameraPosition(position: Position, state: State): State {
  let shift_x = SCREEN_WIDTH / 2 - position.x;
  let shift_y = SCREEN_HEIGHT / 2 - position.y;

  let bullets = [...state.bullets.bullets];
  let zombies = [...state.zombies.zombies];
  let background = { ...state.background };
  let player = { ...state.player };

  background = shiftPos(background, shift_x, shift_y);
  player = shiftPos(player, shift_x, shift_y);
  bullets = bullets.map(bullet => {
    return shiftPos(bullet, shift_x, shift_y);
  });
  zombies = zombies.map(zombie => {
    return shiftPos(zombie, shift_x, shift_y);
  });

  return {
    ...state,
    bullets: { bullets },
    zombies: { ...state.zombies, zombies },
    background,
    player
  };
}

export function draw(ctx, state: State) {
  let drawState = setCameraPosition(state.player.position, state);
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  drawRect(
    ctx,
    drawState.background.position.x,
    drawState.background.position.y,
    drawState.background.width,
    drawState.background.height,
    "#666"
  );
  drawPlayer(ctx, drawState.player);
  drawZombies(ctx, drawState.zombies);
  drawBullets(ctx, drawState.bullets);
}
