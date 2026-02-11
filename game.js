const cart = document.getElementById("cart");
const junction = document.getElementById("junction");
const roadStraight = document.getElementById("roadStraight");
const roadAngle = document.getElementById("roadAngle");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");

let running = true;
let railState = 0;
let progress = 0;

const SPEED = 1.5;

junction.addEventListener("click", toggleRail);
junction.addEventListener("touchstart", toggleRail, { passive: false });

function toggleRail(e) {
  e.preventDefault();
  railState = 1 - railState;

  if (railState === 0) {
    roadStraight.classList.add("active");
    roadAngle.classList.remove("active");
  } else {
    roadStraight.classList.remove("active");
    roadAngle.classList.add("active");
  }
}

function getActiveRoad() {
  return railState === 0 ? roadStraight : roadAngle;
}

function animate() {
  if (!running) return;

  const activePath = getActiveRoad();
  const pathLength = activePath.getTotalLength();

  if (progress > pathLength) progress = pathLength;

  const point = activePath.getPointAtLength(progress);

  cart.setAttribute(
    "transform",
    `translate(${point.x}, ${point.y})`
  );

  progress += SPEED;

  if (progress >= pathLength) {
    endGame();
    return;
  }

  requestAnimationFrame(animate);
}

function endGame() {
  running = false;
  overlay.classList.remove("hidden");
  message.textContent = "Finished";
}

function restart() {
  location.reload();
}

animate();