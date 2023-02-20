/* //defining constants

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const BLOCK_SIZE = 20;
const COLS = 10;
const ROWS = 20;
const GAME_CLOCK = 1000;
const BOARD = [];
const SCORE = 0;

const SHAPES = [
  // O
  [
    [1, 1],
    [1, 1]
  ],
  // line
  [
    [2, 2, 2, 2]
  ],
  // reverse T
  [
    [0, 3, 0],
    [3, 3, 3]
  ],
  // L
  [
    [4, 0],
    [4, 0],
    [4, 4]
  ],
  // J
  [
    [0, 5],
    [0, 5],
    [5, 5]
  ],
  // S
  [
    [0, 6, 6],
    [6, 6, 0]
  ],
  // Z
  [
    [7, 7, 0],
    [0, 7, 7]
  ],
  // I
  [
    [0, 8, 0, 0],
    [0, 8, 0, 0],
    [0, 8, 0, 0],
    [0, 8, 0, 0]
  ]
];

const SHAPE_COLORS = {
  0: '#333333',
  1: '#D962C5',
  2: '#1DA1F2',
  3: '#4BA672',
  4: '#F2CD13',
  5: '#F22929',
  6: '#F36C4E',
  7: '#F22929',
  8: '#275AF2'
};
*/

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
  '#333333',
  '#D962C5',
  '#1DA1F2',
  '#4BA672',
  '#FFEC5C',
  '#F36C4E',
  '#9C99F2',
  '#BD2A2E',
];
