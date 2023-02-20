// this class is being used to model the state of a game, 
// with this.ctx storing a reference to a canvas context that is used to draw the game board,
// this.fallingPiece representing the current piece that is falling, 
// and this.grid representing the state of the game board itself.

class GameModel {
    constructor(ctx) {
      //is set to the value of the ctx parameter, which is expected to be a canvas rendering context
      this.ctx = ctx;
      //is set to null, indicating that there is currently no falling piece in the game
      this.fallingPiece = null;
      // is set to a two-dimensional array of dimensions ROWS by COLS, where each element is initialized to 0
      this.grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
    }
  
    // This is a method called collision that takes two arguments x and y,
    // which represent the coordinates of a potential collision with a falling piece. 
    // Additionally, there is an optional candidate parameter that defaults to null.
//this method checks if there is a collision between a candidate piece or the current falling piece and the game grid at the specified coordinates
    collision(x, y, candidate = null) {
      //The method first checks if candidate is truthy, and if so,
      // sets shape to candidate. Otherwise, it sets shape to the shape of the current falling piece, which is stored in this.fallingPiece.shape.
      const shape = candidate || this.fallingPiece.shape;
      //The method then checks if any element of shape returns true for the inner some method.
      // This inner method iterates over each row of the shape and checks if any cell in that row returns true for the innermost some method
      // For each cell, the method checks if its value is 0
         // If it is, it returns false, indicating that there is no collision
         // If the value is not 0, it calculates the coordinates of the cell in the game grid by adding j to x and i to y.
      return shape.some((row, i) =>
        row.some((cell, j) => {
         //The method then checks if the calculated coordinates are out of bounds of the game grid. If either the x-coordinate is less than 0,
          // or greater than or equal to the number of columns (COLS),
          // or the y-coordinate is greater than or equal to the number of rows (ROWS), then it returns true, indicating that there is a collision.
          //If the coordinates are not out of bounds, the method checks if the corresponding cell in the game grid is greater than 0
          //If it is, then it means there is already a piece in that location, indicating a collision. If not, the method returns false.
          if (cell === 0) return false;
          const p = x + j;
          const q = y + i;
        
          return (
            p < 0 || p >= COLS || q >= ROWS || (q >= 0 && this.grid[q][p] > 0)
          );
        })
      );
    }
  
    //this method renders the game board and the falling piece onto the canvas using the appropriate colors for each cell of the game board and the falling piece
    renderGameState() {
      // The method iterates over each row of the game grid using the forEach method
      // For each row, it iterates over each cell of the row and sets the fill color of the canvas context (this.ctx.fillStyle)
      // to the color corresponding to the cell value (which is an index into the COLORS array)
      this.grid.forEach((row, i) =>
        row.forEach((cell, j) => {
         // The method then draws a rectangle (this.ctx.fillRect) on the canvas at position (j, i)
        // with dimensions (1, 1), which effectively fills in a single pixel of the game board with the corresponding color
          this.ctx.fillStyle = COLORS[cell];
          this.ctx.fillRect(j, i, 1, 1);
        })
      );

      //After rendering the game grid, the method checks if there is a falling piece (this.fallingPiece is not null
      // If there is a falling piece, it calls the renderPiece method of the fallingPiece object, 
      //which is expected to draw the falling piece onto the canvas using the same canvas context (this.ctx)
      if (this.fallingPiece) this.fallingPiece.renderPiece();
    }
  
    //The moveDown() method first checks if there is a falling piece currently present in the game
    //If there isn't, the method returns without doing anything and simply calls renderGameState() to update the game display
    moveDown() {
      // If there is a falling piece, the method checks if there is a collision between the falling piece and the game grid at its current position ((x, y + 1))
      // This is done using the collision method with the candidate position.
      if (!this.fallingPiece) return this.renderGameState();
      //If there is a collision, the method updates the game grid to include the shape of the falling piece at its current position, using a nested forEach loop
      if (this.collision(this.fallingPiece.x, this.fallingPiece.y + 1)) {
        const { shape, x, y } = this.fallingPiece;
        shape.forEach((row, i) =>
          row.forEach((cell, j) => {
            const p = x + j;
            const q = y + i;
            if (cell > 0 && q >= 0) this.grid[q][p] = shape[i][j];
          })
        );
     //If the falling piece has reached the top of the game grid (y === 0), the method displays an alert indicating that the game is over and resets the game grid to all zeros
        if (this.fallingPiece.y === 0) {
          alert("Game over!");
          this.grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
        }
    // Regardless of whether there is a collision, the method sets the falling piece to null to indicate that there is no longer a falling piece
        this.fallingPiece = null;
    //If there is no collision, the method increments the y coordinate of the falling piece by 1 to move it down one row
      } else this.fallingPiece.y += 1;
      // the moveDown() method calls renderGameState() to update the game display.
      this.renderGameState();
    }
  
    move(right) {
      if (!this.fallingPiece) return;
      const { x, y } = this.fallingPiece;
      if (right) {
        if (!this.collision(x + 1, y)) this.fallingPiece.x += 1;
      } else if (!this.collision(x - 1, y)) {
        this.fallingPiece.x -= 1;
      }
      this.renderGameState();
    }
  
    // The rotate() method checks if there is a falling piece currently present in the game
    // If there isn't, the method returns without doing anything
    // Otherwise, it creates a copy of the shape of the falling piece using map and the spread syntax
    // This is done so that the original shape is not modified during the rotation
    rotate() {
      if (!this.fallingPiece) return;
      const shape = this.fallingPiece.shape.map((row) => [...row]);
      // The method then iterates over each element of the shape matrix and transposes it, effectively rotating the matrix 90 degrees clockwise
      // This is done using a double for loop and destructuring assignment to swap the values of the elements at (x, y) and (y, x)
      for (let y = 0; y < shape.length; ++y) {
        for (let x = 0; x < y; ++x) {
          [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]];
        }
      }
      // After the matrix has been rotated, the method reverses each row of the matrix using reverse()
      // This is necessary because transposing the matrix actually flips it along its diagonal, 
      // so each row needs to be flipped horizontally to produce the final rotated shape
      shape.forEach((row) => row.reverse());
      // The method then checks if the rotated shape collides with the game grid using the collision method with the candidate shape as the third parameter
      // If the rotated shape does not collide with the game grid, the method sets the shape of the falling piece to the rotated shape.
      if (!this.collision(this.fallingPiece.x, this.fallingPiece.y, shape)) {
        this.fallingPiece.shape = shape;
      }

      // Finally, the rotate() method calls renderGameState() to update the game display
      // The makeStartingGrid() method simply returns a 2D array of zeros with dimensions (ROWS, COLS)
      // This method is used to initialize the game grid in the constructor of the GameModel class
      this.renderGameState();
    }

// The makeStartingGrid() method returns a 2D array representing the game grid with all cells initialized to 0
// It uses the Array.from() method to create a new array with a length of ROWS. 
// The second argument of Array.from() is a mapping function that returns a new array with a length of COLS and all values initialized to 0
// This mapping function is applied to each element of the new array created by Array.from(), resulting in a 2D array of dimensions ROWS x COLS with all cells initialized to 0
// The makeStartingGrid() method is used in the constructor() method of the GameModel class to initialize the grid property of the game model with an empty grid when a new game is started
    makeStartingGrid() {
      return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
    }
  }
  