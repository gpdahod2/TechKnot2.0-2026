document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("cinematic-intro-overlay");
  if (!overlay) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.getElementById("cinematic-particles");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const state = {
    width: 0,
    height: 0,
    ratio: 1,
    pull: 0,
    rush: 0,
    glow: 0,
    running: true,
    raf: 0
  };

  let particles = [];
  let completed = false;
  let timeline = null;

  const finishIntro = () => {
    if (completed) return;
    completed = true;
    state.running = false;
    if (state.raf) cancelAnimationFrame(state.raf);
    window.removeEventListener("resize", resizeParticles);
    if (timeline) timeline.kill();
    if (overlay.parentNode) overlay.remove();

    if (typeof window.technotCompleteIntro === "function") {
      window.technotCompleteIntro();
      return;
    }

    document.documentElement.classList.add("intro-complete");
    window.dispatchEvent(new CustomEvent("technot:intro-complete"));
  };

  const safetyTimeout = window.setTimeout(finishIntro, reducedMotion ? 4800 : 14000);

  function resizeParticles() {
    if (!canvas || !ctx) return;
    state.ratio = Math.min(window.devicePixelRatio || 1, 1.7);
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    canvas.width = Math.floor(state.width * state.ratio);
    canvas.height = Math.floor(state.height * state.ratio);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    ctx.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);

    const count = reducedMotion ? 36 : window.innerWidth < 720 ? 76 : 132;
    particles = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.14 + Math.random() * 0.86;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 0.22 + Math.random() * 1.1,
        speed: 0.0012 + Math.random() * 0.0036,
        size: 0.7 + Math.random() * 1.8,
        alpha: 0.09 + Math.random() * 0.34,
        bright: Math.random() > 0.86
      };
    });
  }

  function drawParticles(time) {
    if (!state.running || !ctx) return;
    const t = time * 0.001;
    const cx = state.width * 0.5;
    const cy = state.height * 0.49;
    ctx.clearRect(0, 0, state.width, state.height);

    // --- Pass 1: dim (non-bright) particles — no shadow, fast ---
    particles.forEach((particle, index) => {
      const centerPull = state.pull * (0.006 + particle.speed);
      particle.x += -particle.x * centerPull;
      particle.y += -particle.y * centerPull;
      particle.z -= state.rush * (0.011 + particle.speed);

      if (particle.z < 0.08 || Math.abs(particle.x) < 0.006 && Math.abs(particle.y) < 0.006) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.78 + Math.random() * 0.46;
        particle.x = Math.cos(angle) * radius;
        particle.y = Math.sin(angle) * radius;
        particle.z = 0.8 + Math.random() * 0.62;
      }

      const depth = Math.max(0.12, particle.z);
      const spread = Math.min(state.width, state.height) * (0.48 + state.rush * 0.24);
      const orbit = Math.sin(t * 0.72 + index) * 0.018 * state.glow;
      particle._px = cx + ((particle.x + orbit) * spread) / depth;
      particle._py = cy + ((particle.y - orbit) * spread) / depth;
      particle._alpha = particle.alpha * (0.25 + state.pull * 0.5 + state.glow * 0.55) * (particle.bright ? 1.35 : 1);
      particle._len = 1 + state.rush * 20;

      if (!particle.bright) {
        ctx.fillStyle = `rgba(10, 110, 211,${particle._alpha})`;
        ctx.fillRect(particle._px, particle._py, particle.size + particle._len, particle.size);
      }
    });

    // --- Pass 2: bright particles — one shared shadow state ---
    if (state.glow > 0.04) {
      ctx.shadowColor = "rgba(234,247,255,0.86)";
      ctx.shadowBlur = 12 * state.glow;
      particles.forEach((particle) => {
        if (!particle.bright) return;
        ctx.fillStyle = `rgba(234,247,255,${particle._alpha})`;
        ctx.fillRect(particle._px, particle._py, particle.size + particle._len, particle.size);
      });
      ctx.shadowBlur = 0;
    }

    // --- Pass 3: orbital ring lines ---
    if (state.glow > 0.08) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(10, 110, 211,${0.12 * state.glow})`;
      ctx.lineWidth = 1;
      for (let i = 0; i < 18; i += 1) {
        const a = (Math.PI * 2 * i) / 18 + t * 0.08;
        const r = Math.min(state.width, state.height) * (0.12 + (i % 3) * 0.038);
        ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
        ctx.lineTo(cx + Math.cos(a + 0.32) * (r + 22), cy + Math.sin(a + 0.32) * (r + 22));
      }
      ctx.stroke();
    }

    state.raf = requestAnimationFrame(drawParticles);
  }

  function startParticles() {
    if (!canvas || !ctx) return;
    resizeParticles();
    window.addEventListener("resize", resizeParticles);
    state.raf = requestAnimationFrame(drawParticles);
  }

  function reducedMotionIntro() {
    if (typeof gsap === "undefined") {
      window.setTimeout(finishIntro, 3600);
      return;
    }

    timeline = gsap.timeline({
      onComplete: () => {
        clearTimeout(safetyTimeout);
        finishIntro();
      }
    });

    timeline
      .to(".cinematic-intro-bg", { opacity: 1, duration: 0.35, ease: "power2.out" }, 0)
      .set(".cinematic-logo-wrapper", { opacity: 1 }, 0.12)
      .to(".cinematic-logo-img", { opacity: 0.96, clipPath: "circle(68% at 50% 50%)", filter: "brightness(1.05) saturate(1.08)", duration: 0.5 }, 0.12)
      .to(".core-status", { opacity: 1, duration: 0.28 }, 0.55)
      .to(".cinematic-logo-wrapper, .core-status", { opacity: 0, duration: 0.32, ease: "power2.inOut" }, 1.05)
      .to(".cinematic-wordmark-img", { opacity: 0.92, y: 0, scale: 1, filter: "brightness(0.95) saturate(1.1)", duration: 0.45 }, 1.32)
      .to("#cinematic-intro-overlay", { opacity: 0, duration: 0.45, ease: "power2.inOut" }, 3.35);
  }

  function fallbackIntro() {
    window.setTimeout(() => {
      overlay.style.transition = "opacity 520ms ease";
      overlay.style.opacity = "0";
      window.setTimeout(finishIntro, 540);
    }, 5200);
  }

  function initIntro() {
    startParticles();

    if (reducedMotion) {
      reducedMotionIntro();
      return;
    }

    if (typeof gsap === "undefined") {
      fallbackIntro();
      return;
    }

    gsap.set(".cinematic-logo-wrapper", { scale: 0.92, rotation: -2 });
    gsap.set(".cinematic-ring", { scale: 0.46, rotation: -18 });
    gsap.set(".energy-tunnel span", { scaleX: 0.15, opacity: 0 });

    timeline = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        clearTimeout(safetyTimeout);
        finishIntro();
      }
    });

    timeline
      .to(".cinematic-intro-bg", { opacity: 1, duration: 0.75, ease: "power2.out" }, 0.12)
      .to(".cinematic-particles", { opacity: 1, duration: 0.9, ease: "sine.out" }, 0.35)
      .to(state, { pull: 0.28, glow: 0.28, duration: 0.9, ease: "sine.inOut" }, 0.8)
      .to(".intro-scanlines", { opacity: 0.34, duration: 0.7, ease: "power2.out" }, 0.85)
      .to(".intro-hud", { opacity: 0.74, y: 0, duration: 0.18, stagger: 0.16, ease: "steps(2)" }, 0.92)
      .to(".intro-hud", { opacity: 0.22, duration: 0.26, stagger: 0.08, repeat: 1, yoyo: true, ease: "steps(2)" }, 1.38)

      .to(state, { pull: 0.86, glow: 0.62, duration: 0.9, ease: "power2.inOut" }, 1.72)
      .to(".core-outline", { opacity: 0.78, scale: 1.18, duration: 0.48, ease: "power3.out" }, 2.42)
      .to(".cinematic-logo-wrapper", { opacity: 1, scale: 1, rotation: 0, duration: 0.46, ease: "power3.out" }, 2.55)
      .to(".cinematic-logo-img", { opacity: 0.42, clipPath: "circle(32% at 50% 50%)", duration: 0.34, ease: "power2.out" }, 2.6)
      .to(".core-scan", { opacity: 0.92, y: "420%", duration: 0.72, ease: "power1.inOut" }, 2.64)
      .to(".cinematic-logo-img", { opacity: 0.72, clipPath: "circle(48% at 50% 50%)", duration: 0.38, ease: "power2.out" }, 2.96)
      .to(".cinematic-logo-img", { opacity: 0.98, clipPath: "circle(70% at 50% 50%)", filter: "brightness(1.08) saturate(1.12) contrast(1.08) drop-shadow(0 0 12px rgba(10, 110, 211,0.32))", duration: 0.5, ease: "power3.out" }, 3.26)
      .to(".core-scan", { opacity: 0, duration: 0.2, ease: "power2.out" }, 3.38)

      .to(".cinematic-glow-layer", { opacity: 0.78, scale: 1.06, duration: 0.72, ease: "sine.inOut" }, 3.48)
      .to(".cinematic-bloom-layer", { opacity: 0.45, scale: 1.08, duration: 0.86, ease: "sine.inOut" }, 3.52)
      .to(".cinematic-ring", { opacity: 0.72, scale: 1, rotation: 0, duration: 0.72, stagger: 0.07, ease: "power3.out" }, 3.55)
      .to(".ring-two", { rotation: 24, duration: 1.1, ease: "sine.inOut" }, 3.82)
      .to(".ring-three", { rotation: -32, duration: 1.1, ease: "sine.inOut" }, 3.82)
      .to(state, { glow: 1, pull: 0.94, duration: 0.85, ease: "sine.inOut" }, 3.75)

      .to(".core-status", { opacity: 1, y: -2, duration: 0.38, ease: "power2.out" }, 4.58)
      .to(".cinematic-logo-img", { scale: 1.045, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.out" }, 4.78)
      .to(".cinematic-bloom-layer", { opacity: 0.78, scale: 1.18, duration: 0.24, yoyo: true, repeat: 1, ease: "power2.out" }, 4.8)

      .to(".intro-hud", { opacity: 0.16, duration: 0.5, ease: "power2.out" }, 5.45)
      .to(".cinematic-logo-wrapper", { scale: 1.04, duration: 0.58, ease: "sine.inOut" }, 5.82)

      .to(".cinematic-logo-wrapper", { scale: 1.24, duration: 0.46, ease: "power2.inOut" }, 6.24)
      .to(".core-status", { opacity: 0, y: -12, duration: 0.3, ease: "power2.in" }, 6.42)
      .to(".cinematic-logo-wrapper", { scale: 6.2, duration: 0.78, ease: "expo.in" }, 6.52)
      .to(state, { rush: 1, glow: 1.1, duration: 0.72, ease: "power3.in" }, 6.52)
      .to(".energy-tunnel", { opacity: 1, duration: 0.18, ease: "power2.out" }, 6.75)
      .to(".energy-tunnel span", { opacity: 0.9, scaleX: 1.85, duration: 0.46, stagger: 0.018, ease: "power3.in" }, 6.8)
      .to(".cinematic-logo-wrapper", { opacity: 0, duration: 0.18, ease: "power2.in" }, 7.14)
      .to(".intro-flash", { opacity: 0.78, duration: 0.16, ease: "power2.out" }, 7.24)
      .to(".energy-tunnel span", { opacity: 0, scaleX: 0.35, duration: 0.34, ease: "power2.out" }, 7.34)
      .to(".cinematic-wordmark-img", { opacity: 0.96, y: 0, scale: 1, filter: "brightness(1.08) saturate(1.14) drop-shadow(0 0 18px rgba(10, 110, 211,0.3))", duration: 0.62, ease: "power3.out" }, 7.42)
      .to(".intro-flash", { opacity: 0, duration: 0.42, ease: "power2.out" }, 7.48)
      .to(".cinematic-wordmark-img", { scale: 1.035, filter: "brightness(1.22) saturate(1.2) drop-shadow(0 0 26px rgba(10, 110, 211,0.42))", duration: 0.28, yoyo: true, repeat: 1, ease: "power2.out" }, 8.12)
      .to(".cinematic-wordmark-img", { opacity: 0, scale: 1.14, duration: 0.42, ease: "power2.inOut" }, 8.48)
      .to(".cinematic-intro-bg", { opacity: 0, duration: 0.45, ease: "power2.inOut" }, 8.54)
      .to("#cinematic-intro-overlay", { opacity: 0, duration: 0.36, ease: "power2.inOut" }, 8.66);

    timeline.timeScale(0.78);
  }

  initIntro();
});
