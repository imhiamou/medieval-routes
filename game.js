// ================================
// Medieval Routes – FULL game.js (STABLE)
// Fixes:
// - Cart follows ONE path consistently
// - Junction can only be changed INSIDE node
// - Slowdown ONLY inside junction
// - No snapping / no vertical-then-diagonal
// ================================

const cart = document.getElementById("cart");
const junction = document.getElementById("junction");
const roadA = document.getElementById("roadA");
const roadB = document.getElementById("roadB");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");

// ---------- GAME STATE ----------
let junctionState = 0;        // 0 = roadA, 1 = roadB
let running = true;
let junctionActive = true;
let pathLocked = false;      // CRITICAL: lock path after junction

// ---------- SPEED (pixels per frame) ----------
const NORMAL_SPEED = 1.8;
const SLOW_SPEED = 0.6;

// Junction Y zone (SVG coordinates)
const JUNCTION_Y_MIN = 340;
const JUNCTION_Y_MAX = 380;

// ---------- PATH ----------
let activePath = roadA;
let pathLength = activePath.getTotalLength();
let progress = pathLength;   // start at bottom of path

// ---------- INPUT ----------
junction.addEventListener("click", toggleJunction);
junction.addEventListener("touchstart", toggleJunction, { passive: false });

function toggleJunction(e) {
  if (!junctionActive || pathLocked) return;
  e.preventDefault();

  junctionState = 1 - junctionState;
  roadA.classList.toggle("active", junctionState === 0);
  roadB.classList.toggle("active", junctionState === 1);
}

// ---------- HELPERS ----------
function getSpeed(y) {
  return y > JUNCTION_Y_MIN && y < JUNCTION_Y_MAX
    ? SLOW_SPEED
    : NORMAL_SPEED;
}

function updateJunctionState(y) {
  junctionActive = y > JUNCTION_Y_MIN && y < JUNCTION_Y_MAX;
  junction.style.opacity = junctionActive ? "1" : "0.35";

  // Once we EXIT the junction, lock the path permanently
  if (!junctionActive && y < JUNCTION_Y_MIN && !pathLocked) {
    pathLocked = true;
    activePath = junctionState === 0 ? roadA : roadB;
    pathLength = activePath.getTotalLength();
  }
}

// ---------- MAIN LOOP ----------
function animate() {
  if (!running) return;

  const point = activePath.getPointAtLength(progress);

  cart.setAttribute(
    "transform",
    `translate(${point.x}, ${point.y})`
  );

  updateJunctionState(point.y);

  progress -= getSpeed(point.y);

  if (progress <= 0) {
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
