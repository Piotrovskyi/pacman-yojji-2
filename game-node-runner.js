const gameModule = require('./game-engine.js');
const clientCode = require('./example-ai.js');

function run() {
  const game = gameModule.Game();
  const initialState = game.init();

  let newState = null;

  while(!newState?.gameOver) {
    const userResponse = clientCode.gameTick(
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
