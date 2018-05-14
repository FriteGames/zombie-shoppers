import { WIDTH, HEIGHT, COLORS, SCREEN_WIDTH, SCREEN_HEIGHT } from "./config";
import {
  State,
  Player,
  Zombies,
  Position,
  Item,
  Tile,
  TileType,
  Bullet,
  Scene,
  SceneType
} from "./types";
import * as _ from "lodash";

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

function drawHealth(ctx, x, y, w, h, health) {
  const healthWidth = health / 100 * w;
  drawRect(ctx, x, y - 20, w, 10, "red");
  drawRect(ctx, x, y - 20, healthWidth, 10, "green");
}

function drawPlayer(ctx, player: Player, delta) {
  const width = WIDTH["player"];
  const height = HEIGHT["player"];
  // drawRect(
  //   ctx,
  //   player.position.x,
  //   player.position.y,
  //   WIDTH["player"],
  //   HEIGHT["player"],
  //   COLORS["player"]
  // );

  if (player.direction === "left") {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(
      player.sprite.getFrame(delta),
      player.position.x * -1 - width,
      player.position.y,
      width,
      height
    );
    ctx.restore();
  } else {
    ctx.drawImage(
      player.sprite.getFrame(delta),
      player.position.x,
      player.position.y,
      width,
      height
    );
  }

  drawHealth(
    ctx,
    player.position.x,
    player.position.y - 20,
    WIDTH["player"],
    10,
    player.health
  );
}

async function drawItems(ctx, items: Array<Item>) {
  for (var i of items) {
    ctx.drawImage(i.sprite.getFrame(0), i.position.x, i.position.y);
  }
}

function drawBullets(ctx, bullets: Array<Bullet>) {
  for (var b of bullets) {
    drawRect(
      ctx,
      b.position.x,
      b.position.y,
      WIDTH["bullet"],
      HEIGHT["bullet"],
      COLORS["bullet"]
    );
  }
}

function drawZombies(ctx, zombies: Zombies, delta) {
  for (var z of zombies.zombies) {
    // drawRect(
    //   ctx,
    //   z.position.x,
    //   z.position.y,
    //   WIDTH["zombie"],
    //   HEIGHT["zombie"],
    //   COLORS["zombie"]
    // );

    // if z moving right, flip
    if (z.direction === "right") {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        z.sprite.getFrame(delta),
        z.position.x * -1 - 64,
        z.position.y,
        64,
        64
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        z.sprite.getFrame(delta),
        z.position.x - 32,
        z.position.y,
        64,
        64
      );
    }

    drawHealth(
      ctx,
      z.position.x,
      z.position.y - 20,
      WIDTH["zombie"],
      10,
      z.health
    );
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
  const items = state.items.map(item => {
    return shiftPos(item, shift_x, shift_y);
  });
  const tiles = [...state.scene.level.tiles].map(tile => {
    return shiftPos(tile, shift_x, shift_y);
  });
  const bullets = [...state.bullets].map(bullet => {
    return shiftPos(bullet, shift_x, shift_y);
  });
  const zombies = [...state.zombies.zombies].map(zombie => {
    return shiftPos(zombie, shift_x, shift_y);
  });

  return {
    ...state,
    bullets: bullets,
    zombies: { ...state.zombies, zombies },
    player,
    items,
    scene: {
      ...state.scene,
      level: { ...state.scene.level, tiles }
    }
  };
}

function drawTile(ctx, tile: Tile) {
  drawRect(ctx, tile.position.x, tile.position.y, 32, 32, "#666");
}

function drawCrosshair(ctx, mousePosition: Position) {
  drawRect(ctx, mousePosition.x, mousePosition.y, 8, 8, "orange");
}

function drawMenu(ctx, state: State) {
  ctx.font = "32px Helvetica";
  ctx.fillStyle = "#000";
  ctx.fillText("Menu", 100, 100);
  ctx.font = "14px Helvetica";
  ctx.fillText("Press space to start", 100, 120);
}

function drawIntro(ctx, state: State) {
  drawRect(ctx, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, "#fff");
  ctx.font = "48px serif";
  ctx.fillStyle = "#000";
  ctx.fillText(`Level ${state.scene.level.number}`, 10, 50);
  ctx.fillText(`${state.scene.level.zombiesToKill} zombies`, 100, 100);
}

function drawLevel(ctx, state: State, delta) {
  const drawState = setCameraPosition(state.player.position, state);
  drawState.scene.level.tiles.forEach(tile => drawTile(ctx, tile));
  // drawCrosshair(ctx, drawState.mousePosition);
  drawBullets(ctx, drawState.bullets);
  drawPlayer(ctx, drawState.player, delta);
  drawZombies(ctx, drawState.zombies, delta);
  drawItems(ctx, drawState.items);
  ctx.font = "14px serif";
  ctx.fillStyle = "#000";
  ctx.fillText(
    `Items Stolen: ${state.itemsStolen} / ${state.scene.level.itemsAvailable}`,
    10,
    40
  );
  ctx.fillText(
    `Zombies Killed: ${state.zombiesKilled} / ${
      state.scene.level.zombiesToKill
    }`,
    10,
    60
  );
  ctx.fillText(`Lives Remaining: ${state.livesRemaining}`, 10, 80);
}

function drawGameOver(ctx, state: State) {
  ctx.font = "48px serif";
  ctx.fillStyle = "#000";
  ctx.fillText("Game Over!", 10, 50);
}

export function draw(ctx, state: State, fps) {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  if (state.scene.kind === SceneType.MENU) {
    drawMenu(ctx, state);
  } else if (state.scene.kind === SceneType.INTRO) {
    drawIntro(ctx, state);
  } else if (state.scene.kind === SceneType.LEVEL) {
    drawLevel(ctx, state, !state.paused ? 1 / fps : 0);
  } else if (state.scene.kind === SceneType.GAMEOVER) {
    drawGameOver(ctx, state);
  }

  if (state.paused) {
    ctx.font = "48px sans-serif";
    ctx.fillStyle = "#000";
    ctx.fillText(`PAUSED`, SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
  }

  ctx.font = "14px serif";
  ctx.fillStyle = "#000";
  ctx.fillText(`FPS: ${fps}`, 10, SCREEN_HEIGHT - 10);
}

function drawMetrics(ctx, metrics) {}
