// Create a circle shaped path with its center at the center
// of the view and a radius of 30:

function onResize(event) {
  // Whenever the window is resized, recenter the path:
  path.position = view.center;
}

var LIFE_SQUARE_LENGTH = 50;
var DEAD_COLOR = "white";

var height = Math.floor(view.size.height / LIFE_SQUARE_LENGTH);
var width = Math.floor(view.size.width / LIFE_SQUARE_LENGTH);
console.log(width);
var board = [];
for (var c = 0; c < height; c++) {
  var row = [];
  for (var r = 0; r < width; r++) {
    var rect = new Path.Rectangle(
      r * LIFE_SQUARE_LENGTH,
      c * LIFE_SQUARE_LENGTH,
      LIFE_SQUARE_LENGTH,
      LIFE_SQUARE_LENGTH
    );
    var alive = Math.random() > 0.5;
    var hue = Math.floor(Math.random() * 255);
    var color = getRandomColor();

    if (!alive) {
      color = DEAD_COLOR;
    }
    rect.fillColor = color;
    rect.strokeColor = "black";
    rect.isAlive = alive;

    rect.onMouseEnter = function() {
      this.scale(2);
      this.bringToFront();
    };
    rect.onMouseLeave = function() {
      this.scale(0.5);
    };
    row.push(rect);
  }
  board.push(row);
}
console.log(board[0][0].fillColor);
console.log(height);

function stepBoard() {
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

//need to set a prototype function on rectangle class so that isAlive changes the fill color

setInterval(stepBoard, 300);
