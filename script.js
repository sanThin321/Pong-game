alert(`                       Instruction
    Player Names:
    Enter the names of Player 1 and Player 2 in the input fields
    provided 
    If you don't enter any names, default names "Player 1" and 
    "Player 2" will be used.
    Start Game:
    Click the "Start Game"
    Game Controls:
    Player 1 (Left Paddle):
    Move Up: Press the "W" key.
    Move Down: Press the "S" key.
    Player 2 (Right Paddle):
    Move Up: Press the "Arrow Up" key.
    Move Down: Press the "Arrow Down" key.
`);

const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const paddleWidth = 10;
const paddleHeight = 60;
const ballSize = 10;
const paddleSpeed = 5;

let player1 = { name: "", x: 10, y: canvas.height / 2, dy: 0, score: 0 };
let player3 = {
  name: "",
  x: 10,
  y: canvas.height / 4 - paddleHeight / 4,
  dy: 0,
  score: 0,
};
let player2 = {
  name: "",
  x: canvas.width - 20,
  y: canvas.height / 2,
  dy: 0,
  score: 0,
};
let player4 = {
  name: "",
  x: canvas.width - 20,
  y: canvas.height / 4 - paddleHeight / 2,
  dy: 0,
  score: 0,
};
let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 3, dy: 3 };

let highScore = 0;

function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRect(player1.x, player1.y, paddleWidth, paddleHeight, "#fff");
  // drawRect(player3.x, player3.y, paddleWidth, paddleHeight, "#fff");
  drawRect(player2.x, player2.y, paddleWidth, paddleHeight, "#fff");
  // drawRect(player4.x, player4.y, paddleWidth, paddleHeight, "#fff");
  drawBall(ball.x, ball.y, ballSize, "#fff");

  player1.y += player1.dy;
  player2.y += player2.dy;

  ball.x += ball.dx;
  ball.y += ball.dy;
  player1.y = Math.max(0, Math.min(player1.y, canvas.height - paddleHeight));
  player2.y = Math.max(0, Math.min(player2.y, canvas.height - paddleHeight));

  if (ball.y - ballSize / 2 <= 0 || ball.y + ballSize / 2 >= canvas.height) {
    ball.dy = -ball.dy;
  }

  if (
    (ball.x - ballSize / 2 <= player1.x + paddleWidth &&
      ball.y >= player1.y &&
      ball.y <= player1.y + paddleHeight) ||
    (ball.x + ballSize / 2 >= player2.x &&
      ball.y >= player2.y &&
      ball.y <= player2.y + paddleHeight)
  ) {
    ball.dx = -ball.dx;
    document.getElementById("collisionSound").play();
  }

  if (ball.x - ballSize / 2 <= 0) {
    player2.score++;
    updateScoreTable();
    reset();
    document.getElementById("scoreSound").play();
  } else if (ball.x + ballSize / 2 >= canvas.width) {
    player1.score++;
    updateScoreTable();
    reset();
    document.getElementById("scoreSound").play();
  }
  requestAnimationFrame(draw);
}
function increaseballSpeed() {
  if (highScore >= 5 && highScore < 10) {
    ball.dx *= 2.5;
    ball.dy *= 2.5;
  } else if (highScore >= 10) {
    ball.dx *= 3;
    ball.dy *= 3;
  }
}

function reset() {
  if (player1.score > highScore || player2.score > highScore) {
    highScore = Math.max(player1.score, player2.score);
    updateHighScore();
  }
  if (highScore === 5) {
    document.body.style.backgroundColor = "orange";
  } else if (highScore === 10) {
    document.body.style.backgroundColor = "green";
  }

  if (player1.score === 15 || player2.score === 15) {
    const winner = player1.score === 15 ? player1.name : player2.name;
    alert(`${winner} wins!`);

    cancelAnimationFrame(animationId);
  } else {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = Math.random() > 0.5 ? 3 : -3;
    ball.dy = Math.random() > 0.5 ? 3 : -3;
  }
  increaseballSpeed();
}

function updateHighScore() {
  document.getElementById("highScore").textContent = highScore;
}

function updateScoreTable() {
  document.getElementById("player1Score").textContent = player1.score;
  document.getElementById("player2Score").textContent = player2.score;
}

function startGame() {
  const player1NameInput = document.getElementById("player1Name");
  const player2NameInput = document.getElementById("player2Name");
  player1.name = player1NameInput.value || "Player 1";
  player2.name = player2NameInput.value || "Player 2";

  player1NameInput.disabled = true;
  player2NameInput.disabled = true;

  draw();
}

function tryAgain() {
  window.location.reload();
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && player2.y > 0) {
    player2.dy = -paddleSpeed;
  } else if (
    e.key === "ArrowDown" &&
    player2.y + paddleHeight < canvas.height
  ) {
    player2.dy = paddleSpeed;
  }

  if (e.key === "w" && player1.y > 0) {
    player1.dy = -paddleSpeed;
  } else if (e.key === "s" && player1.y + paddleHeight < canvas.height) {
    player1.dy = paddleSpeed;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    player2.dy = 0;
  }

  if (e.key === "w" || e.key === "s") {
    player1.dy = 0;
  }
});
