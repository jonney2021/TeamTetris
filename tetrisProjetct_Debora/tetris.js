// setting up the game

// This canvas will be used to draw the game's graphics
let canvas = document.getElementById("gameboard") 
// This element will be used to display the game's score
let scoreboard = document.getElementById("scoreboard") 
// This element will be used to draw graphics on the canvas
let ctx = canvas.getContext("2d") 
// This element sets the scale of the rendering context
// The "BLOCK_SIDE_LENGTH" variable determines the size of the blocks in the game, and the context's scale is set to this size
ctx.scale(BLOCK_SIDE_LENGTH, BLOCK_SIDE_LENGTH) 
// This line of code creates a new instance of the "GameModel" class, passing in the rendering context. 
// This class is responsible for managing the game state and logic.
let model = new GameModel(ctx)

// This line of code initializes a variable "score" to 0, which will keep track of the player's score.
let score = 0 

// This code sets up a repeating interval that calls the "newGameState" function every "GAME_CLOCK" milliseconds.
// This function is responsible for updating the game state.
setInterval(() => {
    newGameState()
}, GAME_CLOCK); 

//updating the game state every time the game clock ticks
// The function is called repeatedly at a fixed interval using the "setInterval" method
// Overall, this code is responsible for managing the state of the game by generating new Tetris pieces and moving them down the grid
let newGameState = () => {
    //This funcction checks if any rows have been completely filled and updates the score accordingly
    scoreCheck() 
    // Here it checks if the "fallingPiece" property of the "model" object is null.
    // This property represents the current Tetris piece that is falling down the grid. 
    // If it is null, then it means that the current piece has landed and a new piece needs to be generated.
    if (model.fallingPiece === null) {
        //f a new piece is needed, the code generates a random number between 1 and 7 (inclusive) using the "Math.random()" and "Math.round()" functions. 
        //This number is used to select a random Tetris piece shape from an array called "SHAPES"
        const rand = Math.round(Math.random() * 6) + 1
        //The code creates a new instance of the "Piece" class using the selected shape and the "ctx" canvas context
        // This new piece becomes the new falling piece by assigning it to the "fallingPiece" property of the "model" object
        const newPiece = new Piece(SHAPES[rand], ctx) 
        //the code moves the new falling piece down one row by calling the "model.moveDown()" method.
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

// This code adds an event listener to the document for the "keydown" event
// When the user presses a key, the function defined inside the event listener is called
document.addEventListener("keydown", (e) => {
    // this function is a method on the event object passed as an argument 
    // this prevents the default action of the key from happening, which is important because we want to handle the key presses ourselves
    // rather than having the browser perform its default behavior (e.g. scrolling the page)
    e.preventDefault() 
    // function then uses a "switch" statement to check the value of the "key" property on the event object
    // this tells us which key was pressed. There are four cases to handle, corresponding to the up, right, down, and left arrow keys.
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