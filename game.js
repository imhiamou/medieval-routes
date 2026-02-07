// ================================
// Medieval Routes – FULL game.js (FIXED v2)
// Fixes:
// - Cart moves from START → barn (correct direction)
// - Junction IS clickable when cart reaches it
// - Path locks ONLY AFTER leaving junction
// - No early lock, no dead junction
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
let junctionActive = false;
let pathLocked = false;
let hasEnteredJunction = false; // KEY FIX

// ---------- SPEED (pixels per frame) ----------
const NORMAL_SPEED = 1.8;
const SLOW_SPEED = 0.6;

// Junction Y zone (SVG coordinates)
const JUNCTION_Y_MIN = 340;
const JUNCTION_Y_MAX = 380;

// ---------- PATH ----------
let activePath = roadA;
let pathLength = activePath.getTotalLength();
let progress = 0; // START at beginning of path (bottom)

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
  // Detect entering junction
  if (y > JUNCTION_Y_MIN && y < JUNCTION_Y_MAX) {
    junctionActive = true;
    hasEnteredJunction = true;
    junction.style.opacity = "1";
  } else {
    junctionActive = false;
    junction.style.opacity = "0.35";
  }

  // Lock path ONLY after exiting junction once
  if (hasEnteredJunction && y < JUNCTION_Y_MIN && !pathLocked) {
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
