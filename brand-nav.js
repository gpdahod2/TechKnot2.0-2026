document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".site-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const navLinks = Array.from(document.querySelectorAll("[data-nav-target]"));
  const registerButtons = Array.from(document.querySelectorAll("[data-open-registration]"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector(".hero-placeholder");

  function closeMenu() {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  }

  function scrollToSection(targetName) {
    const target = targetName === "home" ? document.querySelector(".hero-placeholder") : document.getElementById(targetName);
    if (!target) return;
    closeMenu();
    const headerHeight = header ? header.offsetHeight : 80;
    const headerOffset = headerHeight + 10;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(0, top), behavior: reducedMotion ? "auto" : "smooth" });
  }

  function isInHero() {
    if (!hero) return true;
    const rect = hero.getBoundingClientRect();
    return rect.top <= 0 && rect.bottom >= window.innerHeight;
  }

  function setActiveNav() {
    if (!header) return;

    const scrolled = window.scrollY > 24;
    const atHero = hero && isInHero();

    header.classList.toggle("is-sticky", scrolled && !atHero);
    header.classList.toggle("is-scrolled", scrolled && atHero);

    const events = document.getElementById("events");
    const inEvents = events && events.getBoundingClientRect().top < window.innerHeight * 0.45;

    navLinks.forEach((link) => {
      const target = link.dataset.navTarget;
      link.classList.toggle("is-active", inEvents ? target === "events" : target === "home");
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetName = link.dataset.navTarget;
      if (!targetName) return;
      event.preventDefault();
      scrollToSection(targetName);
    });
  });

  registerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      closeMenu();
      if (typeof window.technotOpenDefaultRegistration === "function") {
        window.technotOpenDefaultRegistration();
      } else {
        scrollToSection("events");
      }
    });
  });

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
      mobileMenu.setAttribute("aria-hidden", String(isOpen));
      document.body.classList.toggle("menu-open", !isOpen);
    });
  }

  let scrollRafPending = false;
  function onScroll() {
    if (scrollRafPending) return;
    scrollRafPending = true;
    requestAnimationFrame(() => {
      scrollRafPending = false;
      setActiveNav();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("technot:intro-complete", () => root.classList.add("brand-nav-ready"), { once: true });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  if (root.classList.contains("intro-complete")) root.classList.add("brand-nav-ready");
  setActiveNav();
});