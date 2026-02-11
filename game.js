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
  locked: false
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

  // horizontal road (always visible)
  ctx.fillRect(0, 275, canvas.width, 50);

  // vertical road (always visible now)
  ctx.fillRect(375, 0, 50, 300);

  // intersection tile (GREEN now)
  ctx.fillStyle = "#3c9a3c";
  ctx.fillRect(intersection.x, intersection.y, TILE, TILE);

  // draw path indicator inside intersection
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 6;

  ctx.beginPath();

  if (intersection.turnUp) {
    // draw corner indicator
    ctx.moveTo(intersection.x + 10, intersection.y + 50);
    ctx.lineTo(intersection.x + 50, intersection.y + 50);
    ctx.lineTo(intersection.x + 50, intersection.y + 10);
  } else {
    // draw straight indicator
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

  // Check if cart inside intersection
  const insideIntersection =
    cart.x + cart.width > intersection.x &&
    cart.x < intersection.x + intersection.size &&
    cart.y + cart.height > intersection.y &&
    cart.y < intersection.y + intersection.size;

  if (!insideIntersection) {
    cart.locked = true;
  }

  if (cart.direction === "right") {
    cart.x += cart.speed;

    if (insideIntersection && intersection.turnUp && !cart.locked) {
      cart.direction = "up";
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
  cart.locked = false;
  intersection.turnUp = false;
  gameState = "playing";
  document.getElementById("ui").classList.add("hidden");
}

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

  const cartInside =
    cart.x + cart.width > intersection.x &&
    cart.x < intersection.x + intersection.size &&
    cart.y + cart.height > intersection.y &&
    cart.y < intersection.y + intersection.size;

  if (clickedIntersection && cartInside && !cart.locked) {
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
