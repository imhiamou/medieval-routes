const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ROAD_WIDTH = 50;

let cart = {
  x: 50,
  y: 300,
  width: 40,
  height: 30,
  speed: 1.5,
  direction: "right"
};

let intersection = {
  x: 375, // aligned with vertical road
  y: 275, // aligned with horizontal road
  size: ROAD_WIDTH,
  turnUp: false
};

let gameState = "playing";

/* ========================= */
/* DRAWING                   */
/* ========================= */

function drawGrass() {
  ctx.fillStyle = "#6bbf59";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawRoad() {
  ctx.fillStyle = "#9c8b6f";

  // Horizontal road
  ctx.fillRect(0, 275, canvas.width, ROAD_WIDTH);

  // Vertical road
  ctx.fillRect(375, 0, ROAD_WIDTH, 300);

  // Intersection tile (same size as roads)
  ctx.fillStyle = "#3c9a3c";
  ctx.fillRect(intersection.x, intersection.y, ROAD_WIDTH, ROAD_WIDTH);

  // Path indicator
  ctx.strokeStyle = "white";
  ctx.lineWidth = 4;
  ctx.beginPath();

  if (intersection.turnUp) {
    // 90° indicator
    ctx.moveTo(intersection.x + 5, intersection.y + ROAD_WIDTH / 2);
    ctx.lineTo(intersection.x + ROAD_WIDTH / 2, intersection.y + ROAD_WIDTH / 2);
    ctx.lineTo(intersection.x + ROAD_WIDTH / 2, intersection.y + 5);
  } else {
    // Straight indicator
    ctx.moveTo(intersection.x + 5, intersection.y + ROAD_WIDTH / 2);
    ctx.lineTo(intersection.x + ROAD_WIDTH - 5, intersection.y + ROAD_WIDTH / 2);
  }

  ctx.stroke();
}

function drawHouse() {
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(350, 50, 100, 70);
}

function drawDeadEnd() {
  ctx.fillStyle = "#7a3b2e";
  ctx.fillRect(700, 275, 80, ROAD_WIDTH);
}

function drawCart() {
  ctx.fillStyle = "#5a3e2b";
  ctx.fillRect(cart.x, cart.y, cart.width, cart.height);
}

/* ========================= */
/* MOVEMENT LOGIC            */
/* ========================= */

function updateCart() {
  if (gameState !== "playing") return;

  const insideIntersection =
    cart.x + cart.width > intersection.x &&
    cart.x < intersection.x + intersection.size &&
    cart.y + cart.height > intersection.y &&
    cart.y < intersection.y + intersection.size;

  // While inside → continuously follow intersection state
  if (insideIntersection) {
    if (intersection.turnUp) {
      cart.direction = "up";
    } else {
      cart.direction = "right";
    }
  }

  // Apply movement
  if (cart.direction === "right") {
    cart.x += cart.speed;

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

/* ========================= */
/* GAME STATE                */
/* ========================= */

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

/* ========================= */
/* CLICK HANDLER             */
/* ========================= */

canvas.addEventListener("click", (e) => {
  if (gameState !== "playing") return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const clickedIntersection =
    mouseX >= intersection.x &&
    mouseX <= intersection.x + ROAD_WIDTH &&
    mouseY >= intersection.y &&
    mouseY <= intersection.y + ROAD_WIDTH;

  if (clickedIntersection) {
    intersection.turnUp = !intersection.turnUp;
  }
});

/* ========================= */
/* GAME LOOP                 */
/* ========================= */

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
