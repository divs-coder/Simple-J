
// SIMPLE J — ANIMATION ENGINE

document.addEventListener("DOMContentLoaded", () => {

  // Scroll reveal animations
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  // Hero video playback support
  const heroVideo = document.querySelector(".hero-video");

  if (heroVideo) {
    heroVideo.play().catch(() => {
      console.log("Hero video will play when browser allows it.");
    });
  }

  // Smooth navigation link movement
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });

  // Subtle pointer movement on product cards
  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  console.log("SIMPLE J animations loaded successfully.");

});
