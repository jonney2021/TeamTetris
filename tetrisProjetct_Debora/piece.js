class Piece {
    // The constructor method takes two parameters, shape and ctx, and initializes the shape, ctx, y, and x properties of the Piece instance
    constructor(shape, ctx) {
       // The shape parameter is expected to be a 2D array of integers, where each integer represents a color of a block in the piece
        this.shape = shape 
        // The ctx parameter is expected to be a CanvasRenderingContext2D object, which is used for drawing on an HTML canvas element
        this.ctx = ctx 
        this.y = 0 
        this.x = Math.floor(COLS / 2)
    }

    //The renderPiece method iterates over the shape array using two nested map functions, which iterates over each row and each cell in that row.
    renderPiece() {
        this.shape.map((row, i) => {
            row.map((cell, j) => {
                // If the value of the cell is greater than zero (meaning it has a color), the method sets the fill color of the canvas context to the corresponding color from an array of COLORS, 
                // and then fills a rectangle with a width and height of 1 pixel at the position (this.x + j, this.y + i), where i and j are the row and cell indices, respectively
                if (cell > 0) {
                    this.ctx.fillStyle = COLORS[cell] 
                    this.ctx.fillRect(this.x + j, this.y + i, 1, 1)
                }
            })
        })
    }
}

