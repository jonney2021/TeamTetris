/* ----- Tetris Setup Variables, Gameboard & SetupCanvas Function ----- */
let canvas;
let ctx;
let gBArrayHeight = 20; // Number of cells in array height
let gBArrayWidth = 12; // Number of cells in array width
let startX = 4; // Starting X position for Tetromino
let startY = 0; // Starting Y position for Tetromino
let score = 0; // Tracks the score
let level = 1; // Tracks current level
let winOrLose = "Playing";

// Array used to store x & y coordinates to draw a box on the canvas 
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let curTetromino = [[1,0], [0,1], [1,1], [2,1]];

// Array to hold Tetrominos
let tetrominos = [];
// Array to store Tetromino colors
let tetrominoColors = ['cyan','yellow','purple','green','blue','red','orange'];
// Var stores current Tetromino color
let curTetrominoColor;

// Gameboard array to reference location of other squares
let gameBoardArray = [...Array(20)].map(e => Array(12).fill(0));

// Array to hold colors when a shape stops and is added
let stoppedShapeArray = [...Array(20)].map(e => Array(12).fill(0));

// Track direction of Tetromino movement, used to prevent moving through walls
let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

class Coordinates{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

// Execute SetupCanvas when page loads (BUG: font is not loading unless page is refreshed after opening)
document.addEventListener('DOMContentLoaded', SetupCanvas); 

// Creates an array with square coordinates [0,0] Pixels X: 11 Y: 9, [1,0] Pixels X: 34 Y: 9
function CreateCoordArray(){
    let xR = 0, yR = 19;
    let i = 0, j = 0;
    for(let y = 9; y <= 446; y += 23){
        // 12 * 23 = 276 - 12 = 264 Max X value (square is 11 px across w 1 px space, so 12 total)
        for(let x = 11; x <= 264; x += 23){
            coordinateArray[i][j] = new Coordinates(x,y);
            i++;
        }
        j++;
        i = 0;
    }
}

// Create the canvas function, layout game board, score, level, controls, font, etc.
function SetupCanvas(){
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;
    
    // Define a FontFace - Font "Press Start 2P"
    const font = new FontFace("Press Start 2P", "url(https://fonts.gstatic.com/s/pressstart2p/v14/e3t4euO8T-267oIAQAu6jDQyK3nRivN04w.woff2)", {
    style: "cursive",
    weight: "400",
    stretch: "condensed",
    });
  
    // Add font to document.fonts (FontFaceSet)
    document.fonts.add(font);
    font.load().then( () => {console.log("Font is loaded.")});

    // Double the size of on screen elements to fit the browser
    ctx.scale(2, 2);

    // Create Canvas background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create gameboard rectangle
    ctx.strokeStyle = 'green';
    ctx.strokeRect(8, 8, 280, 462);

    tetrisLogo = new Image(161, 54);
    tetrisLogo.onload = DrawTetrisLogo;
    tetrisLogo.src = "tetris_logo.png";

    // Set font for canvas text
    ctx.fillStyle = 'green';
    ctx.font = "16px 'Press Start 2P'";
    
    // Create score label text
    ctx.fillText("SCORE", 300, 98);

    // Create score rectangle
    ctx.strokeRect(300, 107, 161, 24);

    // Create score
    ctx.fillText(score.toString(), 310, 127);
    
    // Create level label text
    ctx.fillText("LEVEL", 300, 157);

    // Create level rectangle
    ctx.strokeRect(300, 171, 161, 24);

    // Create level
    ctx.fillText(level.toString(), 310, 190);

    // Create status label text
    ctx.fillText("STATUS", 300, 221);

    // Create playing status
    ctx.fillText(winOrLose, 310, 261);

    // Create playing status rectangle
    ctx.strokeRect(300, 232, 161, 95);
    
    // Create controls label text
    ctx.fillText("CONTROLS", 300, 354);

    // Create controls rectangle
    ctx.strokeRect(300, 366, 161, 104);

    // Create controls text and adjust font size
    ctx.font = "8px 'Press Start 2P'";
    ctx.fillText("A : Move Left", 310, 388);
    ctx.fillText("D : Move Right", 310, 413);
    ctx.fillText("S : Move Down", 310, 438);
    ctx.fillText("E : Rotate", 310, 463);

    // Initiate keyboard controls
    document.addEventListener('keydown', HandleKeyPress);

    // Create Tetromino arrays
    CreateTetrominos();
    // Create random Tetromino
    CreateTetromino();

    // Create rectangle lookup table
    CreateCoordArray();
    DrawTetromino();
}

// Load Tetris logo top right of game screen
function DrawTetrisLogo(){
    ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}

/* ----- Create, Move & Delete Tetrominos ----- */

function DrawTetromino(){
    // Cycle through the x & y array for all places a square would be drawn when generating a Tetromino
    for(let i = 0; i < curTetromino.length; i++){

        // Assign x & y values to the tetromino to show in the middle of the gameboard
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;

        // Place Tetromino shape in gameboard array
        gameBoardArray[x][y] = 1;

        // Search for the x & y values in the lookup table
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;

        // Draw square at the x & y coordinates the lookup table provides
        ctx.fillStyle = curTetrominoColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

// When A, S, D, E keys are pressed the starting x or y value for where we want to draw the new Tetromino changes
// Previous shapes/squares deleted and redrawn
function HandleKeyPress(key){
    if(winOrLose != "Game Over"){
    // A keycode (LEFT)
    if(key.keyCode === 65){
        // Check if a square will hit the wall
        direction = DIRECTION.LEFT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            startX--;
            DrawTetromino();
        } 

    // D keycode (RIGHT)
    } else if(key.keyCode === 68){ 
        // Check if a square will hit the wall
        direction = DIRECTION.RIGHT;
        if(!HittingTheWall() && !CheckForHorizontalCollision()){
            DeleteTetromino();
            startX++;
            DrawTetromino();
        }

    // S keycode (DOWN)
    } else if(key.keyCode === 83){
        MoveTetrominoDown();
        // E keycode triggers (ROTATE)
    } else if(key.keyCode === 69){
        RotateTetromino();
    }
    } 
}

function MoveTetrominoDown(){
    // Trigger movement down
    direction = DIRECTION.DOWN;

    // Check for a vertical collision
    if(!CheckForVerticalCollison()){
        DeleteTetromino();
        startY++;
        DrawTetromino();
    }
}

// Function to call for a Tetromino to fall every second
window.setInterval(function(){
    if(winOrLose != "Game Over"){
        MoveTetrominoDown();
    }
  }, 1000);


// Function clears the previously drawn Tetromino and creates squares where it used to be black
function DeleteTetromino(){
    for(let i = 0; i < curTetromino.length; i++){
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;

        // Delete Tetromino square from the gameboard array
        gameBoardArray[x][y] = 0;

        // Fill in black where colored squares used to be
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'black';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}

// Generate random Tetrominos with color - define each shape index where there is a colored block
function CreateTetrominos(){
    // Push T 
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
    // Push I
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
    // Push J
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
    // Push Square
    tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
    // Push L
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
    // Push S
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
    // Push Z
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function CreateTetromino(){
    // Get a random tetromino index
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    // Set the one to draw
    curTetromino = tetrominos[randomTetromino];
    // Assign the color
    curTetrominoColor = tetrominoColors[randomTetromino];
}

// Check if the Tetromino hits the wall using for loop: cycle through squares to see if the value is <= to 0 or >= 11
// If moving in a direction that is off the gameboard stop movement
function HittingTheWall(){
    for(let i = 0; i < curTetromino.length; i++){
        let newX = curTetromino[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }  
    }
    return false;
}

// Check vertical collison
function CheckForVerticalCollison(){
    // Make a copy of the current tetromino and check for collisions before user moves current Tetromino
    let tetrominoCopy = curTetromino;
    // Will change values based on collisions
    let collision = false;

    // Cycle through all Tetromino squares with for loop
    for(let i = 0; i < tetrominoCopy.length; i++){
        // Get each square of the Tetromino and adjust square position to check for collision
        let square = tetrominoCopy[i];
        // Move into new position based on the change in upper left hand corner of the whole Tetromino shape
        let x = square[0] + startX;
        let y = square[1] + startY;

        // If Tetromino is moving down increment y value to check for a collison
        if(direction === DIRECTION.DOWN){
            y++;
        }

        // Check if Tetromino will hit a previously stopped shape
        if(typeof stoppedShapeArray[x][y+1] === 'string'){
            // If true, delete Tetromino
            DeleteTetromino();
            // Increment to put into place and stop shape (draw)
            startY++;
            DrawTetromino();
            collision = true;
            break;
        }
        if(y >= 20){
            collision = true;
            break;
        }
    }
    if(collision){
        // Check for game over and if true trigger game over text
        if(startY <= 2){
            winOrLose = "Game Over";
            ctx.fillStyle = 'black'; // text box background color
            ctx.fillRect(310, 242, 140, 30);
            ctx.font = "16px 'Press Start 2P'"; // keep font size from reducing to 8px because it was last font size inputted (line 132)
            ctx.fillStyle = 'green'; // text color
            ctx.fillText(winOrLose, 310, 261);
        } else {

            // Add stopped Tetromino to stopped shape array, useful to check for future collisions
            for(let i = 0; i < tetrominoCopy.length; i++){
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                // Add current Tetromino color
                stoppedShapeArray[x][y] = curTetrominoColor;
            }

            // Check for completed rows (function at line 400)
            CheckForCompletedRows();

            CreateTetromino();

            // Create the next Tetromino and draw it and reset tp new direction
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }

    }
}

// Check for horizontal shape collision
function CheckForHorizontalCollision(){
    // Copy the Teromino to use x value to check if new value would collide with a stopped Tetromino
    var tetrominoCopy = curTetromino;
    var collision = false;

    // Cycle through all Tetromino squares using for loop
    for(var i = 0; i < tetrominoCopy.length; i++)
    {
        // Use upper left coordinates to move square into position
        var square = tetrominoCopy[i];
        var x = square[0] + startX;
        var y = square[1] + startY;

        // Move Tetromino copy square into position based on direction user is moving
        if (direction == DIRECTION.LEFT){
            x--;
        }else if (direction == DIRECTION.RIGHT){
            x++;
        }

        // Get the potential stopped square that may exist
        var stoppedShapeVal = stoppedShapeArray[x][y];

        // If it is a string we know a stopped square is there
        if (typeof stoppedShapeVal === 'string')
        {
            collision=true;
            break;
        }
    }

    return collision;
}

// Check for completed rows
function CheckForCompletedRows(){

    // Determine how many rows to delete and where to start deleting
    let rowsToDelete = 0;
    let startOfDeletion = 0;

    // Check every row to see if it has been completed
    for (let y = 0; y < gBArrayHeight; y++)
    {
        let completed = true;
        // Cycle through x values
        for(let x = 0; x < gBArrayWidth; x++)
        {
            // Get values stored in the stopped block array
            let square = stoppedShapeArray[x][y];

            // Check if nothing is there
            if (square === 0 || (typeof square === 'undefined'))
            {
                // If there is one blank square cancel completed row = false
                completed=false;
                break;
            }
        }

        // If a row has been completed
        if (completed)
        {
            // Shift down all rows and shapes
            if(startOfDeletion === 0) startOfDeletion = y;
            rowsToDelete++;

            // Delete the completed line
            for(let i = 0; i < gBArrayWidth; i++)
            {
                // Update the arrays by deleting previous squares
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                // Look for the x & y values in the lookup table
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                // Draw the new blank squares as black
                ctx.fillStyle = 'black';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if(rowsToDelete > 0){ // Score Editor increase score
        score += 10;
        ctx.fillStyle = 'black'; // score text box background color
        ctx.fillRect(310, 109, 140, 19);
        ctx.font = "16px 'Press Start 2P'"; 
        ctx.fillStyle = 'green'; // text color
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDeletion);
    }
}

// Function to move rows down after a row has been deleted
function MoveAllRowsDown(rowsToDelete, startOfDeletion){
    for (var i = startOfDeletion-1; i >= 0; i--)
    {
        for(var x = 0; x < gBArrayWidth; x++)
        {
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];

            if (typeof square === 'string')
            {
                nextSquare = square;
                gameBoardArray[x][y2] = 1; // Put block into game board array
                stoppedShapeArray[x][y2] = square; // Set color into stopped shape

                // Look for the x & y values in the lookup table
                let coorX = coordinateArray[x][y2].x;
                let coorY = coordinateArray[x][y2].y;
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0; // Clear the spot in game board array
                stoppedShapeArray[x][i] = 0; // Clear the spot in stopped shape array
                coorX = coordinateArray[x][i].x;
                coorY = coordinateArray[x][i].y;
                ctx.fillStyle = 'black'; // fill new available squares black
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

// Function to Rotate the Tetromino
function RotateTetromino()
{
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;

    for(let i = 0; i < tetrominoCopy.length; i++)
    {
        // Below handles error with a backup (BU) Tetromino
        // We are cloning the array otherwise it would create a reference to the array that triggers error
        curTetrominoBU = [...curTetromino];

        // Find the new rotation by getting the x value of the last square of the Tetromino and then orientate remaining squares based on it
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotation.push([newX, newY]);
    }
    DeleteTetromino();

    // Try to draw the new Tetromino rotation
    try{
        curTetromino = newRotation;
        DrawTetromino();
    }  
    // If there is an error get the backup Tetromino and draw it instead
    catch (e){ 
        if(e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}

// Gets the x value for the last square in the Tetromino
// Orientate all other squares using that as a boundary to simulates rotating the Tetromino
function GetLastSquareX()
{
    let lastX = 0;
     for(let i = 0; i < curTetromino.length; i++)
    {
        let square = curTetromino[i];
        if (square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}