const Game = require('./game-engine.js');

function run() {
  const game = Game();
  const initialState = game.init();

  let newState = null;

  while(newState.gameOver === false) {
    const userResponse = window.gameTick(
      initialState.layout,
      initialState.pacmanCurrentIndex,
      initialState.ghosts
    );
    game.setDirection(userResponse);

    newState = game.tick();
    if (newState.gameOver) {
      console.log(newState.gameOverStatus + " " + newState.score)
      break
    }
  }
}

run()
