class Tetromino {
            constructor(shape, ctx) {
              this.shape = shape;
              this.ctx = ctx;
              this.y = 0;
              this.x = 0;
            }
          }
          
renderTetromino () {
    this.shape.map((row, rowIndex) => {
        row.map((cell, cellIndex) => {
          if (cell > 0) {
            this.ctx.fillStyle = COLORS[cell];
            this.ctx.fillRect(
              this.x + cellIndex,
              this.y + rowIndex,
              1,
              1
            );
          }
        });
      });
    }
