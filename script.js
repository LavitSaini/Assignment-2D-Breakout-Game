let canvas = document.getElementById("canvas");
let start = document.getElementById("start");
let lives = document.getElementById("lives");
let score = document.getElementById("score");
var ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;
let radius = 10;
let dx = 2;
let dy = -2;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let interval;
const bricks = [];
let livesCount = 3;
let scoreCount = 0;

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = "steelblue";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "steelblue";
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  collisionDetection();
  drawBricks();

  if (x + radius > canvas.width || x - radius < 0) {
    dx = -dx;
  }
  if (y - radius < 0) {
    dy = -dy;
  }

  if (y + radius > canvas.height) {
    livesCount--;
    updateLives();
    resetGame();
  }

  if(!livesCount){
    alert("Game Over!");
    document.location.reload();
    clearInterval(interval);
  }

  if (
    y + radius > canvas.height - 7 &&
    x > paddleX &&
    x < paddleX + paddleWidth
  ) {
    dy = -dy;
  }

  if (rightPressed) {
    paddleX += 2;
  } else if (leftPressed) {
    paddleX -= 2;
  }

  if (rightPressed) {
    paddleX = Math.min(paddleX + 2, canvas.width - paddleWidth);
  } else if (leftPressed) {
    paddleX = Math.max(paddleX - 2, 0);
  }

  x += dx;
  y += dy;
}

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          scoreCount += 5;
          updateScore();
          setTimeout(function(){
            if(scoreCount === 75){
              alert(`You Won! Your Score is ${scoreCount}`);
              document.location.reload();
              clearInterval(interval); 
            }
          }, 100) 
        }
      }
    }
  }
}

function resetGame() {
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
}

function updateScore() {
  score.innerText = `Score: ${scoreCount}`;
}

function updateLives() {
  lives.innerText = `Lives: ${livesCount}`;
}

updateScore();
updateLives();

function startGame() {
  interval = setInterval(draw, 10);
}

// function keyDownHandler(e) {
//   if (e.key === "Right" || e.key === "ArrowRight") {
//     rightPressed = true;
//   } else if (e.key === "Left" || e.key === "ArrowLeft") {
//     leftPressed = true;
//   }
// }

// function keyUpHandler(e) {
//   if (e.key === "Right" || e.key == "ArrowRight") {
//     rightPressed = false;
//   } else if (e.key === "Left" || e.key === "ArrowLeft") {
//     leftPressed = false;
//   }
// }

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// document.addEventListener("keydown", keyDownHandler);
// document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler, false);

start.addEventListener("click", function () {
  startGame();
  this.disabled = true;
});
