// setting up the game

let canvas = document.getElementById("gameboard") 
let scoreboard = document.getElementById("scoreboard") 
let ctx = canvas.getContext("2d")

ctx.scale(BLOCK_SIDE_LENGTH, BLOCK_SIDE_LENGTH) 

let model = new GameBoard(ctx)

let score = 0 

setInterval(() => {
    newGameState()
}, GAME_CLOCK); 

let newGameState = () => {
    scoreCheck() 
    if (model.fallingPiece === null) {
        const rand = Math.round(Math.random() * 6) + 1
        const newPiece = new Piece(SHAPES[rand], ctx) 
        model.fallingPiece = newPiece 
        model.moveDown()
    } 
    // If the "fallingPiece" property is not null, then it means that the current piece is still falling, so the code simply moves it down one row by calling the "model.moveDown()" method.
    else {
        model.moveDown()
    }
}

// This code defines a function called "scoreCheck" that is responsible for checking if any rows in the Tetris grid have been completely filled
// and updating the score accordingly
const scoreCheck = () => {
    //The function defines a nested function called "filledRow" that takes a row of the grid as an argument and checks if all of the cells in the row contain a non-zero value
    // If they do, the function returns true. Otherwise, it returns false.
    const filledRow = (row) => {
        for (let x of row) {
            if (x === 0) {
                return false
            }
        }
        return true
    }
//The function then loops through all of the rows in the grid using a for loop
// For each row, it calls the "filledRow" function to check if it is completely filled.
    for (let i = 0; i < model.grid.length; i++) {
        if (filledRow(model.grid[i])) {
            //If a row is completely filled, the code adds the value of "SCORE_WORTH" (which is a constant defined elsewhere in the code) to the "score" variable
            score += SCORE_WORTH 
            model.grid.splice(i, 1) 
            // It then removes the filled row from the grid using the "splice" method and adds a new, empty row at the top of the grid using the "unshift" method.
            model.grid.unshift([0,0,0,0,0,0,0,0,0,0])
        }
    }
//the code updates the "scoreboard" element on the page to display the updated score
    scoreboard.innerHTML = "Score: " + String(score)
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