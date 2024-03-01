var canvas = document.getElementsByTagName("canvas")[0];
var canvasContext;
var ballX = 50;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var canvasContext;
// var ballX = 50;
var ballY = 50;
var ballSpeedX = 18;
var ballSpeedY = 16;
// 4
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 14;
const PADDLE_HEIGHT = 130;

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function handleMouseClick(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handleMouseClick);

  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY - 35) {
    paddle2Y = paddle2Y + 60;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y = paddle2Y - 60;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  computerMovement();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX < 0) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player2Score++; // must be BEFORE ballReset()
      ballReset();
    }
  }
  if (ballX > canvas.width) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
    } else {
      player1Score++; // must be BEFORE ballReset()
      ballReset();
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
}

function drawEverything() {
  // next line blanks out the screen with canvas color
  colorRect(0, 0, canvas.width, canvas.height, "#213769");

  if (showingWinScreen) {
    canvasContext.fillStyle = "white";
    canvasContext.textAlign = "center";
    if (player1Score >= WINNING_SCORE) {
      canvasContext.font = "50px Arial";
      canvasContext.fillText("You won", canvas.width / 2, canvas.height / 2);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.font = "50px Arial";
      canvasContext.fillText(
        "Computer won",
        canvas.width / 2,
        canvas.height / 2
      );
    }
    canvasContext.font = "40px Arial";
    canvasContext.fillText("click to continue", canvas.width / 2, 500);
    return;
  }

  drawNet();

  // this is left player paddle
  canvasContext.globalAlpha = 1;
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

  // this is right computer paddle
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "white"
  );

  // next line draws the ball
  colorCircle(ballX, ballY, 10, "white");
  canvasContext.font = "200px Arial";
  canvasContext.globalAlpha = 0.6;
  canvasContext.fillStyle = "white";
  canvasContext.fillText(player1Score, 150, 300);
  canvasContext.fillText(player2Score, canvas.width - 150, 300);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.globalAlpha = 0.6;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// class Player {
//     constructor(x, y, width, height, color) {
//         this.x = x;
//         this.y = y;
//         this.width = width;
//         this.height = height;
//         this.color = color;
//         this.speed = 4;
//         this.velX = 0;
//         this.velY = 0;
//     }

//     draw(ctx) {
//         ctx.fillStyle = this.color;
//         ctx.fillRect(this.x, this.y, this.width, this.height);
//     }

//     update() {
//         this.x += this.velX;
//         this.y += this.velY;
//     }

//     move(dx, dy) {
//         this.velX = dx * this.speed;
//         this.velY = dy * this.speed;
//     }

//     stop() {
//         this.velX = 0;
//         this.velY = 0;
//     }
// }

// var canvas = document.getElementById("myCanvas");

// var ctx = canvas.getContext("2d");

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// var player = new Player(20, 20, 20, 20, "#FF0000");

// var keysPressed = {};
// document.addEventListener("keydown", function(event) {
//     keysPressed[event.key] = true;
//     updatePlayerVelocity();
// });

// document.addEventListener("keyup", function(event) {
//     delete keysPressed[event.key];
//     updatePlayerVelocity();
// });

// function updatePlayerVelocity() {
//     player.velX = (keysPressed['ArrowRight'] ? player.speed : 0) - (keysPressed['ArrowLeft'] ? player.speed : 0);
//     player.velY = (keysPressed['ArrowDown'] ? player.speed : 0) - (keysPressed['ArrowUp'] ? player.speed : 0);
// }

// function gameLoop() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     player.update();

//     player.draw(ctx);

//     requestAnimationFrame(gameLoop);
// }

// gameLoop();
