const cart = document.getElementById("cart"); const junction = document.getElementById("junction"); const roadStraight = document.getElementById("roadA"); const roadAngle = document.getElementById("roadB"); const overlay = document.getElementById("overlay"); const message = document.getElementById("message");

let running = true; let railState = 0;

const NORMAL_SPEED = 1.8; const SLOW_SPEED = 0.8;

const NODE_Y_MIN = 340; const NODE_Y_MAX = 380;

let progress = 0;

junction.addEventListener("click", toggleRail); junction.addEventListener("touchstart", toggleRail, { passive: false });

function toggleRail(e) { e.preventDefault();

railState = 1 - railState;

if (railState === 0) { roadStraight.classList.add("active"); roadAngle.classList.remove("active"); } else { roadStraight.classList.remove("active"); roadAngle.classList.add("active"); } }

function getActiveRoad() { return railState === 0 ? roadStraight : roadAngle; }

function getSpeed(y) { return y > NODE_Y_MIN && y < NODE_Y_MAX ? SLOW_SPEED : NORMAL_SPEED; }

function animate() { if (!running) return;

const activePath = getActiveRoad(); const pathLength = activePath.getTotalLength();

if (progress > pathLength) progress = pathLength;

const point = activePath.getPointAtLength(progress);

cart.setAttribute( "transform", translate(${point.x}, ${point.y}) );

progress += getSpeed(point.y);

if (progress >= pathLength) { endGame(railState === 0); return; }

requestAnimationFrame(animate); }

function endGame(success) { running = false; overlay.classList.remove("hidden"); message.textContent = success ? "Correct delivery" : "Wrong path"; }

function restart() { location.reload(); }

animate();