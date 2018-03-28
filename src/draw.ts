import { WIDTH, HEIGHT, COLORS, SCREEN_WIDTH, SCREEN_HEIGHT } from "./config";
import {
  State,
  Player,
  Weapon,
  Bullets,
  Zombies,
  Position,
  Item,
  Tile,
  TileType,
  GameState
} from "./types";

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

  if (!player.carryingItem) {
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
}

function drawItem(ctx, item: Item) {
  drawRect(ctx, item.position.x, item.position.y, WIDTH["item"], HEIGHT["item"], COLORS["item"]);
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
  const shift_x = SCREEN_WIDTH / 2 - position.x;
  const shift_y = SCREEN_HEIGHT / 2 - position.y;

  const player = shiftPos({ ...state.player }, shift_x, shift_y);
  const item = shiftPos({ ...state.item }, shift_x, shift_y);
  const tiles = [...state.level.tiles].map(tile => {
    return shiftPos(tile, shift_x, shift_y);
  });
  const bullets = [...state.bullets.bullets].map(bullet => {
    return shiftPos(bullet, shift_x, shift_y);
  });
  const zombies = [...state.zombies.zombies].map(zombie => {
    return shiftPos(zombie, shift_x, shift_y);
  });

  return {
    ...state,
    bullets: { bullets },
    zombies: { ...state.zombies, zombies },
    player,
    item,
    level: {
      ...state.level,
      tiles
    }
  };
}

function drawTile(ctx, tile: Tile) {
  drawRect(
    ctx,
    tile.position.x,
    tile.position.y,
    32,
    32,
    tile.type === TileType.BACKGROUND ? "#666" : "green"
  );
}

function drawCrosshair(ctx, mousePosition: Position) {
  drawRect(ctx, mousePosition.x, mousePosition.y, 8, 8, "orange");
}

export function draw(ctx, state: State) {
  let drawState = setCameraPosition(state.player.position, state);
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  drawState.level.tiles.forEach(tile => drawTile(ctx, tile));

  drawCrosshair(ctx, drawState.mousePosition);
  drawPlayer(ctx, drawState.player);
  drawZombies(ctx, drawState.zombies);
  drawBullets(ctx, drawState.bullets);
  drawItem(ctx, drawState.item);

  if (state.gameState === GameState.LEVELINTRO) {
    drawRect(ctx, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, "#fff");
    ctx.font = "48px serif";
    ctx.fillStyle = "#000";
    ctx.fillText(`Level ${state.level.number}`, 10, 50);
  }
}
