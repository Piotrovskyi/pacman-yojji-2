const directions = {
  37: DirectionsEnum.LEFT,
  38: DirectionsEnum.UP,
  39: DirectionsEnum.RIGHT,
  40: DirectionsEnum.DOWN,
};


function gameTick(grid, pacman, ghosts) {
  const possibleDirections = Object.values(directions);
  const randomDirection = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
  return randomDirection;
}
