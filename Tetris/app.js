let canvas;
let ctx; //context for functions drawing on canvas
let gBArrayHeight = 20; //gameboard height is 20 cells total
let gBArrayWidth = 12; //gameboard width in cells going across the array
let startX = 4; // Tetromino startinng position X
let startY = 0; // Tetromino starting position Y
let score = 0; // Score tracker
let level = 1; // Level tracker
let winOrLose = "Playing";
let tetrisLogo; // Tetris logo/image on screen
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0)); // multi-dimensional array to map coordinates of cells/squares
let curTetromino = [[1,0], [0,1], [1,1], [2,1]]; // first or current Tetromino

let tetrominos = [];
let tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red'];
let curTetrominoColor;

let gameBoardArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let stoppedShapeArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

let DIRECTION = { // track direction tetrominos move in
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};
let direction;

class Coordinates{ // class to look up where we draw the squares that make up our Tetrominos
    constructo(x,y){
      this.x = x;
      this.y = y;
    }
}

document.addEventListener('DOMCOntentLoaded', SetupCanvas); // function that sets up objects we draw on it

function CreateCoordArray(){
    let i = 0, j = 0;
    for(let y = 9; y <= 446; y += 23){ // for loop adds squares based off dimensions of tetris game board (446 pixels top to bottotm, squares are populated 23px over from each other)
        for(let x = 11; x <= 264; x += 23){ // populates array L to R - 264px max space left to right on screen, squares are 11px height, 11px width
            coordinateArray [i][j] = new Coordinates (x,y); // pass the value of x and y coordinates through the array
            i++;
        }
        j++;
        i = 0;    
    }
}

function SetupCanvas(){
  canvas = document.getElementById("my-canvas");
  ctx = canvas.getContext('2d'); // working in 2d
  canvas.width = 936;
  canvasheight = 956;

  ctx.scale(2,2); // scale up so everything is bigger in browser window

  ctx.fillStyle = 'white';
  ctx.fillRectangle(0, 0, canvas.width, canvas.height); // draw rectangle

  ctx.strokeStyle = 'black';
  ctx.strokeRect(8, 8, 280, 462); // draw rectangle not fill it

  tetrisLogo = new Image(161,54);
  tetrisLogo.onload = DrawTetrisLogo;
  tetrisLogo.src = "tetrislogo.png";

  ctx.fillStyle = 'black';
  ctx.font = '21px Arial';
  ctx.fillText("SCORE", 300, 98);

  ctx.strokeRect(300, 107, 161, 24);

  ctx.fillText(score.toString(), 310, 127);

  ctx.fillText("LEVEL", 300, 157);
  ctx.strokeRect(300, 171, 161, 24);
  ctx.fillText(level.toString(), 310, 190);

  ctx.fillText("WIN / LOSE", 300, 221);
  ctx.fillText(winOrLose, 310, 262);
  ctx.strokeRect(300, 232, 161, 95);
  ctx.fillText("CONTROLS", 300, 354);
  ctx.strokeRect(300, 366, 161, 104);
  ctx.font = '19px Arial';
  ctx.fillText("A : Move Left", 310, 388);
  ctx.fillText("D : Move Right", 310, 413);
  ctx.fillText("S : Move Down", 310, 438);
  ctx.fillText("E : Rotate Right", 310, 463);

  document.addEventListener('keydown', HandleKeyPress); // allow user to move tetrominos with keyboard
  CreateTetrominos();
  CreateTetromino();

  CreateCoordArray();
  DrawTetromino();
}

function DrawTetrisLogo(){ // draw tetris logo on screen
  ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
}

function DrawTetromino(){
    for(let i = 0; i< curTetromino.length; i++){ // move Tetromino x and y values so they show in middle of game board
        let x = curTetromino[i][0] + startX; 
        let y = curTetromino[i][1] + startY;
        gameBoardArray[x][y] = 1; // says theres a square inside here
        let coorX = coordinateArray[x][y].x; // look up x value
        let coorY = coordinateArray[x][y].y; // look up y value
        ctx.fillStyle = curTetrominoColor; // ref tetromino color var from above
        ctx.fillRect(coorX, coorY, 21, 21); // define dimension of one square
    }
}

function HandleKeyPress(key){
  if(winOrLose != "Game Over"){
    if(key.keyCode === 65){ // means user hit the A key
      direction = DIRECTION.LEFT;
      if(!HittingTheWall() && !CheckForHorizontalCollision()){
        DeleteTetromino();
        startX--;
        DrawTetromino();
      }
    } else if(key.code === 68){ // means user hit the D key
    direction = DIRECTION.RIGHT;
    if(!HittingTheWall() && !CheckForHorizontalCollision()){
      DeleteTetromino();
      startX++;
      DrawTetromino();
      }
    } else if(key.keyCode === 83){ // means user hit the S key
      MoveTetrominoDown();
    } else if(key.keycode === 69){ // means user hits E key
      RotateTetromino();
    }
  }
}

function MoveTetrominoDown(){
    direction = DIRECTION.DOWN;
    if(!CheckForVerticalCollision()){
      DeleteTetromino();
      startY++;
      DrawTetromino();
    }
}

window.setInterval(function(){
  if(winOrLose != "Game Over"){
    MoveTetrominoDown();
  }
}, 1000);

function DeleteTetromino(){
  for(let i = 0; i < curTetromino.length; i++){ // take current tetromino we are working with and delete it
      let x = curTetromino[i][0] + startX; 
      let y = curTetromino[i][1] + startY;
      gameBoardArray[x][y] = 0; // 1 means something is there 0 means there isn't
      let coorX = coordinateArray[x][y].x;
      let coorY = coordinateArray[x][y].y;
      ctx.fillStyle = 'white'; // fills the square in white "deletes tetromino"
      ctx.fillRect(coorX, coorY, 21, 21);
  }
}

function CreateTetrominos(){ //create the different Tetromino shapes
   // Push T Tetromino
   tetrominos.push([[1,0], [0,1], [1,1], [2,1]]);
   // Push I Tetromino
   tetrominos.push([[0,0], [1,0], [2,0], [3,0]]);
   // Push J Tetromino
   tetrominos.push([[0,0], [0,1], [1,1], [2,1]]);
   // Push Square Tetromino
   tetrominos.push([[0,0], [1,0], [0,1], [1,1]]);
   // Push L Tetromino
   tetrominos.push([[2,0], [0,1], [1,1], [2,1]]);
   // Push S Tetromino
   tetrominos.push([[1,0], [2,0], [0,1], [1,1]]);
   // Push Z Tetromino
   tetrominos.push([[0,0], [1,0], [1,1], [2,1]]);
}

function CreateTetromino(){
    let randomTetromino = Math.floor(Math.random() * tetrominos.length); // generate random tetromino
    curTetromino = tetrominos[randomTetromino]; // set random tetromino picked to current tetromino
    curTetrominoColor = tetrominoColors[randomTetromino]; // assign new tetromino a color
}

function HittingTheWall(){ // stop bricks when they hit the wall
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

function CheckForVerticalCollision(){
    let tetrominoCopy = curTetromino;
    let collision = false;
    for(let i = 0; i <tetrominoCopy.length; i++){ // cycle through all Tetromino squares
      let square = tetrominoCopy[i];
      let x = square[0] + startX;
      let y = square[1] + startY;
      if(direction === DIRECTION.DOWN){
        y++;
      }
      if(gameBoardArray[x][y+1] === 1){
          if(typeof stoppedShapeArray[x][y+1] === 'string'){
            DeleteTetromino();
            startY++;
            DrawTetromino();
            collision = true;
            break;
          }
          if(y >= 20){ // at bottom of gameboard
              collision = true;
              break;
          }

          if(collision){
              if(startY <= 2){
                  winOrLose = "Game Over";
                  ctx.fillStyle = 'white';
                  ctx.fillRect(310, 242, 140, 30);
                  ctx.fillStyle = 'black';
                  ctx.filltext(winOrLose, 310, 261);
              } else {
                  for(let i = 0; i < tetrominoCopy.length; i++){
                      let square = tetrominoCopy[i];
                      let x = square[0] + startX;
                      let y = square[1] + startY;
                      stoppedShapeArray[x][y] = curTetrominoColor;
                  }
                  CheckForCompletedRows();
                  CreateTetromino();
                  direction = DIRECTION.IDLE;
                  startX = 4;
                  startY = 0;
                  DrawTetromino();
                }
            }
    }
  }
}

function CheckForHorizontalCollision(){
  let tetrominoCopy = curTetromino;
  let collision = false;
  for(let i = 0; i <tetrominoCopy.length; i++){
    let square = tetrominoCopy[i];
    let x = square[0] + startX;
    let y = square[1] + startY;
    if(direction === DIRECTION.LEFT){
      x--;
    } else if(direction === DIRECTION.RIGHT){
      x++;
    }
    var stoppedShapeVal = stoppedShapeArray[x][y];
    if(typeof stoppedShapeVal === 'string'){
      collision = true;
      break;
    }
  }
  return collision;
}

function CheckForCompletedRows(){
  let rowsToDelete = 0;
  let startOfDeletion = 0;
  for(let y = 0; y < gBArrayHeight; y++){
    let completed = true;
    for(let x = 0; x <gBArrayWidth; x++){
      let square = stoppedShapeArray[x][y];
      if(square === 0 || (typeof square === 'undefined')){
        completed = false;
        break;
      }
    }

    if(completed){ // if row is completed shift down rows
      if(startOfDeletion === 0) startOfDeletion = y;
      rowsToDelete++;
      for(let i = 0; i < gBArrayWidth; i++){
        stoppedShapeArray[i][y] = 0;
        gameBoardArray[i][y] = 0;
        let coorX = coordinateArray[i][y].x;
        let coorY = coordinateArray[i][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);
      }
    }
  }
  if(rowsToDelete > 0){
    score += 10;
    ctx.fillStyle = 'white';
    ctx.fillRect(310, 109, 140, 19);
    ctx.fillStyle = 'black';
    ctx.fillText(score.toString(), 310, 127);
    MoveAllRowsDown(rowsToDelete, startOfDeletion);
  }
}

function MoveAllRowsDown(rowsToDelete, startOfDeletion){
  for(var i = startOfDeletion-1; i >= 0; i--){
    for(var x = 0; x < gBArrayWidth; x++){
      var y2 = i + rowsToDelete;
      var square = stoppedShapeArray[x][i];
      var nextSquare = stoppedShapeArray[x][y2];
      if(typeof square === 'string'){
        nextSquare = square;
        gameBoardArray[x][y2] = 1;
        stoppedShapeArray[x][y2] = square;
        let coorX = coordinateArray[x][y2].x;
        let coorY = coordinateArray[x][y2].y;
        ctx.fillStyle = nextSquare;
        ctx.fillRect(coorX, coorY, 21, 21);

        square = 0;
        gameBoardArray[x][i] = 0;
        stoppedShapeArray[x][i] = 0;
        coorX = coordinateArray[x][i].x;
        coorY = coordinateArray[x][i].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);
      }
    }
  }
}

function RotateTetromino(){
  let newRotation = new Array();
  let tetrominoCopy = curTetromino;
  let curTetrominoBU;
  for(let i = 0; i < tetrominoCopy.length; i++){
    curTetrominoBU = [...curTetromino]; // tetromino backup copies all the values out of current tetromino without referencing it directly
    let x = tetrominoCopy[i][0];
    let y = tetrominoCopy[i][1];
    let newX = (GetLastSquareX() - y);
    let newY = x;
    newRotation.push([newX, newY]);
  }
  DeleteTetromino();
  try{
    curTetromino = newRotation;
    DrawTetromino();
  }
  catch(e){
    if(e instanceof TypeError){ // instance type error you get when you try and work with a value in an index that doesnt exist which is what would happen if you try and draw tetromino outside of boundaries
      curTetromino = curTetrominoBU;
      DeleteTetromino();
      DrawTetromino();
    }
  }
}

function GetLastSquareX(){
  let lastX = 0;
  for(let i = 0; i < curTetromino.length; i++){
    let square = curTetromino[i];
    if(square[0] > lastX)
      lastX = square[0];
  }
  return lastX;
}
