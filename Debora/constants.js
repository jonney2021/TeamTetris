//defining constants

const GAME_CLOCK = 1000;
const BLOCK_SIDE_LENGTH = 30;
const ROWS = 22;
const COLS = 11;
const SCORE_WORTH = 10;

const SHAPES = [
  [],
  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
  [[2,0,0],[2,2,2],[0,0,0]],
  [[0,0,3],[3,3,3],[0,0,0]],
  [[4,4],[4,4]],
  [[0,5,5],[5,5,0],[0,0,0]],
  [[0,6,0],[6,6,6],[0,0,0]],
  [[7,7,0],[0,7,7],[0,0,0]],
];

const COLORS = [
  '#000000', // black
  '#FF4136', // red
  '#FFDC00', // yellow
  '#0074D9', // blue
  '#2ECC40', // green
  '#B10DC9', // purple
  '#FF851B', // orange
];

const tetromino = new Tetromino(shape, ctx);
