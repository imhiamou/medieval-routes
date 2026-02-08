// ================================ // Medieval Routes – FULL game.js (NODE-ONLY SWITCH v1) // GOAL: // - Cart ALWAYS moves (baseline preserved) // - ONLY a VERY SMALL path INSIDE the node can switch // - Outside the node: NOTHING changes // ================================

const cart = document.getElementById("cart"); const junction = document.getElementById("junction"); const roadA = document.getElementById("roadA"); const roadB = document.getElementById("roadB"); const overlay = document.getElementById("overlay"); const message = document.getElementById("message");

// ---------- GAME STATE ---------- let running = true; let junctionState = 0; // 0 = roadA, 1 = roadB (player choice)

// ---------- SPEED ---------- const SPEED = 1.6; // pixels per frame

// ---------- NODE (READ FROM SVG) ---------- const NODE_X = parseFloat(junction.getAttribute("cx")); const NODE_Y = parseFloat(junction.getAttribute("cy")); const NODE_RADIUS = parseFloat(junction.getAttribute("r"));

// How small the switch zone is (TIGHT = intuitive) const SWITCH_RADIUS = NODE_RADIUS;

// ---------- PATH ---------- let activePath = roadA; // current path the cart follows let pathLength = activePath.getTotalLength(); let progress = 0; // start at beginning

// ---------- INPUT ---------- junction.addEventListener("click", toggleJunction); junction.addEventListener("touchstart", toggleJunction, { passive: false });

function toggleJunction(e) { e.preventDefault(); junctionState = 1 - junctionState;

// Visual feedback only roadA.classList.toggle("active", junctionState === 0); roadB.classList.toggle("active", junctionState === 1); }

// ---------- HELPERS ---------- function isInsideNode(x, y) { return Math.hypot(x - NODE_X, y - NODE_Y) <= SWITCH_RADIUS; }

// ---------- MAIN LOOP ---------- function animate() { if (!running) return;

pathLength = activePath.getTotalLength();

const point = activePath.getPointAtLength(progress);

// --- NODE-ONLY SWITCH LOGIC --- if (isInsideNode(point.x, point.y)) { // ONLY here can the path change activePath = junctionState === 0 ? roadA : roadB; }

// Move cart cart.setAttribute( "transform", translate(${point.x}, ${point.y}) );

// Advance progress += SPEED;

// End if (progress >= pathLength) { endGame(true); return; }

requestAnimationFrame(animate); }

// ---------- END GAME ---------- function endGame(success) { running = false; overlay.classList.remove("hidden"); message.textContent = success ? "Reached destination" : "Failed"; }

// ---------- RESTART ---------- function restart() { location.reload(); }

// ---------- START ---------- animate();