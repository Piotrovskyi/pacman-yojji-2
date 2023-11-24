class Ghost {
  constructor(baseClass, startIndex, speed) {
    this.startIndex = startIndex;
    this.speed = speed;
    this.currentIndex = startIndex;
    this.isScared = false;
    this.timerId = NaN;
    this.baseClass = baseClass;
  }

  get className() {
    if (this.isScared) {
      return "scared-" + this.baseClass;
    }
    return this.baseClass;
  }
}

const EntityEnum = {
  PAC_DOT: 0,
  WALL: 1,
  GHOST_LAIR: 2,
  POWER_PELLET: 3,
  EMPTY: 4,
};

const DirectionsEnum = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};

const SCARED_GHOST_TICS = 50;

function Game() {
  const width = 28;
  let gameOver = false;
  let gameOverStatus = null;
  let pacmanDirection = null;
  let pacmanNewDirection = null;
  let score = 0;
  let scaredCountdown = 0;

  const layout = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1,
    1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0,
    1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
    1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
    1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 2, 2, 1, 1,
    1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2,
    2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 1,
    2, 2, 2, 2, 2, 2, 1, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1,
    1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1,
    0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
    1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0,
    0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1,
  ];

  let pacDotsLeft = layout.filter(
    (cell) => cell === EntityEnum.PAC_DOT || cell === EntityEnum.POWER_PELLET
  ).length;

  const directions = [-1, +1, width, -width]; // [left right up down]

  const ghosts = [
    new Ghost("inky", 351, 300),
    new Ghost("blinky", 348, 250),
    new Ghost("pinky", 376, 400),
    new Ghost("clyde", 379, 500),
  ];

  let pacmanCurrentIndex = 490;

  function canMove(direction) {
    switch (direction) {
      case DirectionsEnum.LEFT:
        return (
          pacmanCurrentIndex % width !== 0 &&
          layout[pacmanCurrentIndex - 1] !== EntityEnum.WALL &&
          layout[pacmanCurrentIndex - 1] !== EntityEnum.GHOST_LAIR
        );
      case DirectionsEnum.RIGHT:
        return (
          pacmanCurrentIndex % width < width - 1 &&
          layout[pacmanCurrentIndex + 1] !== EntityEnum.WALL &&
          layout[pacmanCurrentIndex + 1] !== EntityEnum.GHOST_LAIR
        );
      case DirectionsEnum.UP:
        return (
          pacmanCurrentIndex - width >= 0 &&
          layout[pacmanCurrentIndex - width] !== EntityEnum.WALL &&
          layout[pacmanCurrentIndex - width] !== EntityEnum.GHOST_LAIR
        );
      case DirectionsEnum.DOWN:
        return (
          pacmanCurrentIndex + width < width * width &&
          layout[pacmanCurrentIndex + width] !== EntityEnum.WALL &&
          layout[pacmanCurrentIndex + width] !== EntityEnum.GHOST_LAIR
        );
      default:
        return false;
    }
  }

  function moveTo(direction) {
    switch (direction) {
      case DirectionsEnum.LEFT:
        pacmanCurrentIndex -= 1;
        if (pacmanCurrentIndex - 1 === 363) {
          pacmanCurrentIndex = 391;
        }
        break;
      case DirectionsEnum.RIGHT:
        pacmanCurrentIndex += 1;
        if (pacmanCurrentIndex + 1 === 392) {
          pacmanCurrentIndex = 364;
        }
        break;
      case DirectionsEnum.UP:
        pacmanCurrentIndex -= width;
        break;
      case DirectionsEnum.DOWN:
        pacmanCurrentIndex += width;
        break;
      default:
        break;
    }
  }

  function pacDotEaten() {
    if (layout[pacmanCurrentIndex] === EntityEnum.PAC_DOT) {
      score++;
      pacDotsLeft--;
      layout[pacmanCurrentIndex] = EntityEnum.EMPTY;
    }
  }

  function powerPelletEaten() {
    const cell = layout[pacmanCurrentIndex];

    if (cell === EntityEnum.POWER_PELLET) {
      score += 10;
      pacDotsLeft--;

      ghosts.forEach((ghost) => {
        ghost.isScared = true;
      });

      scaredCountdown = SCARED_GHOST_TICS;
      layout[pacmanCurrentIndex] = EntityEnum.EMPTY;
    }
  }

  function checkForWin() {
    if (pacDotsLeft === 0) {
      gameOver = true;
      gameOverStatus = "You WON!";
    }
  }

  function ghostEaten() {
    const ghost = ghosts.find(
      (ghost) => ghost.currentIndex === pacmanCurrentIndex
    );

    if (ghost && ghost.isScared) {
      score += 100;
      ghost.currentIndex = ghost.startIndex;
    }
    if (ghost && !ghost.isScared) {
      gameOver = true;
      gameOverStatus = "You LOSE!";
    }
  }

  function moveGhost(ghost) {
    let direction = directions[Math.floor(Math.random() * directions.length)];

    // if the next square your ghost is going to go to does not have a ghost and does not have a wall
    const nextPosition = ghost.currentIndex + direction;

    if (
      !ghosts.some((g) => g.currentIndex === nextPosition) &&
      layout[nextPosition] !== EntityEnum.WALL
    ) {
      ghost.currentIndex += direction;
    }
  }

  function setDirection(direction) {
    pacmanNewDirection = direction;
  }

  const gameState = () => ({
    layout,
    pacmanCurrentIndex,
    ghosts,
    gameOverStatus,
    score,
    gameOver,
  });

  function tick() {
    if (gameOver) {
      return gameState();
    }

    ghosts.forEach(moveGhost);

    // 1) check if can move in direction
    // 2) if can move - move
    // 3) if can't move - continue moving in current direction

    if (canMove(pacmanNewDirection)) {
      moveTo(pacmanNewDirection);
      pacmanDirection = pacmanNewDirection;
    } else {
      if (canMove(pacmanDirection)) {
        moveTo(pacmanDirection);
      }
    }

    powerPelletEaten();
    pacDotEaten();
    ghostEaten();
    checkForWin();

    if (scaredCountdown > 0) {
      scaredCountdown--;
      if (scaredCountdown === 0) {
        ghosts.forEach((ghost) => {
          ghost.isScared = false;
        });
      }
    }

    return gameState();
  }

  function init() {
    return gameState();
  }

  return {
    init,
    tick,
    setDirection,
  };
}
