const cart = document.getElementById("cart");
const junction = document.getElementById("junction");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");

let x = 180;
let y = 620;

let branch = 0;
let state = "vertical";
let running = true;

const SPEED = 1.5;

junction.addEventListener("click", () => {
  if (state === "node") {
    branch = 1 - branch;
  }
});

junction.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (state === "node") {
    branch = 1 - branch;
  }
}, { passive: false });

function animate() {
  if (!running) return;

  if (state === "vertical") {
    y -= SPEED;

    if (y <= 360) {
      y = 360;
      state = "node";
    }
  }

  else if (state === "node") {
    y -= SPEED;

    if (y <= 350) {
      state = "branch";
    }
  }

  else if (state === "branch") {

    if (branch === 0) {
      x -= SPEED;
      y -= SPEED;
    } else {
      x += SPEED;
      y -= SPEED;
    }

    if (y <= 260) {
      running = false;
      overlay.classList.remove("hidden");
      message.textContent = branch === 0
        ? "Went Left"
        : "Went Right";
    }
  }

  cart.setAttribute("cx", x);
  cart.setAttribute("cy", y);

  requestAnimationFrame(animate);
}

function restart() {
  location.reload();
}

animate();
