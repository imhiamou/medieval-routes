// ================================ // Medieval Routes – FULL game.js (NODE-CENTERED SWITCH) // Final mental model: // - The GREEN NODE is the ONLY place where switching matters // - Train can be switched ONLY while physically INSIDE the node // - Diagonal paths are NEVER globally affected // - Player can click anytime, but effect is LOCAL to node // ================================

const cart = document.getElementById("cart"); const junction = document.getElementById("junction"); const roadA = document.getElementById("roadA"); const roadB = document.getElementById("roadB"); const overlay = document.getElementById("overlay"); const message = document.getElementById("message");

// ---------- GAME STATE ---------- let junctionState = 0;   // what the player selects let effectiveState = 0;  // what the train actually follows let running = true;

// ---------- SPEED ---------- const NORMAL_SPEED = 1.8; const SLOW_SPEED = 0.8;

// ---------- NODE GEOMETRY (SOURCE OF TRUTH) ---------- // MUST match the SVG circle in index.html const NODE_X = 180; const NODE_Y = 360; const NODE_RADIUS = 22;       // visual radius const SWITCH_RADIUS = 22;     // logical radius (tight + intuitive)

// ---------- PATH ---------- let progress = 0; let activePath = roadA;

// ---------- INPUT ---------- junction.addEventListener("click", toggleJunction); junction.addEventListener("touchstart", toggleJunction, { passive: false });

function toggleJunction(e) { e.preventDefault();

// Player intent always allowed junctionState = 1 - junctionState; roadA.classList.toggle("active", junctionState === 0); roadB.classList.toggle("active", junctionState === 1); }

// ---------- HELPERS ---------- function distance(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }

function isInsideNode(x, y) { return distance(x, y, NODE_X, NODE_Y) <= SWITCH_RADIUS; }

function getSpeed(isInNode) { return isInNode ? SLOW_SPEED : NORMAL_SPEED; }

// ---------- MAIN LOOP ---------- function animate() { if (!running) return;

const pathLength = activePath.getTotalLength();

if (progress > pathLength) progress = pathLength;

const point = activePath.getPointAtLength(progress);

// --- NODE-CENTERED LOGIC --- const insideNode = isInsideNode(point.x, point.y);

// ONLY HERE can the path change if (insideNode) { effectiveState = junctionState; activePath = effectiveState === 0 ? roadA : roadB; }

cart.setAttribute( "transform", translate(${point.x}, ${point.y}) );

progress += getSpeed(insideNode);

if (progress >= pathLength) { endGame(effectiveState === 0); return; }

requestAnimationFrame(animate); }

// ---------- END GAME ---------- function endGame(success) { running = false; overlay.classList.remove("hidden"); message.textContent = success ? "Correct delivery 🌾" : "Wrong path ❌"; }

// ---------- RESTART ---------- function restart() { location.reload(); }

// ---------- START ---------- animate();