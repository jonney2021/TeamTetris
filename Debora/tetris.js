// setting up the game

let canvas = document.getElementById("GameBoard") 
let scoreboard = document.getElementById("scoreboard") 
let ctx = canvas.getContext("2d")

ctx.scale(BLOCK_SIDE_LENGTH, BLOCK_SIDE_LENGTH) 

let model = new GameBoard(ctx)

let score = 0 

setInterval(() => {
    newGameState()
}, GAME_CLOCK); 

const newGameState = () => {
    checkScore();

    // Spawn a new falling Tetromino  if there isn't one already
    if (model.fallingTetromino === null) {
      const rand = Math.round(Math.random() * 6) + 1;
      const newTetromino  = new Tetromino (SHAPES[rand], ctx);
      model.fallingTetromino  = newTetromino ;
      model.moveDown();
    } else {
      model.moveDown();
    }
  }
  
const checkScore = () => {
    const isFilledRow = (row) => {
      for (let cell of row) {
        if (cell === 0) {
          return false;
        }
      }
      return true;
    };

    for (let i = 0; i < model.grid.length; i++) {
      if (isFilledRow(model.grid[i])) {
        score += SCORE_WORTH;
        model.grid.splice(i, 1);
        model.grid.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      }
    }
    scoreboard.innerHTML = "Score: " + String(score);
  }

document.addEventListener("keydown", (e) => {
    e.preventDefault() 
    switch(e.key) {
        case "ArrowUp":
            model.rotate() 
            break 
        case "ArrowRight":
            model.move(true) 
            break 
        case "ArrowDown": 
            model.moveDown() 
            break 
        case "ArrowLeft":
            model.move(false) 
            break
    }
})