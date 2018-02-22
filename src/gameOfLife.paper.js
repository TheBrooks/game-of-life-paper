// Create a circle shaped path with its center at the center
// of the view and a radius of 30:

var LIVE_RECT_LENGTH = 50;
var DEAD_COLOR = "white";
var MAX_HOVER_RECT_LENGTH = 70;

var boardHeight = Math.floor(view.size.height / LIVE_RECT_LENGTH);
var boardWidth = Math.floor(view.size.width / LIVE_RECT_LENGTH);

var gameBoard = createBoard(boardHeight, boardWidth, LIVE_RECT_LENGTH);
setInterval(stepBoard.bind(null, gameBoard), 300);

function createBoard(boardHeight, boardWidth, rectSize) {
  var board = [];
  for (var r = 0; r < boardHeight; r++) {
    var row = [];
    for (var c = 0; c < boardWidth; c++) {
      var rect = new Path.Rectangle(
        c * rectSize,
        r * rectSize,
        rectSize,
        rectSize
      );
      var isAlive = Math.random() > 0.5;
      var color = isAlive ? getRandomColor() : DEAD_COLOR;

      rect.fillColor = color;
      rect.strokeColor = "black";
      rect.isAlive = isAlive;

      rect.onMouseEnter = onMouseEnterRect;
      rect.onMouseLeave = onMouseLeaveRect;
      rect.onFrame = onFrameRect;
      row.push(rect);
    }
    board.push(row);
  }
  return board;
}

function onMouseEnterRect() {
  this.isHovered = true;
  this.bringToFront();
}

function onMouseLeaveRect() {
  this.isHovered = false;
}

function onFrameRect() {
  var INC_SPEED = 3;
  var DEC_SPEED = 1.5;
  if (this.isHovered && this.bounds.width < MAX_HOVER_RECT_LENGTH) {
    var center = this.bounds.center;
    this.bounds.width += INC_SPEED;
    this.bounds.height += INC_SPEED;
    this.bounds.center = center;
  } else if (!this.isHovered && this.bounds.width > LIVE_RECT_LENGTH) {
    var center = this.bounds.center;
    this.bounds.width = Math.max(
      this.bounds.width - DEC_SPEED,
      LIVE_RECT_LENGTH
    );
    this.bounds.height = Math.max(
      this.bounds.height - DEC_SPEED,
      LIVE_RECT_LENGTH
    );
    this.bounds.center = center;
  }
}

function stepBoard(board) {
  if (!board || board.length == 0) {
    return board;
  }
  var nextIsAliveBoard = [];
  var height = board.length;
  var width = board[0].length;
  for (var r = 0; r < height; r++) {
    var row = [];
    for (var c = 0; c < width; c++) {
      var isCurrentlyAlive = board[r][c].isAlive;
      var decrR = mod(r - 1, height);
      var sameR = r;
      var incrR = mod(r + 1, height);
      var decrC = mod(c - 1, width);
      var sameC = c;
      var incrC = mod(c + 1, width);

      var aliveNeighborCount = 0;
      aliveNeighborCount += board[decrR][decrC].isAlive ? 1 : 0;
      aliveNeighborCount += board[sameR][decrC].isAlive ? 1 : 0;
      aliveNeighborCount += board[incrR][decrC].isAlive ? 1 : 0;
      aliveNeighborCount += board[decrR][sameC].isAlive ? 1 : 0;
      aliveNeighborCount += board[incrR][sameC].isAlive ? 1 : 0;
      aliveNeighborCount += board[decrR][incrC].isAlive ? 1 : 0;
      aliveNeighborCount += board[sameR][incrC].isAlive ? 1 : 0;
      aliveNeighborCount += board[incrR][incrC].isAlive ? 1 : 0;
      var isNextStepAlive = isAliveNextStep(
        isCurrentlyAlive,
        aliveNeighborCount
      );
      row.push(isNextStepAlive);
    }
    nextIsAliveBoard.push(row);
  }

  for (var r = 0; r < height; r++) {
    for (var c = 0; c < width; c++) {
      var currentRect = board[r][c];
      var isCurrentlyAlive = currentRect.isAlive;
      var isNextStepAlive = nextIsAliveBoard[r][c];

      if (!isCurrentlyAlive && isNextStepAlive) {
        currentRect.fillColor = getRandomColor();
      }
      if (isCurrentlyAlive && !isNextStepAlive) {
        currentRect.fillColor = DEAD_COLOR;
      }
      currentRect.isAlive = isNextStepAlive;
    }
  }
}

function isAliveNextStep(isCurrentlyAlive, aliveNeighborCount) {
  if (aliveNeighborCount < 2 || aliveNeighborCount > 3) {
    return false;
  }
  if (
    isCurrentlyAlive &&
    (aliveNeighborCount === 2 || aliveNeighborCount === 3)
  ) {
    return true;
  }
  if (!isCurrentlyAlive && aliveNeighborCount === 3) {
    return true;
  }
  return false;
}

function getRandomColor() {
  var hue = Math.floor(Math.random() * 255);
  var color = {
    hue: hue,
    saturation: 0.76,
    brightness: 1
  };
  return color;
}

// accounts for the javascript modulo bug for negative numbers
// faster than the Number.prototype.mod solution
function mod(n, m) {
  return (n % m + m) % m;
}

function onResize(event) {
  // Whenever the window is resized, recenter the path:
  console.log(event);
}
