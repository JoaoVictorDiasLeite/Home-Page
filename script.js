/* ═══════════════════════════════════════════════════════
   PORTFOLIO — SCRIPT.JS
   All animations, canvas, typing effect, scroll reveal
═══════════════════════════════════════════════════════ */

(() => {
  "use strict";

  /* ─────────────────────────────────────────────
     1. CUSTOM CURSOR
  ───────────────────────────────────────────── */
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  const animateFollower = () => {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + "px";
    follower.style.top = followerY + "px";
    requestAnimationFrame(animateFollower);
  };
  animateFollower();

  /* ─────────────────────────────────────────────
     2. NAVBAR SCROLL
  ───────────────────────────────────────────── */
  const navbar = document.getElementById("navbar");

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleNavScroll, { passive: true });

  /* ─────────────────────────────────────────────
     3. MOBILE MENU
  ───────────────────────────────────────────── */
  const burger = document.getElementById("navBurger");
  const navMobile = document.getElementById("navMobile");

  burger.addEventListener("click", () => {
    navMobile.classList.toggle("open");
  });

  document.querySelectorAll(".nav-mobile-link").forEach((link) => {
    link.addEventListener("click", () => navMobile.classList.remove("open"));
  });

  /* ─────────────────────────────────────────────
     4. SMOOTH SCROLL
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ─────────────────────────────────────────────
     5. HERO CANVAS — PARTICLES + CONNECTIONS
  ───────────────────────────────────────────── */
  const canvas = document.getElementById("heroCanvas");
  const ctx = canvas.getContext("2d");

  let W, H, particles = [];
  const PARTICLE_COUNT = 80;
  const CONNECTION_DIST = 140;

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };

  resize();
  window.addEventListener("resize", resize);

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() < 0.6 ? 195 : (Math.random() < 0.5 ? 280 : 170);
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 70%, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  const drawConnections = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
          const hue = (particles[i].hue + particles[j].hue) / 2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(${hue}, 80%, 65%, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  const animateCanvas = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateCanvas);
  };

  animateCanvas();

  /* ─────────────────────────────────────────────
     6. TYPING EFFECT
  ───────────────────────────────────────────── */
  const phrases = [
    "UI/UX Creator",
    "Frontend Engineer",
    "Backend Architect",
    "Problem Solver",
  ];

  const typingEl = document.getElementById("typingText");
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  const type = () => {
    const currentPhrase = phrases[phraseIndex];
    const displayed = isDeleting
      ? currentPhrase.substring(0, charIndex - 1)
      : currentPhrase.substring(0, charIndex + 1);

    typingEl.textContent = displayed;

    if (!isDeleting) {
      charIndex++;
      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        typingTimeout = setTimeout(type, 1800);
        return;
      }
    } else {
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingTimeout = setTimeout(type, 400);
        return;
      }
    }

    typingTimeout = setTimeout(type, isDeleting ? 45 : 80);
  };

  setTimeout(type, 800);

  /* ─────────────────────────────────────────────
     7. SCROLL REVEAL
  ───────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right"
  );

  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el) => revealObs.observe(el));

  /* ─────────────────────────────────────────────
     8. SKILL BAR ANIMATION
  ───────────────────────────────────────────── */
  const skillFills = document.querySelectorAll(".skill-fill");

  const skillObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pct = entry.target.dataset.pct;
          entry.target.style.width = pct + "%";
          skillObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillFills.forEach((el) => skillObs.observe(el));

  /* ─────────────────────────────────────────────
     9. COUNTER ANIMATION
  ───────────────────────────────────────────── */
  const counterEls = document.querySelectorAll(".stat-num");

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.round(current);
    }, 16);
  };

  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterEls.forEach((el) => counterObs.observe(el));

  /* ─────────────────────────────────────────────
     10. FORM SUBMIT
  ───────────────────────────────────────────── */
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector(".btn-submit");
      const originalHTML = btn.innerHTML;
      btn.innerHTML = `<span>Mensagem enviada!</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
      btn.style.background = "linear-gradient(135deg, #00ffe0, #00c8ff)";
      btn.style.color = "#000";
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = "";
        btn.style.color = "";
        form.reset();
      }, 3000);
    });
  }

  /* ─────────────────────────────────────────────
     11. PROJECT CARD 3D TILT
  ───────────────────────────────────────────── */
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ─────────────────────────────────────────────
     12. GLASS CARD TILT (Timeline)
  ───────────────────────────────────────────── */
  document.querySelectorAll(".glass-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const pctX = x / rect.width;
      const pctY = y / rect.height;
      card.style.background = `radial-gradient(circle at ${pctX * 100}% ${pctY * 100}%, rgba(0,200,255,0.04), rgba(255,255,255,0.01) 60%)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.background = "";
    });
  });

  /* ─────────────────────────────────────────────
     13. ACTIVE NAV LINK ON SCROLL
  ───────────────────────────────────────────── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const highlightNav = () => {
    let current = "";
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 120) {
        current = s.id;
      }
    });

    navLinks.forEach((link) => {
      link.style.color = "";
      if (link.getAttribute("href") === `#${current}`) {
        link.style.color = "var(--neon-cyan)";
      }
    });
  };

  window.addEventListener("scroll", highlightNav, { passive: true });

  /* ─────────────────────────────────────────────
     14. INPUT LABEL EFFECT
  ───────────────────────────────────────────── */
  document.querySelectorAll(".form-group input, .form-group textarea").forEach((input) => {
    input.addEventListener("focus", () => {
      const label = input.previousElementSibling;
      if (label && label.tagName === "LABEL") {
        label.style.color = "var(--neon-blue)";
      }
    });
    input.addEventListener("blur", () => {
      const label = input.previousElementSibling;
      if (label && label.tagName === "LABEL") {
        label.style.color = "";
      }
    });
  });

  /* ─────────────────────────────────────────────
     15. HERO ENTRANCE — stagger
  ───────────────────────────────────────────── */
  window.addEventListener("load", () => {
    const heroItems = document.querySelectorAll(".hero .reveal-up, .hero .reveal-right");
    heroItems.forEach((el, i) => {
      setTimeout(() => el.classList.add("revealed"), i * 120 + 100);
    });
  });
function calculateMonths(startDate){

  const start = new Date(startDate)
  const now = new Date()

  let months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth())

  return months <= 0 ? 1 : months
}

document.querySelectorAll(".skill-exp").forEach((el)=>{

  const startDate = el.dataset.start

  const months = calculateMonths(startDate)

  el.innerText = `${months} meses`
})
})();
