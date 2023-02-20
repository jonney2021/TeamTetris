class GameBoard {
  constructor(ctx) {
    this.ctx = ctx;
    this.fallingTetromino = null;
    this.grid = Array.from({length: ROWS}, () => new Array(COLS).fill(0));
  }

  draw() {
    // Draw the game board
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Draw the falling Tetromino, if there is one
    if (this.fallingTetromino) {
      this.fallingTetromino.draw(this.ctx);
    }

    // Draw the game board grid
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col] !== 0) {
          this.ctx.fillStyle = COLORS[this.grid[row][col]];
          this.ctx.fillRect(
            col * blockSize,
            row * blockSize,
            blockSize,
            blockSize
          );
        }
      }
    }
  }

  update() {
    // Update the falling Tetromino, if there is one
    if (this.fallingTetromino) {
      this.fallingTetromino.update();
    }
  }

  collision(x, y, candidate = null) {
    const shape = candidate || this.fallingTetromino.shape;
    return shape.some((row, i) =>
      row.some((cell, j) => {
        if (cell === 0) return false;
        const p = x + j;
        const q = y + i;
        return (
          p < 0 || p >= COLS || q >= ROWS || (q >= 0 && this.grid[q][p] > 0)
        );
      })
    );
  }

  render() {
    this.grid.forEach((row, i) =>
      row.forEach((cell, j) => {
        this.ctx.fillStyle = COLORS[cell];
        this.ctx.fillRect(
          j * blockSize,
          i * blockSize,
          blockSize,
          blockSize
        );
      })
    );
    
    // Render the falling Tetromino
    if (this.fallingTetromino) {
      this.fallingTetromino.render(this.ctx);
    }
  }

  moveDown() {
    if (!this.fallingTetromino) {
      this.render();
      return;
    }
    const [x, y] = this.fallingTetromino.position;
    if (this.collision(x, y + 1)) {
      this.fallingTetromino.shape.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell !== 0) {
            this.grid[y + i][x + j] = cell;
          }
        });
      });
      if (y === 0) {
        alert('Game over!');
        this.resetGameGrid();
      }
      this.fallingTetromino = null;
    } else {
      this.fallingTetromino.position[1]++;
    }
    this.render();
  }

  move(moveRight = true) {
    if (!this.fallingTetromino) return;
  
    const { x, y } = this.fallingTetromino;
    const newX = moveRight ? x + 1 : x - 1;
  
    if (!this.collision({ x: newX, y })) {
      this.fallingTetromino.x = newX;
      this.render();
    }
  }
  
  rotate() {
    if (!this.fallingTetromino) return;
  
    const oldShape = this.fallingTetromino.shape;
    const newShape = oldShape.map((row) => [...row]);
  
    for (let i = 0; i < oldShape.length; i++) {
      for (let j = 0; j < i; j++) {
        [newShape[i][j], newShape[j][i]] = [newShape[j][i], newShape[i][j]];
      }
    }
  
    newShape.forEach((row) => row.reverse());
  
    const { x, y } = this.fallingTetromino;
  
    if (!this.collision({ x, y, shape: newShape })) {
      this.fallingTetromino.shape = newShape;
      this.render();
    }
  }
  
  makeStartingGrid() {
    return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
  }
}