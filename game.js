const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ROAD_WIDTH = 80;

let cart = {
  x: 50,
  y: 310, // adjusted to center inside larger road
  width: 40,
  height: 30,
  speed: 1.5,
  direction: "right"
};

let intersection = {
  x: 360, // centered for 80px road
  y: 260, // centered for 80px road
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

  // Horizontal road (centered vertically)
  ctx.fillRect(0, 260, canvas.width, ROAD_WIDTH);

  // Vertical road (centered horizontally)
  ctx.fillRect(360, 0, ROAD_WIDTH, 340);

  // Intersection tile
  ctx.fillStyle = "#3c9a3c";
  ctx.fillRect(intersection.x, intersection.y, ROAD_WIDTH, ROAD_WIDTH);

  // Path indicator
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.beginPath();

  if (intersection.turnUp) {
    ctx.moveTo(intersection.x + 10, intersection.y + ROAD_WIDTH / 2);
    ctx.lineTo(intersection.x + ROAD_WIDTH / 2, intersection.y + ROAD_WIDTH / 2);
    ctx.lineTo(intersection.x + ROAD_WIDTH / 2, intersection.y + 10);
  } else {
    ctx.moveTo(intersection.x + 10, intersection.y + ROAD_WIDTH / 2);
    ctx.lineTo(intersection.x + ROAD_WIDTH - 10, intersection.y + ROAD_WIDTH / 2);
  }

  ctx.stroke();
}

function drawHouse() {
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(340, 50, 120, 80);
}

function drawDeadEnd() {
  ctx.fillStyle = "#7a3b2e";
  ctx.fillRect(720, 260, 80, ROAD_WIDTH);
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

  if (cart.direction === "right") {
    cart.x += cart.speed;

    if (cart.x > 720) {
      endGame("lose");
    }
  }

  if (cart.direction === "up") {
    cart.y -= cart.speed;

    if (cart.y <= 130) {
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
  cart.y = 310;
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
