// ================================ // Medieval Routes – FULL game.js (FIXED) // Cart starts correctly, moves immediately, // follows diagonal paths, junction works // ================================

const cart = document.getElementById("cart"); const junction = document.getElementById("junction"); const roadA = document.getElementById("roadA"); const roadB = document.getElementById("roadB"); const overlay = document.getElementById("overlay"); const message = document.getElementById("message");

// ---------- GAME STATE ---------- let junctionState = 0; // 0 = left road, 1 = right road let running = true; let junctionActive = true;

// ---------- SPEED ---------- const NORMAL_SPEED = 1.6;   // pixels per frame const SLOW_SPEED = 0.6;

// Junction Y zone (SVG coords) const JUNCTION_Y_MIN = 340; const JUNCTION_Y_MAX = 380;

// ---------- PATH PROGRESS ---------- // We move FROM bottom → top, so we start at full length let activePath = roadA; let pathLength = activePath.getTotalLength(); let progress = pathLength;

// ---------- INPUT ---------- junction.addEventListener("click", toggleJunction); junction.addEventListener("touchstart", toggleJunction, { passive: false });

function toggleJunction(e) { if (!junctionActive) return; e.preventDefault();

junctionState = 1 - junctionState; roadA.classList.toggle("active", junctionState === 0); roadB.classList.toggle("active", junctionState === 1); }

// ---------- HELPERS ---------- function getActiveRoad() { return junctionState === 0 ? roadA : roadB; }

function getSpeed(y) { return y > JUNCTION_Y_MIN && y < JUNCTION_Y_MAX ? SLOW_SPEED : NORMAL_SPEED; }

function updateJunctionAvailability(y) { junctionActive = y > JUNCTION_Y_MIN && y < JUNCTION_Y_MAX; junction.style.opacity = junctionActive ? "1" : "0.35"; }

// ---------- MAIN LOOP ---------- function animate() { if (!running) return;

activePath = getActiveRoad(); pathLength = activePath.getTotalLength();

const point = activePath.getPointAtLength(progress);

// Move cart cart.setAttribute( "transform", translate(${point.x}, ${point.y}) );

updateJunctionAvailability(point.y);

// Advance movement (reverse direction) progress -= getSpeed(point.y);

// End condition if (progress <= 0) { endGame(junctionState === 0); return; }

requestAnimationFrame(animate); }

// ---------- END GAME ---------- function endGame(success) { running = false; overlay.classList.remove("hidden"); message.textContent = success ? "Correct delivery 🌾" : "Wrong path ❌"; }

// ---------- RESTART ---------- function restart() { location.reload(); }

// ---------- START ---------- 
animate();