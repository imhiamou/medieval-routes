const cart = document.getElementById("cart"); const junction = document.getElementById("junction"); const roadA = document.getElementById("roadA"); const roadB = document.getElementById("roadB"); const overlay = document.getElementById("overlay"); const message = document.getElementById("message");

let running = true;

const SPEED = 1.6;

let activePath = roadA; let pathLength = activePath.getTotalLength(); let progress = 0;

function animate() { if (!running) return;

pathLength = activePath.getTotalLength();

const point = activePath.getPointAtLength(progress);

cart.setAttribute( "transform", translate(${point.x}, ${point.y}) );

progress += SPEED;

if (progress >= pathLength) { endGame(true); return; }

requestAnimationFrame(animate); }

function endGame(success) { running = false; overlay.classList.remove("hidden"); message.textContent = success ? "Reached destination" : "Failed"; }

function restart() { location.reload(); }

animate();