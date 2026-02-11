const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE = 100;

let cart = {
  x: 50,
  y: 300,
  width: 40,
  height: 30,
  speed: 1.5,
  direction: "right"
};

let intersection = {
  x: 350,
  y: 250,
  size: TILE,
  turnUp: false
};

let gameState = "playing"; // playing | win | lose

function drawGrass() {
  ctx.fillStyle = "#6bbf59";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawRoad() {
  ctx.fillStyle = "#9c8b6f";

  // horizontal road
  ctx.fillRect(0, 275, canvas.width, 50);

  // vertical only if turn is active
  if (intersection.turnUp) {
    ctx.fillRect(375, 0, 50, 300);
  }

  // intersection square
  ctx.fillStyle = "#b3a184";
  ctx.fillRect(intersection.x, intersection.y, TILE, TILE);
}

function drawHouse() {
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(350, 50, 100, 70);
}

function drawDeadEnd() {
  ctx.fillStyle = "#7a3b2e";
  ctx.fillRect(700, 275, 80, 50);
}

function drawCart() {
  ctx.fillStyle = "#5a3e2b";
  ctx.fillRect(cart.x, cart.y, cart.width, cart.height);
}

function updateCart() {
  if (gameState !== "playing") return;

  if (cart.direction === "right") {
    cart.x += cart.speed;

    // Check intersection
    if (
      cart.x + cart.width >= intersection.x &&
      cart.x < intersection.x + TILE
    ) {
      if (intersection.turnUp) {
        cart.direction = "up";
      }
    }

    // Check lose
    if (cart.x > 700) {
      endGame("lose");
    }
  }

  if (cart.direction === "up") {
    cart.y -= cart.speed;

    // Check win
    if (cart.y <= 120) {
      endGame("win");
    }
  }
}

function endGame(result) {
  gameState = result;
  document.getElementById("ui").classList.remove("hidden");
  document.getElementById("resultText").innerText =
    result === "win" ? "YOU WIN 🎉" : "YOU LOSE 💀";
}

function restartGame() {
  cart.x = 50;
  cart.y = 300;
  cart.direction = "right";
  intersection.turnUp = false;
  gameState = "playing";
  document.getElementById("ui").classList.add("hidden");
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (
    mouseX >= intersection.x &&
    mouseX <= intersection.x + TILE &&
    mouseY >= intersection.y &&
    mouseY <= intersection.y + TILE
  ) {
    intersection.turnUp = !intersection.turnUp;
  }
});

function gameLoop() {
  drawGrass();
  drawRoad();
  drawHouse();
  drawDeadEnd();
  drawCart();
  updateCart();
  requestAnimationFrame(gameLoop);
}

gameLoop();
