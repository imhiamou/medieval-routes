// ================================
// Medieval Routes – FULL game.js (FREE SWITCH MODE)
// Design choice:
// - Junction can be switched AT ANY TIME
// - Cart always follows CURRENTLY selected path
// - No locking, no decision window
// - Pure real-time routing (intentional design)
// ================================

const cart = document.getElementById("cart");
const junction = document.getElementById("junction");
const roadA = document.getElementById("roadA");
const roadB = document.getElementById("roadB");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");

// ---------- GAME STATE ----------
let junctionState = 0;   // 0 = roadA, 1 = roadB
let running = true;

// ---------- SPEED ----------
const NORMAL_SPEED = 1.8;
const SLOW_SPEED = 0.8;

// Junction Y zone (visual slowdown only)
const JUNCTION_Y_MIN = 340;
const JUNCTION_Y_MAX = 380;

// ---------- PATH ----------
let progress = 0;

// ---------- INPUT ----------
junction.addEventListener("click", toggleJunction);
junction.addEventListener("touchstart", toggleJunction, { passive: false });

function toggleJunction(e) {
  e.preventDefault();

  junctionState = 1 - junctionState;
  roadA.classList.toggle("active", junctionState === 0);
  roadB.classList.toggle("active", junctionState === 1);
}

// ---------- HELPERS ----------
function getActiveRoad() {
  return junctionState === 0 ? roadA : roadB;
}

function getSpeed(y) {
  return y > JUNCTION_Y_MIN && y < JUNCTION_Y_MAX
    ? SLOW_SPEED
    : NORMAL_SPEED;
}

// ---------- MAIN LOOP ----------
function animate() {
  if (!running) return;

  const activePath = getActiveRoad();
  const pathLength = activePath.getTotalLength();

  // Clamp progress if path length changes
  if (progress > pathLength) progress = pathLength;

  const point = activePath.getPointAtLength(progress);

  cart.setAttribute(
    "transform",
    `translate(${point.x}, ${point.y})`
  );

  progress += getSpeed(point.y);

  if (progress >= pathLength) {
    endGame(junctionState === 0);
    return;
  }

  requestAnimationFrame(animate);
}

// ---------- END GAME ----------
function endGame(success) {
  running = false;
  overlay.classList.remove("hidden");
  message.textContent = success
    ? "Correct delivery 🌾"
    : "Wrong path ❌";
}

// ---------- RESTART ----------
function restart() {
  location.reload();
}

// ---------- START ----------
animate();
