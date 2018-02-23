// Create a circle shaped path with its center at the center
// of the view and a radius of 30:

var LIVE_RECT_LENGTH = 35;
var DEAD_COLOR = "white";
var MAX_HOVER_RECT_LENGTH = LIVE_RECT_LENGTH * 1.5;
var TOOL_BAR_HEIGHT = 50;

var boardHeight = Math.floor(
  (view.size.height - TOOL_BAR_HEIGHT) / LIVE_RECT_LENGTH
);
var boardWidth = Math.floor(view.size.width / LIVE_RECT_LENGTH);

var gameBoard = createBoard(boardHeight, boardWidth, LIVE_RECT_LENGTH);
var toolBarOrigin = new Point(0, boardHeight * LIVE_RECT_LENGTH);
var toolBarSize = new Size(view.size.width, TOOL_BAR_HEIGHT);
var toolBar = createToolBar(toolBarOrigin, toolBarSize);

function createToolBar(toolBarOrigin, toolBarSize) {
  var startButton = Shape.Rectangle(
    toolBarOrigin.x,
    toolBarOrigin.y,
    toolBarSize.width / 3,
    toolBarSize.height
  );
  startButton.fillColor = "green";
  var interval;
  startButton.onMouseDown = function() {
    interval = setInterval(stepBoard.bind(null, gameBoard), 333);
  };

  var pauseButton = Shape.Rectangle(
    toolBarOrigin.x + toolBarSize.width / 3,
    toolBarOrigin.y,
    toolBarSize.width / 3,
    toolBarSize.height
  );

  pauseButton.fillColor = "red";
  pauseButton.onMouseDown = function() {
    clearInterval(interval);
  };

  var randomizeButton = Shape.Rectangle(
    toolBarOrigin.x + 2 * toolBarSize.width / 3,
    toolBarOrigin.y,
    toolBarSize.width / 3,
    toolBarSize.height
  );

  randomizeButton.fillColor = "purple";
  randomizeButton.onMouseDown = function() {
    randomizeBoard(gameBoard);
  };
}

function createBoard(boardHeight, boardWidth, rectSize) {
  var board = [];
  for (var r = 0; r < boardHeight; r++) {
    var row = [];
    for (var c = 0; c < boardWidth; c++) {
      var rect = new Shape.Rectangle(
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
      rect.applyMatrix = false;

      rect.onMouseEnter = onMouseEnterRect;
      rect.onMouseLeave = onMouseLeaveRect;
      rect.onFrame = onFrameRect;
      rect.onMouseDown = onMouseDownRect;
      row.push(rect);
    }
    board.push(row);
  }
  return board;
}

function randomizeBoard(board) {
  if (!board || board.length == 0) {
    return board;
  }
  var height = board.length;
  var width = board[0].length;
  for (var r = 0; r < height; r++) {
    for (var c = 0; c < width; c++) {
      if (Math.random() > 0.5) {
        toggleRectAlive(board[r][c]);
      }
    }
  }
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
  if (this.isHovered && this.size.width < MAX_HOVER_RECT_LENGTH) {
    var center = this.bounds.center;
    this.size.width += INC_SPEED;
    this.size.height += INC_SPEED;
    this.bounds.center = center;
  } else if (!this.isHovered && this.size.width > LIVE_RECT_LENGTH) {
    var center = this.bounds.center;
    this.size.width = Math.max(this.size.width - DEC_SPEED, LIVE_RECT_LENGTH);
    this.size.height = Math.max(this.size.height - DEC_SPEED, LIVE_RECT_LENGTH);
    this.bounds.center = center;
  }

  if (this.isHovered) {
    this.rotate(4);
  } else if (true || this.rotation != 0) {
    var rotateAngle = this.rotation - 7 >= 0 ? -5 : -1 * this.rotation;
    this.rotate(rotateAngle);
  }
}

function toggleRectAlive(rect) {
  rect.isAlive = !rect.isAlive;
  // this code should belong elsewhere
  // if possible rect.isAlive should control the color
  if (rect.isAlive) {
    rect.fillColor = getRandomColor();
  } else {
    rect.fillColor = DEAD_COLOR;
  }
}

function onMouseDownRect() {
  toggleRectAlive(this);
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

      if (isCurrentlyAlive ^ isNextStepAlive) {
        toggleRectAlive(currentRect);
      }
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
