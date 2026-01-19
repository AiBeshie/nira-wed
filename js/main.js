// ===========================
// AOS INIT
// ===========================
AOS.init({ duration: 1000, once: true });

// ===========================
// NAVIGATION STICKY HORIZONTAL
// ===========================
const nav = document.querySelector(".nav");

// Optional: Add subtle shadow when scrolling
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    nav.style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
  } else {
    nav.style.boxShadow = "none";
  }
});

// ===========================
// SCROLL-TO-TOP BUTTON
// ===========================
const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===========================
// CONFETTI ON RSVP ACCEPT
// ===========================
const attendanceSelect = document.getElementById("attendance");

attendanceSelect?.addEventListener("change", (e) => {
  if (e.target.value.includes("Accepts")) launchConfetti();
});

function launchConfetti() {
  for (let i = 0; i < 30; i++) {
    const conf = document.createElement("div");
    conf.className = "confetti";
    conf.style.left = Math.random() * 100 + "vw";
    conf.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    document.body.appendChild(conf);
    setTimeout(() => conf.remove(), 2000);
  }
}

// ===========================
// COUNTDOWN WITH SMOOTH ANIMATION
// ===========================
const countdown = document.getElementById("countdown");

countdown.innerHTML = `
  <span id="days" class="count-part"></span>d 
  <span id="hours" class="count-part"></span>h 
  <span id="minutes" class="count-part"></span>m 
  <span id="seconds" class="count-part"></span>s
`;

const parts = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

const weddingDate = new Date("June 20, 2027 14:00:00").getTime();

function updateCountdown() {
  const now = Date.now();
  const distance = weddingDate - now;

  if (distance < 0) {
    countdown.innerHTML = "The big day is here!";
    return;
  }

  const newValues = {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60)
  };

  for (let key in newValues) {
    if (parts[key].innerText != newValues[key]) {
      parts[key].classList.remove("fade-in");
      parts[key].classList.add("fade-out");

      setTimeout(() => {
        parts[key].innerText = newValues[key].toString().padStart(2, "0");
        parts[key].classList.remove("fade-out");
        parts[key].classList.add("fade-in");
      }, 200);
    }
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);
