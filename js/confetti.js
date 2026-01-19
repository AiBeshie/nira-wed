const confettiContainer = document.getElementById('confetti');

function createConfetti() {
  const confetti = document.createElement('div');
  confetti.classList.add('confetti');
  confetti.style.left = Math.random() * 100 + '%';
  confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
  confetti.style.width = Math.random() * 8 + 4 + 'px';
  confetti.style.height = confetti.style.width;
  confetti.style.opacity = Math.random() + 0.3;
  confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
  confettiContainer.appendChild(confetti);

  setTimeout(() => confetti.remove(), 5000);
}

// Generate confetti every 200ms
setInterval(createConfetti, 200);
