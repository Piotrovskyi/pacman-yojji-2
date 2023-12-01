class Ghost {
  constructor(baseClass, startIndex, speed) {
    this.startIndex = startIndex;
    this.speed = speed;
    this.currentIndex = startIndex;
    this.isScared = false;
    this.timerId = NaN;
    this.baseClass = baseClass;
    this.direction = [DirectionsEnum.LEFT, DirectionsEnum.RIGHT, DirectionsEnum.UP, DirectionsEnum.DOWN][Math.floor(Math.random() * 4)];
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
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
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

  // intitial pacdots left
  let pacDotsLeft = layout.filter(
    (cell) => cell === EntityEnum.PAC_DOT || cell === EntityEnum.POWER_PELLET
  ).length;

  // const directions = [-1, +1, width, -width]; // [left right up down]
  const directionNewPostionByDirection = {
    [DirectionsEnum.LEFT]: -1,
    [DirectionsEnum.RIGHT]: +1,
    [DirectionsEnum.UP]: -width,
    [DirectionsEnum.DOWN]: +width,
  };

  const ghosts = [
    new Ghost("blinky", 348, 250), // red
    new Ghost("inky", 351, 300), // cyan
    new Ghost("pinky", 376, 400), // pink
    new Ghost("clyde", 379, 500), // orange
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

  // function posotionToTileName(position) {
  //   const tile= layout[position];
  //   return Object.keys(EntityEnum).find((key) => EntityEnum[key] === tile);
  // }

  function allowedToStepOnTile(position, tile) {
    if (layout[position] === EntityEnum.GHOST_LAIR) {
      return tile !== EntityEnum.WALL;
    }
    return tile !== EntityEnum.WALL && tile !== EntityEnum.GHOST_LAIR;
  }

  function getOppositeDirection(direction) {
    switch (direction) {
      case DirectionsEnum.LEFT:
        return DirectionsEnum.RIGHT;
      case DirectionsEnum.RIGHT:
        return DirectionsEnum.LEFT;
      case DirectionsEnum.UP:
        return DirectionsEnum.DOWN;
      case DirectionsEnum.DOWN:
        return DirectionsEnum.UP;
      default:
        return null;
    }
  }

  function determinePossibleMoves(position, direction, layout) {
    const tiles = {
      [DirectionsEnum.UP]: layout[position - width],
      [DirectionsEnum.DOWN]: layout[position + width],
      [DirectionsEnum.LEFT]: layout[position - 1],
      [DirectionsEnum.RIGHT]: layout[position + 1],
    };


    const possibleMoves = {
      [DirectionsEnum.UP]: allowedToStepOnTile(position, tiles[DirectionsEnum.UP]),
      [DirectionsEnum.DOWN]: allowedToStepOnTile(position, tiles[DirectionsEnum.DOWN]),
      [DirectionsEnum.LEFT]: allowedToStepOnTile(position, tiles[DirectionsEnum.LEFT]),
      [DirectionsEnum.RIGHT]: allowedToStepOnTile(position, tiles[DirectionsEnum.RIGHT]),
    };

    // Ghosts are not allowed to turn around at crossroads
    if (position !== 391 && position !== 364) {
      possibleMoves[getOppositeDirection(direction)] = false;
    }

    Object.keys(possibleMoves).forEach((tile) => {
      if (possibleMoves[tile] === false) {
        delete possibleMoves[tile];
      }
    });

    return possibleMoves;
  }

  function moveGhost(ghost) {
    let direction = ghost.direction;
    let newDirection = direction;

    const possibleMoves = determinePossibleMoves(ghost.currentIndex, direction, layout);

    const possibleMovesKeys = Object.keys(possibleMoves);

    if (Object.keys(possibleMovesKeys).length === 0) {
      return
    }
    if (Object.keys(possibleMovesKeys).length === 1) {
      newDirection = possibleMovesKeys[0];
    }
    if (Object.keys(possibleMovesKeys).length > 1) {
      newDirection = determineBestMove(
        ghost, pacmanCurrentIndex, layout, possibleMoves
      );
    }
    ghost.direction = newDirection;
    ghost.currentIndex += directionNewPostionByDirection[newDirection];


    // let direction = directions[Math.floor(Math.random() * directions.length)];

    // // if the next square your ghost is going to go to does not have a ghost and does not have a wall
    // const nextPosition = ghost.currentIndex + direction;

    // if (
    //   !ghosts.some((g) => g.currentIndex === nextPosition) &&
    //   layout[nextPosition] !== EntityEnum.WALL
    // ) {
    //   ghost.currentIndex += direction;
    // }
  }

  function getTarget(ghost, pacman) {
    if (layout[ghost.currentIndex] === EntityEnum.GHOST_LAIR) {
      return 294;
    }

    if (ghost.baseClass === "pinky") {
      const pacGrid = flatPostionToGridPosition(pacman);

      switch (pacmanDirection) {
        case DirectionsEnum.UP:
          return gridPositionToFlatPosition(pacGrid.x, pacGrid.y - 4);
        case DirectionsEnum.DOWN:
          return gridPositionToFlatPosition(pacGrid.x, pacGrid.y + 4);
        case DirectionsEnum.LEFT:
          return gridPositionToFlatPosition(pacGrid.x - 4, pacGrid.y);
        case DirectionsEnum.RIGHT:
          return gridPositionToFlatPosition(pacGrid.x + 4, pacGrid.y);
        default:
          return gridPositionToFlatPosition(pacGrid.x, pacGrid.y);
      }
    }

    if (ghost.baseClass === "clyde") {
      if (calculateDistance(ghost.currentIndex, pacman) < 10) {
        return pacman;
      } else {
        return 729;
      }
    }

    if (ghost.baseClass === "inky") {
      const blinky = ghosts.find((g) => g.baseClass === "blinky");

      const pacGrid = flatPostionToGridPosition(pacman);
      let pivotX = pacGrid.x;
      switch (pacmanDirection) {
        case DirectionsEnum.UP:
          pivotX = pacGrid.x
          break;
        case DirectionsEnum.DOWN:
          pivotX = pacGrid.x
          break;
        case DirectionsEnum.LEFT:
          pivotX = pacGrid.x - 2
          break;
        case DirectionsEnum.RIGHT:
          pivotX = pacGrid.x + 2
          break;
        default:
          pivotX = pacGrid.x
      }
      const blinkyGrid = flatPostionToGridPosition(blinky.currentIndex);
      const targetX = pivotX + (pivotX - blinkyGrid.x);
      return targetX + (blinkyGrid.y - pacGrid.y) * width;
    }


    return pacman // todo - implement
  }

  function determineBestMove(
    ghost, pacman, layout, possibleMoves
  ) {
    let bestDistance = ghost.isScared ? 0 : Infinity;
    let bestMove;
    const target = getTarget(ghost, pacman, layout);

    Object.keys(possibleMoves).forEach((move) => {
      const distance = calculateDistance(
        ghost.currentIndex + directionNewPostionByDirection[move], target,
      );
      const betterMove = (ghost.isScared)
        ? (distance > bestDistance)
        : (distance < bestDistance);
      if (betterMove) {
        bestDistance = distance;
        bestMove = move;
      }
    });

    return bestMove;
  }

  function flatPostionToGridPosition(position) {
    return {
      x: position % width,
      y: Math.floor(position / width),
    };
  }

  function gridPositionToFlatPosition(x, y) {
    return y * width + x;
  }

  function calculateDistance(position, pacman) {
    const pacmanPosition = flatPostionToGridPosition(pacman);
    const ghostPosition = flatPostionToGridPosition(position);
    return Math.sqrt(
      ((ghostPosition.x - pacmanPosition.x) ** 2) + ((ghostPosition.y - pacmanPosition.y) ** 2),
    );
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
    ghostEaten();
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
