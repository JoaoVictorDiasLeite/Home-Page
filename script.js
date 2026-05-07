/* ═══════════════════════════════════════
   EMAILJS — CONFIGURAÇÃO
   ═══════════════════════════════════════
   Substitua os valores abaixo pelos seus IDs do EmailJS
*/
const EMAILJS_PUBLIC_KEY  = "Ih3bfLDxFeFVYovUB";   // Account > API Keys
const EMAILJS_SERVICE_ID  = "service_hol28qr";   // Email Services > Service ID
const EMAILJS_TEMPLATE_ID = "template_t0qjije";  // Email Templates > Template ID

/* ═══════════════════════════════════════
   INICIALIZA EMAILJS
═══════════════════════════════════════ */
(function () {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
})();

/* ═══════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════ */
const cursor         = document.getElementById("cursor");
const cursorFollower = document.getElementById("cursorFollower");

if (cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + "px";
    cursorFollower.style.top  = followerY + "px";
    requestAnimationFrame(animateFollower);
  }
  animateFollower();
}

/* ═══════════════════════════════════════
   NAVBAR SCROLL
═══════════════════════════════════════ */
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  });
}

/* ═══════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════ */
const navBurger = document.getElementById("navBurger");
const navMobile = document.getElementById("navMobile");
if (navBurger && navMobile) {
  navBurger.addEventListener("click", () => {
    navMobile.classList.toggle("open");
  });
  navMobile.querySelectorAll(".nav-mobile-link").forEach((link) => {
    link.addEventListener("click", () => navMobile.classList.remove("open"));
  });
}

/* ═══════════════════════════════════════
   HERO CANVAS — PARTÍCULAS
═══════════════════════════════════════ */
const canvas = document.getElementById("heroCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.vx    = (Math.random() - 0.5) * 0.3;
      this.vy    = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.4 + 0.05;
      this.r     = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,200,255,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,200,255,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
}

/* ═══════════════════════════════════════
   TYPING EFFECT
═══════════════════════════════════════ */
const typingEl = document.getElementById("typingText");
if (typingEl) {
  const words   = ["Fullstack Developer", "UI/UX Designer", "Problem Solver", "Creative Coder"];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word    = words[wi];
    typingEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);

    if (!deleting && ci > word.length)  { deleting = true; setTimeout(type, 1400); return; }
    if (deleting  && ci < 0)            { deleting = false; wi = (wi + 1) % words.length; }

    setTimeout(type, deleting ? 55 : 95);
  }
  setTimeout(type, 600);
}

/* ═══════════════════════════════════════
   CONTADOR STATS
═══════════════════════════════════════ */
function animateCount(el) {
  const target = +el.dataset.target;
  let current  = 0;
  const step   = Math.ceil(target / 40);
  const timer  = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current;
  }, 40);
}

/* ═══════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════ */
const revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");
const observer  = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        const nums = entry.target.querySelectorAll(".stat-num");
        nums.forEach(animateCount);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

/* ═══════════════════════════════════════
   SKILL EXP — tempo decorrido
═══════════════════════════════════════ */
document.querySelectorAll(".skill-exp[data-start]").forEach((el) => {
  const start  = new Date(el.dataset.start);
  const now    = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());

  if (months < 1) {
    el.textContent = "< 1 mês";
  } else if (months < 12) {
    el.textContent = months === 1 ? "1 mês" : `${months} meses`;
  } else {
    const years     = Math.floor(months / 12);
    const remainder = months % 12;
    const yearStr   = years === 1 ? "1 ano" : `${years} anos`;
    const monthStr  = remainder === 0 ? "" : remainder === 1 ? " e 1 mês" : ` e ${remainder} meses`;
    el.textContent  = yearStr + monthStr;
  }
});

/* ═══════════════════════════════════════
   FORMULÁRIO DE CONTATO — EmailJS
═══════════════════════════════════════ */
const form = document.getElementById("contactForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nameEl    = document.getElementById("name");
    const emailEl   = document.getElementById("email");
    const subjectEl = document.getElementById("subject");
    const messageEl = document.getElementById("message");
    const btn       = form.querySelector(".btn-submit");

    // ── Validação básica ──
    const fields = [nameEl, emailEl, subjectEl, messageEl];
    let valid = true;

    fields.forEach((field) => {
      field.style.borderColor = "";
      if (!field.value.trim()) {
        field.style.borderColor = "rgba(240,89,240,0.7)";
        field.style.boxShadow   = "0 0 0 3px rgba(240,89,240,0.12)";
        valid = false;
      } else {
        field.style.boxShadow = "";
      }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailEl.value && !emailRegex.test(emailEl.value)) {
      emailEl.style.borderColor = "rgba(240,89,240,0.7)";
      emailEl.style.boxShadow   = "0 0 0 3px rgba(240,89,240,0.12)";
      valid = false;
    }

    if (!valid) {
      showToast("Preencha todos os campos corretamente.", "error");
      return;
    }

    // ── Estado de envio ──
    const originalHTML = btn.innerHTML;
    btn.disabled       = true;
    btn.innerHTML      = `<span>Enviando...</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
        <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
      </svg>`;

    const templateParams = {
      from_name:  nameEl.value.trim(),
      from_email: emailEl.value.trim(),
      subject:    subjectEl.value.trim(),
      message:    messageEl.value.trim(),
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      showToast("Mensagem enviada! Responderei em até 24h. 🚀", "success");
      form.reset();
      fields.forEach((f) => { f.style.borderColor = ""; f.style.boxShadow = ""; });
    } catch (err) {
      console.error("EmailJS error:", err);
      showToast("Erro ao enviar. Tente novamente ou me contate pelo e-mail.", "error");
    } finally {
      btn.disabled   = false;
      btn.innerHTML  = originalHTML;
    }
  });

  // Remove erro visual ao digitar
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      field.style.borderColor = "";
      field.style.boxShadow   = "";
    });
  });
}

/* ═══════════════════════════════════════
   TOAST NOTIFICATION
═══════════════════════════════════════ */
function showToast(message, type = "success") {
  // Remove toast anterior se existir
  document.querySelectorAll(".toast").forEach((t) => t.remove());

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✓" : "✕"}</span>
    <span>${message}</span>
  `;

  const style = toast.style;
  style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 22px;
    border-radius: 12px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    color: #fff;
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
    max-width: 380px;
    border: 1px solid;
    ${type === "success"
      ? "background: rgba(0,200,100,0.15); border-color: rgba(0,200,100,0.3);"
      : "background: rgba(240,89,240,0.15); border-color: rgba(240,89,240,0.3);"}
  `;

  const iconEl = toast.querySelector(".toast-icon");
  iconEl.style.cssText = `
    width: 24px; height: 24px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; flex-shrink: 0;
    ${type === "success"
      ? "background: rgba(0,200,100,0.25); color: #00c864;"
      : "background: rgba(240,89,240,0.25); color: #f059f0;"}
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = "translateY(0)";
      toast.style.opacity   = "1";
    });
  });

  setTimeout(() => {
    toast.style.transform = "translateY(20px)";
    toast.style.opacity   = "0";
    setTimeout(() => toast.remove(), 400);
  }, 5000);
}

/* ── animação do spin no botão ── */
const spinStyle = document.createElement("style");
spinStyle.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
document.head.appendChild(spinStyle);
