// add next line only on backend
const { DirectionsEnum } = require("./game-engine.js");

const directions = {
  37: DirectionsEnum.LEFT,
  38: DirectionsEnum.UP,
  39: DirectionsEnum.RIGHT,
  40: DirectionsEnum.DOWN,
};

function gameTick(grid, pacman, ghosts) {
  const possibleDirections = Object.values(directions);
  const randomDirection =
    possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
  return randomDirection;
}

// add this lines only on backend
const isNode = typeof module !== "undefined" && module.exports;
if (isNode) {
  module.exports = {
    gameTick,
  };
}
