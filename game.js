const cart = document.getElementById("cart"); const roadA = document.getElementById("roadA"); const overlay = document.getElementById("overlay"); const message = document.getElementById("message");

let running = true;

const SPEED = 1.6;

let activePath = roadA; let progress = 0;

function animate() { if (!running) return;

const pathLength = activePath.getTotalLength(); const point = activePath.getPointAtLength(progress);

cart.setAttribute( "transform", translate(${point.x}, ${point.y}) );

progress += SPEED;

if (progress >= pathLength) { running = false; overlay.classList.remove("hidden"); message.textContent = "Reached destination"; return; }

requestAnimationFrame(animate); }

function restart() { location.reload(); }

animate();