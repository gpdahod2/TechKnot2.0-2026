document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const hero = document.querySelector(".hero-placeholder");
  if (!hero) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let played = false;
  let parallaxActive = !reducedMotion;
  let ambientTween = null;
  const video = hero.querySelector(".hero-human-video");

  if (video) {
    video.addEventListener("error", () => {
      hero.classList.add("hero-video-fallback");
    });
  }

  function startVideo() {
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    const promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {
        hero.classList.add("hero-video-fallback");
      });
    }
  }

  function setHeroReady() {
    hero.classList.add("hero-ready");
    const content = hero.querySelector(".hero-content");
    if (content) {
      content.style.opacity = "";
      content.style.transform = "";
    }
  }

  function playFallback() {
    setHeroReady();
    startVideo();
    hero.querySelectorAll("[data-hero-item], .hero-version, .hero-network, .hero-date-module, .hero-video-stage, .hero-rule, .title-sweep").forEach((item) => {
      item.style.opacity = "1";
    });
    const mask = hero.querySelector(".title-mask");
    if (mask) mask.style.clipPath = "inset(0 0 0 0)";
  }

  function playHeroIntro() {
    if (played) return;
    played = true;
    setHeroReady();
    startVideo();

    if (!window.gsap || reducedMotion) {
      playFallback();
      return;
    }

    const titleWord = hero.querySelector(".hero-title-word");
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set(".hero-network", { opacity: 0, scale: 1.02 });
    gsap.set(".hero-video-stage", { opacity: 0, x: 26, scale: 0.98 });
    gsap.set(".hero-giant-version", { opacity: 0, x: 44, y: 18 });
    gsap.set(".title-mask", { clipPath: "inset(0 100% 0 0)" });
    gsap.set(titleWord, { x: -24, y: 34, scale: 0.985, filter: "drop-shadow(0 0 0 rgba(10, 110, 211,0))" });
    gsap.set(".hero-version", { opacity: 0, x: 42, y: -12 });
    gsap.set(".hero-rule-main", { opacity: 0, scaleX: 0, transformOrigin: "left center" });
    gsap.set(".hero-rule-sub", { opacity: 0, scaleX: 0, transformOrigin: "right center" });
    gsap.set(".title-sweep", { opacity: 0, xPercent: -120 });
    gsap.set(".hero-kicker, .hero-tagline, .hero-date-module, .hero-actions, .hero-hud", { opacity: 0, y: 16 });

    tl.to(".hero-network", { opacity: 0.86, scale: 1, duration: 0.32 }, 0)
      .to(".hero-video-stage", { opacity: 1, x: 0, scale: 1, duration: 0.72, ease: "power2.out" }, 0.2)
      .to(".hero-giant-version", { opacity: 1, x: 0, y: 0, duration: 0.7 }, 0.08)
      .to(".hero-hud", { opacity: 0.74, y: 0, duration: 0.44, stagger: 0.08 }, 0.15)
      .to(".hero-rule-main", { opacity: 1, scaleX: 1, duration: 0.78, ease: "power2.inOut" }, 0.22)
      .to(".title-mask", { clipPath: "inset(0 0% 0 0)", duration: 0.86, ease: "power4.inOut" }, 0.34)
      .to(titleWord, { x: 0, y: 0, scale: 1.018, duration: 0.72, filter: "drop-shadow(0 0 13px rgba(10, 110, 211,0.3))" }, 0.34)
      .to(titleWord, { x: 3, duration: 0.04, ease: "steps(1)" }, 0.88)
      .to(titleWord, { x: -2, duration: 0.04, ease: "steps(1)" }, 0.94)
      .to(titleWord, { x: 0, scale: 1, duration: 0.42, ease: "back.out(1.25)" }, 1.02)
      .to(".hero-version", { opacity: 1, x: 0, y: 0, duration: 0.58, ease: "power3.out" }, 0.78)
      .to(".title-sweep", { opacity: 0.7, xPercent: 120, duration: 0.55, ease: "power2.inOut" }, 1.02)
      .to(".title-sweep", { opacity: 0, duration: 0.18 }, 1.55)
      .to(".hero-tagline", { opacity: 1, y: 0, duration: 0.48 }, 1.32)
      .to(".hero-date-module", { opacity: 1, y: 0, duration: 0.46 }, 1.52)
      .to(".hero-actions", { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.35)" }, 1.82)
      .to(".hero-rule-sub", { opacity: 0.76, scaleX: 1, duration: 0.42, ease: "power2.out" }, 1.92)
      .to(".hero-kicker", { opacity: 0.78, y: 0, duration: 0.34 }, 0.7);

    ambientTween = gsap.to(".hero-content", {
      y: -7,
      duration: 4.6,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 2.35
    });

    gsap.to(".hero-giant-version", {
      y: -14,
      duration: 6.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 2.15
    });

    gsap.to(".hero-video-glow", {
      opacity: 0.78,
      duration: 5.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 2.4
    });
  }

  function setupParallax() {
    if (!window.gsap || reducedMotion) return;

    const layers = Array.from(hero.querySelectorAll("[data-parallax]"));
    const setters = layers.map((layer) => ({
      layer,
      depth: Number(layer.dataset.parallax || 0.25),
      x: gsap.quickTo(layer, "x", { duration: 0.55, ease: "power3.out" }),
      y: gsap.quickTo(layer, "y", { duration: 0.55, ease: "power3.out" })
    }));

    function move(event) {
      if (!parallaxActive || window.innerWidth < 820) return;
      const px = (event.clientX / window.innerWidth - 0.5) * 2;
      const py = (event.clientY / window.innerHeight - 0.5) * 2;
      setters.forEach(({ depth, x, y }) => {
        x(px * depth * 18);
        y(py * depth * 12);
      });
    }

    function reset() {
      setters.forEach(({ x, y }) => {
        x(0);
        y(0);
      });
    }

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
  }

  document.addEventListener("visibilitychange", () => {
    parallaxActive = !document.hidden && !reducedMotion;
    if (ambientTween) ambientTween.paused(document.hidden);
    if (!video) return;
    if (document.hidden) {
      video.pause();
    } else if (played) {
      startVideo();
    }
  });

  window.addEventListener("technot:intro-complete", playHeroIntro, { once: true });
  setupParallax();

  if (root.classList.contains("intro-complete")) {
    window.requestAnimationFrame(playHeroIntro);
  }
});
