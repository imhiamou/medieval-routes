const cart = document.getElementById("cart"); const junction = document.getElementById("junction"); const roadA = document.getElementById("roadA"); const overlay = document.getElementById("overlay"); const message = document.getElementById("message");

let running = true;

const SPEED = 1.6;

let activePath = roadA; let pathLength = activePath.getTotalLength(); let progress = 0;

let junctionState = 0;

const NODE_X = parseFloat(junction.getAttribute("cx")); const NODE_Y = parseFloat(junction.getAttribute("cy")); const NODE_RADIUS = parseFloat(junction.getAttribute("r"));

junction.addEventListener("click", toggleJunction); junction.addEventListener("touchstart", toggleJunction, { passive: false });

function toggleJunction(e) { e.preventDefault(); junctionState = 1 - junctionState; }

function isInsideNode(x, y) { return Math.hypot(x - NODE_X, y - NODE_Y) <= NODE_RADIUS; }

function animate() { if (!running) return;

pathLength = activePath.getTotalLength();

const point = activePath.getPointAtLength(progress);

if (isInsideNode(point.x, point.y)) { if (junctionState === 0) { activePath = roadA; } }

cart.setAttribute("transform", translate(${point.x}, ${point.y}));

progress += SPEED;

if (progress >= pathLength) { running = false; overlay.classList.remove("hidden"); message.textContent = "Reached destination"; return; }

requestAnimationFrame(animate); }

function restart() { location.reload(); }

animate();