
class GameBoard {
  constructor(ctx) {
    this.ctx = ctx;
    this.fallingPiece = null;
    this.grid = Array.from({length: ROWS}, () => new Array(COLS).fill(0));
  }

  draw() {
    // Draw the game board
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Draw the falling piece, if there is one
    if (this.fallingPiece) {
      this.fallingPiece.draw(this.ctx);
    }

    // Draw the game board grid
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col] !== 0) {
          this.ctx.fillStyle = "#FFFFFF";
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
    // Update the falling piece, if there is one
    if (this.fallingPiece) {
      this.fallingPiece.update();
    }
  }

  collision(x, y, candidate = null) {
    const shape = candidate || this.fallingPiece.shape;
    if (shape.some((row, i) => {
      return row.some((cell, j) => {
        if (cell === 0) return false;
        const p = x + j;
        const q = y + i;
        if (p < 0 || p >= COLS || q >= ROWS) return true;
        if (q < 0) return false;
        return this.grid[q][p] > 0;
      });
    })) {
      return true;
    }
    return false;
  }

  render() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Render the game board
    this.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        this.ctx.fillStyle = COLORS[cell];
        this.ctx.fillRect(j * blockSize, i * blockSize, blockSize, blockSize);
      });
    });

    // Render the falling piece
    if (this.fallingPiece) {
      this.fallingPiece.render(this.ctx);
    }
  }

  moveDown() {
    if (!this.fallingPiece) {
      this.render();
      return;
    }
    const [x, y] = this.fallingPiece.position;
    if (this.collision(x, y + 1)) {
      this.fallingPiece.shape.forEach((row, i) => {
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
      this.fallingPiece = null;
    } else {
      this.fallingPiece.position[1]++;
    }
    this.render();
  }

move(right) {
  if (!this.fallingPiece) return;
  const { x, y } = this.fallingPiece;
  if (right) {
    if (!this.collision(x + 1, y)) this.fallingPiece.x += 1;
  } else if (!this.collision(x - 1, y)) {
    this.fallingPiece.x -= 1;
  }
  this.render();
}

rotate() {
  if (!this.fallingPiece) {
    return;
  }

  const oldShape = this.fallingPiece.shape;
  const newShape = oldShape.map((row) => [...row]);

  for (let i = 0; i < oldShape.length; i++) {
    for (let j = 0; j < i; j++) {
      [newShape[i][j], newShape[j][i]] = [newShape[j][i], newShape[i][j]];
    }
  }

  newShape.forEach((row) => row.reverse());

  if (!this.collision(this.fallingPiece.x, this.fallingPiece.y, newShape)) {
    this.fallingPiece.shape = newShape;
  }

  this.render();
}

makeStartingGrid() {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}
}