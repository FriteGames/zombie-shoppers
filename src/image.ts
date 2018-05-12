import * as _ from "lodash";
import { log } from "util";

function loadImage(path) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = path;
  });
}

let images = {};

export async function loadImages() {
  const config = {
    phone: [require("../img/phone.png")],
    zombieWalk: [
      require("../img/zombie/1.png"),
      require("../img/zombie/2.png"),
      require("../img/zombie/3.png"),
      require("../img/zombie/4.png"),
      require("../img/zombie/5.png"),
      require("../img/zombie/6.png"),
      require("../img/zombie/7.png"),
      require("../img/zombie/8.png"),
      require("../img/zombie/9.png")
    ],
    zombieDie: [
      require("../img/zombie/die/1.png"),
      require("../img/zombie/die/2.png"),
      require("../img/zombie/die/3.png"),
      require("../img/zombie/die/4.png"),
      require("../img/zombie/die/5.png"),
      require("../img/zombie/die/6.png")
    ],
    zombieAttack: [
      require("../img/zombie/attack/1.png"),
      require("../img/zombie/attack/2.png"),
      require("../img/zombie/attack/3.png"),
      require("../img/zombie/attack/4.png"),
      require("../img/zombie/attack/5.png"),
      require("../img/zombie/attack/6.png"),
      require("../img/zombie/attack/7.png"),
      require("../img/zombie/attack/8.png"),
      require("../img/zombie/attack/9.png")
    ]
  };

  const loaded = _.mapValues(config, imgNames => {
    return Promise.all(_.map(imgNames, img => loadImage(img)));
  });

  Object.keys(loaded).forEach(async key => {
    images[key] = await loaded[key].then(img => img);
  });
}

export function getImages() {
  return images;
}
