// ===========================
// AOS INIT
// ===========================
AOS.init({ duration: 1000, once: true });

// ===========================
// NAVIGATION SHADOW ON SCROLL
// ===========================
const nav = document.querySelector(".nav");

window.addEventListener("scroll", () => {
  nav.style.boxShadow = window.scrollY > 20
    ? "0 4px 15px rgba(0,0,0,0.3)"
    : "none";
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
  const confettiCount = 30;
  for (let i = 0; i < confettiCount; i++) {
    const conf = document.createElement("div");
    conf.className = "confetti";
    conf.style.left = `${Math.random() * 100}vw`;
    conf.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
    conf.style.position = "fixed";
    conf.style.width = "8px";
    conf.style.height = "8px";
    conf.style.borderRadius = "50%";
    conf.style.zIndex = 9999;
    document.body.appendChild(conf);

    conf.animate(
      [
        { transform: `translateY(0px) rotate(0deg)`, opacity: 1 },
        { transform: `translateY(300px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ],
      { duration: 2000, easing: "ease-out", fill: "forwards" }
    );

    setTimeout(() => conf.remove(), 2000);
  }
}

// ===========================
// COUNTDOWN TIMER
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

  if (distance <= 0) {
    countdown.textContent = "The big day is here!";
    return;
  }

  const timeValues = {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((distance / (1000 * 60)) % 60),
    seconds: Math.floor((distance / 1000) % 60)
  };

  for (let key in timeValues) {
    const el = parts[key];
    const value = timeValues[key].toString().padStart(2, "0");

    if (el.innerText !== value) {
      el.classList.remove("fade-in");
      el.classList.add("fade-out");

      setTimeout(() => {
        el.innerText = value;
        el.classList.remove("fade-out");
        el.classList.add("fade-in");
      }, 200);
    }
  }
}

// Initial call + interval
updateCountdown();
setInterval(updateCountdown, 1000);
