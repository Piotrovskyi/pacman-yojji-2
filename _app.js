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

function Game() {
  const width = 28;
  let gameOver = false;
  let gameOverStatus = null;
  let pacmanDirection = null;
  let pacmanNewDirection = null;
  let score = 0;

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

  let pacDotsLeft = layout.filter((cell) => cell === EntityEnum.PAC_DOT).length;

  const directions = [-1, +1, width, -width]; // [left right up down]

  const ghosts = [
    new Ghost("inky", 351, 300),
    new Ghost("blinky", 348, 250),
    new Ghost("pinky", 376, 400),
    new Ghost("clyde", 379, 500),
  ];

  let pacmanCurrentIndex = 490;

  function canMoveLeft() {
    return (
      pacmanCurrentIndex % width !== 0 &&
      layout[pacmanCurrentIndex - 1] !== EntityEnum.WALL &&
      layout[pacmanCurrentIndex - 1] !== EntityEnum.GHOST_LAIR
    );
  }

  function canMoveUp() {
    return (
      pacmanCurrentIndex - width >= 0 &&
      layout[pacmanCurrentIndex - width] !== EntityEnum.WALL &&
      layout[pacmanCurrentIndex - width] !== EntityEnum.GHOST_LAIR
    );
  }

  function canMoveRight() {
    return (
      pacmanCurrentIndex % width < width - 1 &&
      layout[pacmanCurrentIndex + 1] !== EntityEnum.WALL &&
      layout[pacmanCurrentIndex + 1] !== EntityEnum.GHOST_LAIR
    );
  }

  function canMoveDown() {
    return (
      pacmanCurrentIndex + width < width * width &&
      layout[pacmanCurrentIndex + width] !== EntityEnum.WALL &&
      layout[pacmanCurrentIndex + width] !== EntityEnum.GHOST_LAIR
    );
  }

  function left() {
    pacmanCurrentIndex -= 1;

    if (pacmanCurrentIndex - 1 === 363) {
      pacmanCurrentIndex = 391;
    }

    movePacman();
  }

  function up() {
    pacmanCurrentIndex -= width;

    movePacman();
  }

  function right() {
    pacmanCurrentIndex += 1;

    if (pacmanCurrentIndex + 1 === 392) {
      pacmanCurrentIndex = 364;
    }

    movePacman();
  }

  function down() {
    pacmanCurrentIndex += width;

    movePacman();
  }

  function moveInCurrentDirection() {
    switch (pacmanDirection) {
      case DirectionsEnum.LEFT:
        if (canMoveLeft()) {
          left();
        }
        break;
      case DirectionsEnum.RIGHT:
        if (canMoveRight()) {
          right();
        }
        break;
      case DirectionsEnum.UP:
        if (canMoveUp()) {
          up();
        }
        break;
      case DirectionsEnum.DOWN:
        if (canMoveDown()) {
          down();
        }
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

      // TODO redo timeout to renders quantity
      setTimeout(() => {
        ghosts.forEach((ghost) => {
          ghost.isScared = false;
        });
      }, 10000);

      layout[pacmanCurrentIndex] = EntityEnum.EMPTY;
    }
  }

  function checkForGameOver() {
    if (
      ghosts.some(
        (ghost) => ghost.currentIndex === pacmanCurrentIndex && !ghost.isScared
      )
    ) {
      gameOver = true;
      gameOverStatus = "You LOSE!";
    }
  }

  function checkForWin() {
    console.log('pacDotsLeft', pacDotsLeft)
    if (pacDotsLeft === 0) {
      gameOver = true;
      gameOverStatus = "You WON!";
    }
  }

  function movePacman() {
    powerPelletEaten();
    pacDotEaten();
    checkForGameOver();
    checkForWin();
  }

  function moveGhost(ghost) {
    // ghost.timerId = setInterval(function () {
    let direction = directions[Math.floor(Math.random() * directions.length)];
    //if the next square your ghost is going to go to does not have a ghost and does not have a wall
    if (
      !ghosts.some((g) => g.currentIndex === ghost.currentIndex + direction) &&
      layout[ghost.currentIndex + direction] !== EntityEnum.WALL
    ) {
      // remove the ghosts classes
      layout[ghost.currentIndex] = EntityEnum.EMPTY;
      // move into that space
      ghost.currentIndex += direction;
    }

    // if the ghost is currently scared and pacman is on it
    if (ghost.isScared && ghost.currentIndex === pacmanCurrentIndex) {
      ghost.currentIndex = ghost.startIndex;
      score += 100;
    }
  }

  function setDirection(direction) {
    pacmanNewDirection = direction;
  }

  function tick() {
    if (gameOver) {
      return {
        layout,
        pacmanCurrentIndex,
        ghosts,
        gameOverStatus,
        score,
        gameOver,
      };
    }
    console.log("render");
    ghosts.forEach((ghost) => {
      moveGhost(ghost);
      checkForGameOver();
    });

    // 1) check if can move in direction
    // 2) if can move - move
    // 3) if can't move - continue moving in current direction

    switch (pacmanNewDirection) {
      case DirectionsEnum.LEFT:
        if (canMoveLeft()) {
          left();
          pacmanDirection = pacmanNewDirection;
        } else {
          moveInCurrentDirection();
        }
        break;
      case DirectionsEnum.RIGHT:
        if (canMoveRight()) {
          right();
          pacmanDirection = pacmanNewDirection;
        } else {
          moveInCurrentDirection();
        }
        break;
      case DirectionsEnum.UP:
        if (canMoveUp()) {
          up();
          pacmanDirection = pacmanNewDirection;
        } else {
          moveInCurrentDirection();
        }
        break;
      case DirectionsEnum.DOWN:
        if (canMoveDown()) {
          down();
          pacmanDirection = pacmanNewDirection;
        } else {
          moveInCurrentDirection();
        }
        break;
      default:
        break;
    }

    return {
      layout,
      pacmanCurrentIndex,
      ghosts,
      gameOver,
      gameOverStatus,
      score,
    };
  }

  function init() {
    return {
      layout,
      pacmanCurrentIndex,
      ghosts,
      gameOver,
      gameOverStatus,
      score,
    };
  }

  return {
    // layout,
    // pacmanCurrentIndex,
    // ghosts,
    init,
    tick,
    setDirection,
  };
}

// drawing part
const grid = document.querySelector(".grid");
const squares = [];
function createBoard(layout) {
  for (let i = 0; i < layout.length; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
    squares.push(square);
  }
}

function setIfDifferent(el, value) {
  if (el.classList !== value) {
    el.classList = value;
  }
}

function renderEntity(entity, i) {
  squares[i].classList = "";
  switch (entity) {
    case EntityEnum.WALL:
      setIfDifferent(squares[i], "wall");
      break;
    case EntityEnum.GHOST_LAIR:
      setIfDifferent(squares[i], "ghost-lair");
      break;
    case EntityEnum.POWER_PELLET:
      setIfDifferent(squares[i], "power-pellet");
      break;
    case EntityEnum.PAC_DOT:
      setIfDifferent(squares[i], "pac-dot");
      break;
  }
}

function drawBoard(layout, pacmanCurrentIndex, ghosts) {
  for (let i = 0; i < layout.length; i++) {
    renderEntity(layout[i], i);
  }
  setIfDifferent(squares[pacmanCurrentIndex], "pac-man");

  ghosts?.forEach((ghost) => {
    setIfDifferent(squares[ghost.currentIndex], ghost.className);
  });
}

// game part

const FPS = 1000;

function run() {
  const game = Game();
  const initialState = game.init();
  createBoard(initialState.layout);
  drawBoard(
    initialState.layout,
    initialState.pacmanCurrentIndex,
    initialState.ghosts
  );

  const timer = setInterval(() => {
    const newState = game.tick();
    if (newState.gameOver) {
      clearInterval(timer);
      alert(newState.gameOverStatus + " " + newState.score);
      return;
    }
    document.getElementById("score").innerHTML = newState.score;
    drawBoard(newState.layout, newState.pacmanCurrentIndex, newState.ghosts);
  }, 1000 / FPS);

  function handleKey(e) {
    switch (e.keyCode) {
      case 37:
        game.setDirection(DirectionsEnum.LEFT);
        // game.left();
        break;
      case 38:
        game.setDirection(DirectionsEnum.UP);
        // game.up();
        break;
      case 39:
        game.setDirection(DirectionsEnum.RIGHT);
        // game.right();
        break;
      case 40:
        game.setDirection(DirectionsEnum.DOWN);
        // game.down();
        break;
      default:
        break;
    }
  }

  document.addEventListener("keyup", handleKey);
}

document.addEventListener("DOMContentLoaded", () => {
  run();
});