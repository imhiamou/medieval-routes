const cart = document.getElementById("cart");
const junction = document.getElementById("junction");
const roadA = document.getElementById("roadA");
const roadB = document.getElementById("roadB");
const overlay = document.getElementById("overlay");
const message = document.getElementById("message");

let junctionState = 0;
let t = 0;
let speed = 0.002;
let running = true;

junction.addEventListener("click", toggleJunction);
junction.addEventListener("touchstart", toggleJunction);

function toggleJunction(e) {
  e.preventDefault();
  junctionState = 1 - junctionState;
  roadA.classList.toggle("active", junctionState === 0);
  roadB.classList.toggle("active", junctionState === 1);
}

function animate() {
  if (!running) return;

  t += speed;

  let x, y;

  if (junctionState === 0) {
    x = 180 + (100 - 180) * Math.max(0, (t - 0.5) * 2);
    y = 600 - 340 * Math.min(t * 2, 1);
  } else {
    x = 180 + (260 - 180) * Math.max(0, (t - 0.5) * 2);
    y = 600 - 340 * Math.min(t * 2, 1);
  }

  cart.setAttribute("transform", `translate(${x}, ${y})`);

  if (t >= 1) {
    endGame(junctionState === 0);
    return;
  }

  requestAnimationFrame(animate);
}

function endGame(success) {
  running = false;
  overlay.classList.remove("hidden");
  message.textContent = success ? "Correct delivery 🌾" : "Wrong path ❌";
}

function restart() {
  location.reload();
}

animate();
