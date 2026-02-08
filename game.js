const cart = document.getElementById("cart"); const junction = document.getElementById("junction"); const roadA = document.getElementById("roadA"); const roadB = document.getElementById("roadB"); const overlay = document.getElementById("overlay"); const message = document.getElementById("message");

let running = true; let junctionState = 0;

const SPEED = 1.6;

const NODE_X = parseFloat(junction.getAttribute("cx")); const NODE_Y = parseFloat(junction.getAttribute("cy")); const NODE_RADIUS = parseFloat(junction.getAttribute("r")); const SWITCH_RADIUS = NODE_RADIUS;

let activePath = roadA; let pathLength = activePath.getTotalLength(); let progress = 0;

junction.addEventListener("click", toggleJunction); junction.addEventListener("touchstart", toggleJunction, { passive: false });

function toggleJunction(e) { e.preventDefault(); junctionState = 1 - junctionState; roadA.classList.toggle("active", junctionState === 0); roadB.classList.toggle("active", junctionState === 1); }

function isInsideNode(x, y) { return Math.hypot(x - NODE_X, y - NODE_Y) <= SWITCH_RADIUS; }

function animate() { if (!running) return;

pathLength = activePath.getTotalLength();

const point = activePath.getPointAtLength(progress);

if (isInsideNode(point.x, point.y)) { activePath = junctionState === 0 ? roadA : roadB; }

cart.setAttribute( "transform", translate(${point.x}, ${point.y}) );

progress += SPEED;

if (progress >= pathLength) { running = false; overlay.classList.remove("hidden"); message.textContent = "Reached destination"; return; }

requestAnimationFrame(animate); }

function restart() { location.reload(); }

animate();