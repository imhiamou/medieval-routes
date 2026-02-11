const cart = document.getElementById("cart");
const junction = document.getElementById("junction");
const mainRoad = document.getElementById("mainRoad");
const leftBranch = document.getElementById("leftBranch");
const rightBranch = document.getElementById("rightBranch");

let progress = 0;
let branch = 0;
let running = true;

const SPEED = 1.5;

junction.addEventListener("click", toggleBranch);
junction.addEventListener("touchstart", toggleBranch, { passive: false });

function toggleBranch(e) {
  e.preventDefault();
  branch = 1 - branch;
}

function animate() {
  if (!running) return;

  let x, y;

  if (progress < 260) {
    x = 180;
    y = 620 - progress;
  } else if (progress < 280) {
    x = 180;
    y = 360;
  } else {
    if (branch === 0) {
      x = 180 - (progress - 280) * 0.8;
      y = 360 - (progress - 280);
    } else {
      x = 180 + (progress - 280) * 0.8;
      y = 360 - (progress - 280);
    }

    if (y < 200) {
      running = false;
    }
  }

  cart.setAttribute("transform", `translate(${x}, ${y})`);

  progress += SPEED;

  requestAnimationFrame(animate);
}

animate();
