// ================================ // Medieval Routes – FULL game.js // Correct movement, proper diagonal paths, // slow only at junction, no late switching // ================================

const cart = document.getElementById("cart"); const junction = document.getElementById("junction"); const roadA = document.getElementById("roadA"); const roadB = document.getElementById("roadB"); const overlay = document.getElementById("overlay"); const message = document.getElementById("message");

// --- GAME STATE --- let junctionState = 0; // 0 = left, 1 = right let running = true; let progress = 0; let junctionActive = true;

// --- SPEED SETTINGS --- const NORMAL_SPEED = 0.003; const SLOW_SPEED = 0.0012;

// Junction Y zone (matches SVG) const JUNCTION_Y_MIN = 340; const JUNCTION_Y_MAX = 380;

// --- EVENT LISTENERS --- junction.addEventListener("click", toggleJunction); junction.addEventListener("touchstart", toggleJunction, { passive: false });

function toggleJunction(e) { if (!junctionActive) return; e.preventDefault();

junctionState = 1 - junctionState; roadA.classList.toggle("active", junctionState === 0); roadB.classList.toggle("active", junctionState === 1); }

// --- HELPERS --- function getActiveRoad() { return junctionState === 0 ? roadA : roadB; }

function getSpeed(y) { if (y > JUNCTION_Y_MIN && y < JUNCTION_Y_MAX) { return SLOW_SPEED; } return NORMAL_SPEED; }

function updateJunctionAvailability(y) { junctionActive = y > JUNCTION_Y_MIN && y < JUNCTION_Y_MAX; junction.style.opacity = junctionActive ? "1" : "0.4"; }

// --- MAIN LOOP --- function animate() { if (!running) return;

const path = getActiveRoad(); const length = path.getTotalLength();

// Get current point BEFORE advancing const currentPoint = path.getPointAtLength(progress);

// Update speed based on current Y progress += getSpeed(currentPoint.y) * length;

// Clamp progress if (progress > length) progress = length;

const point = path.getPointAtLength(progress);

cart.setAttribute( "transform", translate(${point.x}, ${point.y}) );

updateJunctionAvailability(point.y);

if (progress >= length) { endGame(junctionState === 0); return; }

requestAnimationFrame(animate); }

// --- END GAME --- function endGame(success) { running = false; overlay.classList.remove("hidden"); message.textContent = success ? "Correct delivery 🌾" : "Wrong path ❌"; }

// --- RESTART --- function restart() { location.reload(); }

// --- START --- animate();