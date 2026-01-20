/* ==================================================
   MAIN JS FOR WEDDING INVITATION
   Handles music, confetti, countdown, scroll, RSVP
================================================== */
document.addEventListener("DOMContentLoaded", () => {

  /* ----------------------------
     SAFE SELECTORS
  ---------------------------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const rand = (min, max) => Math.random() * (max - min) + min;
  const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ----------------------------
   BACKGROUND MUSIC (IF PRESENT)
---------------------------- */
const musicToggle = $("#musicToggle");
const bgMusic = $("#bgMusic");

if (musicToggle && bgMusic) {
  // TRY AUTOPLAY ON PAGE LOAD
  bgMusic.play().catch(() => {
    console.log("Autoplay blocked. Music will start on user interaction.");
  });

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.textContent = '⏸'; // pause icon
    } else {
      bgMusic.pause();
      musicToggle.textContent = '▶'; // play icon
    }
  });
}


  /* ----------------------------
     CONFETTI COLORS
  ---------------------------- */
  const cssVars = getComputedStyle(document.documentElement);
  const CONFETTI_COLORS = [
    cssVars.getPropertyValue("--clr-accent-primary")?.trim(),
    cssVars.getPropertyValue("--clr-accent-strong")?.trim(),
    cssVars.getPropertyValue("--clr-accent-soft")?.trim(),
  ];

  /* ----------------------------
     HERO CONFETTI
  ---------------------------- */
  const confettiContainer = $("#confetti");
  function createConfetti(container, sizeRange = [4, 10], yStart = -10, yEnd = 110) {
    if (!container) return;
    const conf = document.createElement("span");
    const size = rand(sizeRange[0], sizeRange[1]);

    conf.style.position = "absolute";
    conf.style.left = `${rand(0, 100)}%`;
    conf.style.top = `${yStart}px`;
    conf.style.width = `${size}px`;
    conf.style.height = `${size}px`;
    conf.style.backgroundColor = randomFrom(CONFETTI_COLORS);
    conf.style.borderRadius = "50%";
    conf.style.opacity = rand(0.4, 0.9);
    conf.style.pointerEvents = "none";

    conf.animate(
      [
        { transform: "translateY(0) rotate(0deg)" },
        { transform: `translateY(${yEnd}vh) rotate(${rand(180, 540)}deg)` },
      ],
      {
        duration: rand(4000, 6500),
        easing: "linear",
        fill: "forwards",
      }
    );

    container.appendChild(conf);
    setTimeout(() => conf.remove(), 7000);
  }
  if (confettiContainer) setInterval(() => createConfetti(confettiContainer), 250);

  /* ----------------------------
     COUNTDOWN TIMER
  ---------------------------- */
  const countdown = $("#countdown");
  if (countdown) {
    const weddingDate = new Date("June 20, 2027 14:00:00").getTime();

    countdown.innerHTML = `
      <span id="days">00</span>d
      <span id="hours">00</span>h
      <span id="minutes">00</span>m
      <span id="seconds">00</span>s
    `;

    const parts = {
      days: $("#days"),
      hours: $("#hours"),
      minutes: $("#minutes"),
      seconds: $("#seconds"),
    };

    const updateCountdown = () => {
      const diff = weddingDate - Date.now();
      if (diff <= 0) {
        countdown.textContent = "Today is the big day 💍";
        return;
      }
      const values = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
      Object.keys(values).forEach((key) => {
        parts[key].textContent = String(values[key]).padStart(2, "0");
      });
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  /* ----------------------------
     AOS INIT
  ---------------------------- */
  if (window.AOS) AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });

  /* ----------------------------
     NAV SCROLL SHADOW
  ---------------------------- */
  const nav = $(".nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.style.boxShadow = window.scrollY > 30 ? "0 6px 20px rgba(0,0,0,0.25)" : "none";
    });
  }

  /* ----------------------------
     SCROLL TO TOP BUTTON
  ---------------------------- */
  const scrollTopBtn = $("#scrollTopBtn");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.classList.toggle("show", window.scrollY > 200);
    });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ----------------------------
     RSVP CONFETTI (ACCEPT ATTENDING)
  ---------------------------- */
  const attendanceSelect = $("#attendance");
  if (attendanceSelect) {
    attendanceSelect.addEventListener("change", (e) => {
      if (e.target.value.toLowerCase().includes("accept")) launchRSVPConfetti();
    });
  }

  function launchRSVPConfetti() {
    const pieces = 35;
    for (let i = 0; i < pieces; i++) {
      const conf = document.createElement("span");
      const size = rand(6, 10);
      conf.style.position = "fixed";
      conf.style.left = `${rand(0, 100)}vw`;
      conf.style.top = "-10px";
      conf.style.width = `${size}px`;
      conf.style.height = `${size}px`;
      conf.style.borderRadius = "50%";
      conf.style.backgroundColor = randomFrom(CONFETTI_COLORS);
      conf.style.pointerEvents = "none";
      conf.style.zIndex = 9999;

      document.body.appendChild(conf);

      conf.animate(
        [
          { transform: "translateY(0) rotate(0deg)", opacity: 1 },
          { transform: `translateY(300px) rotate(${rand(180, 720)}deg)`, opacity: 0 },
        ],
        { duration: 2200, easing: "ease-out", fill: "forwards" }
      );

      setTimeout(() => conf.remove(), 2300);
    }
  }

});
