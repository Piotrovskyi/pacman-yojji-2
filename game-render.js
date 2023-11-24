const FPS = 7;

const grid = document.querySelector(".grid");
const squares = [];

const directions = {
  37: DirectionsEnum.LEFT,
  38: DirectionsEnum.UP,
  39: DirectionsEnum.RIGHT,
  40: DirectionsEnum.DOWN,
};

function createBoard(layout) {
  for (let i = 0; i < layout.length; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
    squares.push(square);
  }
}

function setClassIfDifferent(el, value) {
  if (el.classList !== value) {
    el.classList = value;
  }
}

function renderEntity(entity, i) {
  switch (entity) {
    case EntityEnum.WALL:
      setClassIfDifferent(squares[i], "wall");
      break;
    case EntityEnum.GHOST_LAIR:
      setClassIfDifferent(squares[i], "ghost-lair");
      break;
    case EntityEnum.POWER_PELLET:
      setClassIfDifferent(squares[i], "power-pellet");
      break;
    case EntityEnum.PAC_DOT:
      setClassIfDifferent(squares[i], "pac-dot");
      break;
    case EntityEnum.EMPTY:
      squares[i].classList = "";
      break;
  }
}

function drawBoard(layout, pacmanCurrentIndex, ghosts) {
  for (let i = 0; i < layout.length; i++) {
    renderEntity(layout[i], i);
  }
  setClassIfDifferent(squares[pacmanCurrentIndex], "pac-man");

  ghosts?.forEach((ghost) => {
    setClassIfDifferent(squares[ghost.currentIndex], ghost.className);
  });
}


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
    if (directions[e.keyCode] !== undefined) {
      game.setDirection(directions[e.keyCode]);
    }
  }

  document.addEventListener("keyup", handleKey);
}

document.addEventListener("DOMContentLoaded", run);
