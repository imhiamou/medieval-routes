// ================================ // Medieval Routes – FULL game.js (BASELINE FIX) // GOAL OF THIS VERSION: // - Cart ALWAYS moves (no node logic yet) // - Follows ONE path cleanly from start to end // - This is a STABLE BASELINE to build from // ================================

const cart = document.getElementById("cart"); const junction = document.getElementById("junction"); const roadA = document.getElementById("roadA"); const roadB = document.getElementById("roadB"); const overlay = document.getElementById("overlay"); const message = document.getElementById("message");

// ---------- GAME STATE ---------- let running = true;

// ---------- SPEED ---------- const SPEED = 1.6; // pixels per frame

// ---------- PATH ---------- // IMPORTANT: SVG paths go FROM BOTTOM → TOP let activePath = roadA; let pathLength = activePath.getTotalLength(); let progress = 0; // START AT BEGINNING

// ---------- MAIN LOOP ---------- function animate() { if (!running) return;

// Safety: recalc length once pathLength = activePath.getTotalLength();

// Get current point const point = activePath.getPointAtLength(progress);

// Move cart cart.setAttribute( "transform", translate(${point.x}, ${point.y}) );

// Advance progress += SPEED;

// End if (progress >= pathLength) { endGame(true); return; }

requestAnimationFrame(animate); }

// ---------- END GAME ---------- function endGame(success) { running = false; overlay.classList.remove("hidden"); message.textContent = success ? "Reached destination" : "Failed"; }

// ---------- RESTART ---------- function restart() { location.reload(); }

// ---------- START ---------- animate();