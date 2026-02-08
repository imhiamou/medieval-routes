// ================================ // Medieval Routes – FULL game.js (NODE-SYNC FIX) // FIXES: // - Node position is READ from SVG (no hardcoded coords) // - Train switches ONLY when physically inside the green node // - Diagonal paths no longer bug out // ================================

const cart = document.getElementById("cart"); const junction = document.getElementById("junction"); const roadA = document.getElementById("roadA"); const roadB = document.getElementById("roadB"); const overlay = document.getElementById("overlay"); const message = document.getElementById("message");

// ---------- GAME STATE ---------- let junctionState = 0;     // player choice let effectiveState = 0;   // applied to cart let running = true;

// ---------- SPEED ---------- const NORMAL_SPEED = 1.8; const SLOW_SPEED = 0.8;

// ---------- READ NODE GEOMETRY FROM SVG ---------- // THIS is what was breaking everything before const NODE_X = parseFloat(junction.getAttribute("cx")); const NODE_Y = parseFloat(junction.getAttribute("cy")); const NODE_RADIUS = parseFloat(junction.getAttribute("r")); const SWITCH_RADIUS = NODE_RADIUS; // logical = visual

// ---------- PATH ---------- let progress = 0; let activePath = roadA;

// ---------- INPUT ---------- junction.addEventListener("click", toggleJunction); junction.addEventListener("touchstart", toggleJunction, { passive: false });

function toggleJunction(e) { e.preventDefault();

junctionState = 1 - junctionState; roadA.classList.toggle("active", junctionState === 0); roadB.classList.toggle("active", junctionState === 1); }

// ---------- HELPERS ---------- function isInsideNode(x, y) { return Math.hypot(x - NODE_X, y - NODE_Y) <= SWITCH_RADIUS; }

function getSpeed(insideNode) { return insideNode ? SLOW_SPEED : NORMAL_SPEED; }

// ---------- MAIN LOOP ---------- function animate() { if (!running) return;

const pathLength = activePath.getTotalLength(); if (progress > pathLength) progress = pathLength;

const point = activePath.getPointAtLength(progress);

const insideNode = isInsideNode(point.x, point.y);

// Switch ONLY when inside the node if (insideNode) { effectiveState = junctionState; activePath = effectiveState === 0 ? roadA : roadB; }

cart.setAttribute( "transform", translate(${point.x}, ${point.y}) );

progress += getSpeed(insideNode);

if (progress >= pathLength) { endGame(effectiveState === 0); return; }

requestAnimationFrame(animate); }

// ---------- END GAME ---------- function endGame(success) { running = false; overlay.classList.remove("hidden"); message.textContent = success ? "Correct delivery 🌾" : "Wrong path ❌"; }

// ---------- RESTART ---------- function restart() { location.reload(); }

// ---------- START ---------- 
animate();