var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height-30;

var dx = 2;
var dy = -2;

var rightPressed = false;
var leftPressed = false;

/**
 * Define a paddle to hit the ball.
 */
 var paddleHeight = 10;
 var paddleWidth = 75;
 var paddleX = (canvas.width-paddleWidth)/2;

/**
 * Simple collision detection.
 */
var ballRadius = 10;

/**
 * Set up the brick variables.
 */
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

/**
 * Keep track of the player's score.
 */
var score = 0;

/**
 * Keep track of the number of lives remaining.
 */
var lives = 3;

/**
 * Keep track of the level player is on.
 */
var level = 1;

var ballColor = "#ff0000";
var paddleColor = "#000000";
var brickColor = "#0095DD";

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1};
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = paddleColor;
  ctx.fill();
  ctx.closePath();
}

function draw() {
  // clearRect helps prevent making the ball draw a line.
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();
  drawScore();
  drawLives();
  drawLevel();

  if (x + dx < ballRadius) {
    dx = -dx;
  }
  else if (x + dx > canvas.width-ballRadius) {
    dx = -dx;
  }

  // Implement a game over.
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  else if (y + dy > canvas.height-ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    else {
      lives--;
      if(lives < 0) {
          alert("GAME OVER! Better luck next time!");
          document.location.reload();
      }
      else {
          x = canvas.width/2;
          y = canvas.height-30;
          dx = 2;
          dy = -2;
          paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
  }
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

function drawBricks() {
for(c=0; c<brickColumnCount; c++) {
  for(r=0; r<brickRowCount; r++) {
    if(bricks[c][r].status == 1) {
      var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
      var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
      bricks[c][r].x = brickX;
      bricks[c][r].y = brickY;
      ctx.beginPath();
      ctx.rect(brickX, brickY, brickWidth, brickHeight);
      ctx.fillStyle = brickColor;
      ctx.fill();
      ctx.closePath();
    }
  }
}
}

// Listens to the user pressing up and down keyboard buttons.
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  }
  else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  }
  else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

function collisionDetection() {
  for(c=0; c<brickColumnCount; c++) {
    for(r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if(score == brickRowCount*brickColumnCount) {
            level++;

            // Change the color every 5 levels.

            // alert("Congratulations! You're the lucky winner!");
            if (level == 2) {
              ballColor = "#000000";
              paddleColor = "blue";
              brickColor = "orange";
            }
            else if (level == 3) {
              ballColor = "brown";
              paddleColor = "maroon";
              brickColor = "green";
            }

            // Populate the bricks.
            for (c = 0; c < brickColumnCount; c++) {
              bricks[c] = [];
              for (r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1};
              }
            }
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
  ctx.font = "14pt Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText("Lives: " + lives, canvas.width-75, 20);
}

function drawLevel() {
  ctx.font = "14pt Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText("Level: " + level, canvas.width-150, 20);
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
  }
}

draw();
