/* ==================================================
   MAIN JS — WEDDING INVITATION (FINAL CLEAN)
   Features:
   - Background music + selector
   - Hero & RSVP confetti
   - Countdown timer
   - Scroll effects
   - RSVP submit (Google Sheets)
   - Google Drive galleries w/ pagination
   - Lightbox (keyboard + arrows)
   - Settings panel (background + music)
================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ==================================================
     HELPERS
  ================================================== */
  const $  = (q) => document.querySelector(q);
  const $$ = (q) => document.querySelectorAll(q);
  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ==================================================
     BACKGROUND MUSIC
  ================================================== */
  const bgMusic = $("#bgMusic");
  const musicToggle = $("#musicToggle");
  let isPlaying = false;

  if (bgMusic && musicToggle) {
    bgMusic.volume = 0.3;

    bgMusic.play()
      .then(() => {
        isPlaying = true;
        musicToggle.textContent = "⏸";
      })
      .catch(() => {
        musicToggle.textContent = "▶";
      });

    musicToggle.addEventListener("click", () => {
      if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.textContent = "⏸";
        isPlaying = true;
      } else {
        bgMusic.pause();
        musicToggle.textContent = "▶";
        isPlaying = false;
      }
    });
  }

  /* ==================================================
     CONFETTI COLORS (CSS FALLBACK SAFE)
  ================================================== */
  const cssVars = getComputedStyle(document.documentElement);
  const CONFETTI_COLORS = [
    cssVars.getPropertyValue("--clr-secondary").trim() || "#9b779d",
    cssVars.getPropertyValue("--clr-accent").trim() || "#c9907c",
    cssVars.getPropertyValue("--clr-soft").trim() || "#f3e4e1"
  ];

  /* ==================================================
     HERO CONFETTI
  ================================================== */
  const confettiContainer = $("#confetti");

  function spawnConfetti(container) {
    if (!container) return;

    const piece = document.createElement("span");
    const size = rand(4, 10);

    piece.style.cssText = `
      position: absolute;
      left: ${rand(0, 100)}%;
      top: -10px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${pick(CONFETTI_COLORS)};
      opacity: ${rand(0.4, 0.9)};
      pointer-events: none;
    `;

    piece.animate(
      [
        { transform: "translateY(0) rotate(0deg)" },
        { transform: `translateY(110vh) rotate(${rand(180, 540)}deg)` }
      ],
      { duration: rand(4000, 6500), easing: "linear", fill: "forwards" }
    );

    container.appendChild(piece);
    setTimeout(() => piece.remove(), 7000);
  }

  if (confettiContainer) {
    setInterval(() => spawnConfetti(confettiContainer), 250);
  }

  /* ==================================================
     COUNTDOWN TIMER
  ================================================== */
  var targetDate = new Date("June 20, 2027 00:00:00").getTime();

function updateCountdown() {
    var now = new Date().getTime();
    var distance = targetDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("daysNumber").innerText = days > 0 ? days : 0;
    document.getElementById("hoursNumber").innerText = hours < 10 ? '0'+hours : hours;
    document.getElementById("minutesNumber").innerText = minutes < 10 ? '0'+minutes : minutes;
    document.getElementById("secondsNumber").innerText = seconds < 10 ? '0'+seconds : seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();


  /* ==================================================
     AOS INITIALIZATION
  ================================================== */
  if (window.AOS) {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic"
    });
  }

  /* ==================================================
     NAV SHADOW + SCROLL TO TOP
  ================================================== */
  const nav = $(".nav");
  const scrollTopBtn = $("#scrollTopBtn");

  window.addEventListener("scroll", () => {
    if (nav) {
      nav.style.boxShadow =
        window.scrollY > 30 ? "0 6px 20px rgba(0,0,0,0.25)" : "none";
    }

    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle("show", window.scrollY > 200);
    }
  });

  scrollTopBtn?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ==================================================
     RSVP CONFETTI
  ================================================== */
  function launchRSVPConfetti() {
    for (let i = 0; i < 35; i++) {
      const piece = document.createElement("span");
      const size = rand(6, 10);

      piece.style.cssText = `
        position: fixed;
        left: ${rand(0, 100)}vw;
        top: -10px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${pick(CONFETTI_COLORS)};
        z-index: 9999;
        pointer-events: none;
      `;

      piece.animate(
        [
          { transform: "translateY(0) rotate(0)", opacity: 1 },
          { transform: `translateY(300px) rotate(${rand(180, 720)}deg)`, opacity: 0 }
        ],
        { duration: 2200, easing: "ease-out", fill: "forwards" }
      );

      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 2300);
    }
  }

  /* ==================================================
     RSVP FORM SUBMISSION
  ================================================== */
  const rsvpForm = $(".rsvp-form");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = new URLSearchParams({
        name: rsvpForm.name.value,
        attendance: rsvpForm.attendance.value,
        message: rsvpForm.message.value
      });

      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbyMtejkOuP4GFjI2ubPV3DEmubOiLoxrASm7nWUBS6fZv5FRqd2RbMm217IZwoGPV-7/exec",
          { method: "POST", body: payload }
        );

        const result = await response.json();

        if (result.status === "success") {
          rsvpForm.reset();
          launchRSVPConfetti();
          alert("RSVP submitted! 💜");
        } else {
          alert("Submission failed. Please try again.");
        }
      } catch (err) {
        alert("Network error. Please try again later.");
      }
    });
  }

  /* ==================================================
     SETTINGS PANEL (BACKGROUND + MUSIC)
  ================================================== */
  const settingsToggle = $("#settingsToggle");
  const settingsPanel = $("#settingsPanel");
  const bgButtons = $$(".bg-options button");
  const musicSelector = $("#musicSelector");

  settingsToggle?.addEventListener("click", () => {
    settingsPanel.style.display =
      settingsPanel.style.display === "block" ? "none" : "block";
  });

  const applyBackground = (file) => {
    document.body.style.backgroundImage = `url("./assets/background/${file}")`;
    localStorage.setItem("bg", file);
  };

  bgButtons.forEach(btn => {
    btn.addEventListener("click", () => applyBackground(btn.dataset.bg));
  });

  const savedBg = localStorage.getItem("bg");
  if (savedBg) applyBackground(savedBg);

  musicSelector?.addEventListener("change", () => {
    bgMusic.src = musicSelector.value;
    bgMusic.play();
    musicToggle.textContent = "⏸";
    localStorage.setItem("track", musicSelector.value);
  });

  const savedTrack = localStorage.getItem("track");
  if (savedTrack) {
    bgMusic.src = savedTrack;
    bgMusic.play();
    musicToggle.textContent = "⏸";
  }

  /* ==================================================
   GOOGLE DRIVE GALLERY SYSTEM (HD VIEWER POPUP)
================================================== */

const folders = {
  church: "16BPBMPTwZwZgTI2tnNV1Tk1EKKB4wMyv",
  prenup: "1ZoSsPSECRq062Bx4KAhKQUtnj24ePRAn",
  reception: "1FqqNku0QNhGgWMJAiec6944SVjXeAZ4i"
};

const apiKey = "AIzaSyBgEstYNO3_dKI4mC1KdsPRpx_p2gpDsXQ";

const sectionMap = {
  church: "church-gallery",
  prenup: "prenup-gallery",
  reception: "reception-gallery"
};

const PHOTOS_PER_PAGE = 16;
const PLACEHOLDER =
  "https://via.placeholder.com/400x400/c0c0c0/ffffff?text=Upload+Here";

/* ================= FETCH FROM DRIVE ================= */
async function fetchImages(folderId) {
  const url =
    `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType contains 'image/'` +
    `&fields=files(id,name,thumbnailLink)&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.error("Drive fetch error:", err);
    return [];
  }
}

/* ================= PAGINATION ================= */
function paginate(files) {
  const pages = [];
  for (let i = 0; i < files.length; i += PHOTOS_PER_PAGE) {
    const slice = files.slice(i, i + PHOTOS_PER_PAGE);
    while (slice.length < PHOTOS_PER_PAGE) {
      slice.push({ name: "Placeholder", thumbnailLink: PLACEHOLDER });
    }
    pages.push(slice);
  }
  return pages;
}

/* ================= LOAD EACH GALLERY ================= */
async function loadGallery(key) {
  const wrapper = document.getElementById(sectionMap[key]);
  if (!wrapper) return;

  const pagination = document.getElementById(`${key}-pagination`);
  const prevBtn = pagination?.querySelector(".prev");
  const nextBtn = pagination?.querySelector(".next");
  const downloadBtn = pagination?.querySelector(".download");

  const files = await fetchImages(folders[key]);
  const pages = paginate(files);
  let currentPage = 0;

  function renderPage() {
    wrapper.innerHTML = "";

    pages[currentPage].forEach(file => {
      const fig = document.createElement("figure");
      fig.dataset.id = file.id || "";
      fig.dataset.name = file.name || "Photo";

	fig.innerHTML = `
  <img src="${file.thumbnailLink || PLACEHOLDER}" loading="lazy" alt="Wedding Photo">
`;


      wrapper.appendChild(fig);
    });
  }

  renderPage();

  /* ===== PREV BUTTON ===== */
  prevBtn?.addEventListener("click", () => {
    currentPage = (currentPage - 1 + pages.length) % pages.length;
    renderPage();
  });

  /* ===== NEXT BUTTON ===== */
  nextBtn?.addEventListener("click", () => {
    currentPage = (currentPage + 1) % pages.length;
    renderPage();
  });

}


/* ================= DRIVE HD POPUP (UPDATED SLIDE + CLOSE) ================= */
let currentGallery = [];
let currentIndex = 0;

// Open popup with current image and gallery array
function openDrivePreview(fileId, title, galleryArray) {
  currentGallery = galleryArray;
  currentIndex = galleryArray.findIndex(f => f.id === fileId);

  const popup = document.getElementById("drivePopup");
  const frame = document.getElementById("driveFrame");
  const caption = document.getElementById("driveCaption");

  frame.src = `https://drive.google.com/file/d/${fileId}/preview`;
  caption.textContent = title;
  popup.style.display = "flex";
}

// Close popup
function closeDrivePreview() {
  const popup = document.getElementById("drivePopup");
  const frame = document.getElementById("driveFrame");

  frame.src = "";
  popup.style.display = "none";
}

// Show next image
function showNext() {
  if (!currentGallery.length) return;
  currentIndex = (currentIndex + 1) % currentGallery.length;
  const next = currentGallery[currentIndex];
  document.getElementById("driveFrame").src = `https://drive.google.com/file/d/${next.id}/preview`;
  document.getElementById("driveCaption").textContent = next.name;
}

// Show previous image
function showPrev() {
  if (!currentGallery.length) return;
  currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  const prev = currentGallery[currentIndex];
  document.getElementById("driveFrame").src = `https://drive.google.com/file/d/${prev.id}/preview`;
  document.getElementById("driveCaption").textContent = prev.name;
}

/* ================= POPUP CLICK & KEYBOARD ================= */
const drivePopup = document.getElementById("drivePopup");
const driveClose = document.querySelector(".drive-close");
const driveNext = document.querySelector(".drive-next");
const drivePrev = document.querySelector(".drive-prev");

// Close button
driveClose?.addEventListener("click", closeDrivePreview);

// Prev/Next buttons
driveNext?.addEventListener("click", showNext);
drivePrev?.addEventListener("click", showPrev);

// Click outside iframe to close
drivePopup?.addEventListener("click", (e) => {
  if (e.target.id === "drivePopup") closeDrivePreview();
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (drivePopup.style.display === "flex") {
    if (e.key === "Escape") closeDrivePreview();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  }
});

/* ================= MODIFY GLOBAL CLICK TO PASS GALLERY ================= */
document.addEventListener("click", (e) => {
  const fig = e.target.closest(".gallery-wrapper figure");
  if (!fig) return;

  const galleryWrapper = fig.closest(".gallery-wrapper");
  const figures = Array.from(galleryWrapper.querySelectorAll("figure"));
  const galleryArray = figures.map(f => ({ id: f.dataset.id, name: f.dataset.name }));

  openDrivePreview(fig.dataset.id, fig.dataset.name, galleryArray);
});




const driveDownload = document.querySelector(".drive-download");

// Download current image
driveDownload?.addEventListener("click", () => {
  if (!currentGallery.length) return;
  const current = currentGallery[currentIndex];
  if (!current?.id) return;

  // Google Drive direct download URL
  const link = document.createElement("a");
  link.href = `https://drive.google.com/uc?export=download&id=${current.id}`;
  link.download = current.name || "photo";
  document.body.appendChild(link);
  link.click();
  link.remove();
});

/* ================= INIT ALL GALLERIES ================= */
Object.keys(folders).forEach(loadGallery);

});
// Show popup
function openDrivePopup() {
  const popup = document.querySelector('.drive-popup');
  popup.style.display = 'flex';
  document.body.classList.add('popup-open'); // locks scroll
}

// Hide popup
function closeDrivePopup() {
  const popup = document.querySelector('.drive-popup');
  popup.style.display = 'none';
  document.body.classList.remove('popup-open'); // restore scroll
}

// Example triggers
document.querySelector('.drive-close').addEventListener('click', closeDrivePopup);
