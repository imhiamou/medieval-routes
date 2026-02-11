const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TILE = 100;

let cart = {
  x: 50,
  y: 300,
  width: 40,
  height: 30,
  speed: 1.5,
  direction: "right",
  hasChosenDirection: false
};

let intersection = {
  x: 350,
  y: 250,
  size: TILE,
  turnUp: false
};

let gameState = "playing";

function drawGrass() {
  ctx.fillStyle = "#6bbf59";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawRoad() {
  ctx.fillStyle = "#9c8b6f";

  // Horizontal road
  ctx.fillRect(0, 275, canvas.width, 50);

  // Vertical road (always visible)
  ctx.fillRect(375, 0, 50, 300);

  // Intersection tile (green)
  ctx.fillStyle = "#3c9a3c";
  ctx.fillRect(intersection.x, intersection.y, TILE, TILE);

  // Path indicator
  ctx.strokeStyle = "white";
  ctx.lineWidth = 6;
  ctx.beginPath();

  if (intersection.turnUp) {
    // 90° turn indicator
    ctx.moveTo(intersection.x + 10, intersection.y + 50);
    ctx.lineTo(intersection.x + 50, intersection.y + 50);
    ctx.lineTo(intersection.x + 50, intersection.y + 10);
  } else {
    // Straight indicator
    ctx.moveTo(intersection.x + 10, intersection.y + 50);
    ctx.lineTo(intersection.x + 90, intersection.y + 50);
  }

  ctx.stroke();
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

  const insideIntersection =
    cart.x + cart.width > intersection.x &&
    cart.x < intersection.x + intersection.size &&
    cart.y + cart.height > intersection.y &&
    cart.y < intersection.y + intersection.size;

  if (cart.direction === "right") {
    cart.x += cart.speed;

    // ONLY decide direction while inside intersection
    if (insideIntersection && !cart.hasChosenDirection) {
      if (intersection.turnUp) {
        cart.direction = "up";
      }
      cart.hasChosenDirection = true;
    }

    if (cart.x > 700) {
      endGame("lose");
    }
  }

  if (cart.direction === "up") {
    cart.y -= cart.speed;

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
  cart.hasChosenDirection = false;
  intersection.turnUp = false;
  gameState = "playing";
  document.getElementById("ui").classList.add("hidden");
}

// 🔥 CLICK CAN HAPPEN ANYTIME NOW
canvas.addEventListener("click", (e) => {
  if (gameState !== "playing") return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const clickedIntersection =
    mouseX >= intersection.x &&
    mouseX <= intersection.x + TILE &&
    mouseY >= intersection.y &&
    mouseY <= intersection.y + TILE;

  if (clickedIntersection) {
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
