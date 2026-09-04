function setupEventsCanvas() {
  const canvas = document.getElementById("events-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const state = { width: 0, height: 0, scroll: 0 };
  const count = window.innerWidth < 760 ? 48 : 110;
  const particles = Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.5 + Math.random() * 1.7,
    speed: 0.08 + Math.random() * 0.22,
    alpha: 0.08 + Math.random() * 0.18
  }));

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.8);
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    canvas.width = Math.floor(state.width * ratio);
    canvas.height = Math.floor(state.height * ratio);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  let isActive = false;
  function checkActive() {
    const rect = canvas.getBoundingClientRect();
    isActive = rect.top < window.innerHeight && rect.bottom > 0;
  }
  
  window.addEventListener("scroll", checkActive, { passive: true });
  window.addEventListener("resize", () => { resize(); checkActive(); }, { passive: true });
  checkActive();

  function render(time) {
    if (isActive) {
      const t = time * 0.001;
      ctx.clearRect(0, 0, state.width, state.height);

      particles.forEach((particle) => {
        const x = particle.x * state.width + Math.sin(t * particle.speed + particle.y * 8) * 28;
        const y = ((particle.y * state.height + state.scroll * particle.speed * 0.12) % (state.height + 80)) - 40;
        ctx.fillStyle = `rgba(10, 110, 211,${particle.alpha})`;
        ctx.fillRect(x, y, particle.r, particle.r);
      });
    }

    requestAnimationFrame(render);
  }

  window.addEventListener("scroll", () => {
    state.scroll = window.scrollY;
  }, { passive: true });
  resize();
  requestAnimationFrame(render);
}

let isModalAnimating = false;

const eventData = [
  {
    id: "innovation-project",
    eventNumber: "01",
    name: "IdeaForge",
    tagline: "Forge the future.",
    moduleName: "INNOVATION ARENA",
    time: "11:30",
    coordinators: ["Mustafa", "Ibrahim"],
    description: "Showcase cutting-edge projects to industry experts and academia.",
    rules: ["Hardware and software projects allowed.", "Presentations limited to 10 minutes."],
    minMembers: 4,
    maxMembers: 4,
    participantsText: "4 MEMBERS",
    format: null
  },
  {
    id: "tech-quiz",
    eventNumber: "02",
    name: "MindMatrix",
    tagline: "Where knowledge meets logic.",
    moduleName: "MINDMATRIX",
    time: "11:30",
    coordinators: ["Shreya", "Anshu"],
    description: "Test your knowledge across multiple domains of computer science and technology.",
    rules: ["No mobile devices allowed.", "Judges' decision is final."],
    minMembers: 3,
    maxMembers: 3,
    participantsText: "3 MEMBERS",
    format: "3 ROUNDS"
  },
  {
    id: "cyber-awareness",
    eventNumber: "03",
    name: "CyberCanvas",
    tagline: "Visualize. Secure. Inspire.",
    moduleName: "CYBERCANVAS",
    time: "12:30",
    coordinators: ["Alefiya", "Zainab"],
    description: "Present innovative posters focusing on cybersecurity awareness and defense mechanisms.",
    rules: ["Follow presentation guidelines.", "Maintain cyber theme.", "Punctuality is strictly enforced."],
    minMembers: 2,
    maxMembers: 4,
    participantsText: "2 IS MINIMUM AND 4 IS MAXIMUM",
    format: null
  },
  {
    id: "code-hunt",
    eventNumber: "04",
    name: "Codebreak",
    tagline: "Crack it. Solve it. Conquer it.",
    moduleName: "CODE RUSH",
    time: "12:30",
    coordinators: ["Shabbir", "Rehan"],
    description: "Navigate algorithmic challenges in this intense competitive programming environment.",
    rules: [
      "Teams must follow the assigned starting module.",
      "Teams must visit only the module specified by the previous program's output.",
      "Teams must not access another team's code, computer, solution, or clues.",
      "Sharing answers or solutions between teams is prohibited.",
      "Tampering with the website, competition system, database, or other technical infrastructure is strictly prohibited.",
      "Unauthorized external assistance, including AI tools or direct solution searching, is not allowed unless explicitly permitted by the organizers.",
      "Teams must report technical issues immediately to the event coordinator.",
      "Any form of cheating, misconduct, or unfair practice may result in disqualification.",
      "Participants must maintain discipline and respect other teams, organizers, and volunteers."
    ],
    minMembers: 1,
    maxMembers: 1,
    participantsText: "INDIVIDUAL",
    format: null
  },
  {
    id: "techhunt",
    eventNumber: "05",
    name: "TechTrail",
    tagline: "Follow the clues. Find the tech.",
    moduleName: "TECH QUEST",
    time: "2:00",
    coordinators: ["Munira", "Tasneem"],
    description: "A campus-wide technical treasure hunt solving riddles and tracing data breadcrumbs.",
    rules: ["Teams must stay together.", "No property damage allowed."],
    minMembers: 3,
    maxMembers: 5,
    participantsText: "3 IS MINIMUM AND 5 IS MAXIMUM",
    format: null
  },
  {
    id: "freefire",
    eventNumber: "06",
    name: "Final Strike",
    tagline: "Only one team stands.",
    moduleName: "GAME ARENA",
    time: "3:00",
    coordinators: ["Meet", "Rohit"],
    description: "Tactical squad-based battle royale esports championship.",
    rules: [
      "Mobile Only: PC and Emulator players are not allowed.",
      "No Teaming: Teaming up with enemy squads is strictly banned. Both teams will be disqualified.",
      "Zero Tolerance for Hacks: Using any scripts, hacks, or map glitches will result in a permanent ban from the tournament.",
      "No Toxicity: Respect all players. No abusive language."
    ],
    minMembers: 4,
    maxMembers: 4,
    participantsText: "4 MEMBERS",
    format: null
  },
  {
    id: "trust-partner",
    eventNumber: "07",
    name: "Blind Sync",
    tagline: "Trust. Communicate. Execute.",
    moduleName: "TRUST WALK",
    time: "3:00",
    coordinators: ["Patel Mihir", "Ronaldo"],
    description: "Navigate a technical obstacle course relying completely on partner communications.",
    rules: ["Blindfolds must remain on.", "Only the navigator may speak."],
    minMembers: 2,
    maxMembers: 2,
    participantsText: "2 MEMBERS",
    format: null
  }
];

function generateEventHTML() {
  const container = document.getElementById("event-modules-container");
  if (!container) return;
  container.innerHTML = "";

  const positions = ["module-left", "module-right", "module-center"];
  const classes = ["module-a", "module-b", "module-c", "module-d", "module-e", "module-f"];

  eventData.forEach((event, index) => {
    const positionClass = positions[index % 3];
    const moduleClass = classes[index % 6];

    const article = document.createElement("article");
    article.className = `event-module ${positionClass} ${moduleClass}`;
    article.setAttribute("data-event-module", "");
    article.setAttribute("data-depth", index);
    article.setAttribute("data-event-id", event.id);

    article.innerHTML = `
      <div class="module-scan"></div>
      <div class="module-corners"></div>
      <p>MISSION // ${event.eventNumber}</p>
      <h3>${event.name}</h3>
      <span>EVENT MODULE</span>
      <dl>
        <div><dt>TIME</dt><dd>${event.time}</dd></div>
        <div class="coordinators-row"><dt>COORDINATORS</dt><dd>${event.coordinators.join(", ")}</dd></div>
      </dl>
    `;

    container.appendChild(article);
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function openEventDetails(eventId, clickedModule) {
  if (isModalAnimating) return;
  const event = eventData.find(e => e.id === eventId);
  if (!event) return;

  // Populate Details Data
  document.getElementById("detail-event-number").textContent = `EVENT // ${event.eventNumber}`;
  document.getElementById("detail-event-name").textContent = event.name;
  document.getElementById("detail-tagline").textContent = event.tagline || "";
  document.getElementById("detail-module-name").textContent = `CATEGORY // ${event.moduleName || "EVENT MODULE"}`;
  document.getElementById("detail-description").textContent = event.description;

  const rulesList = document.getElementById("detail-rules-list");
  rulesList.innerHTML = event.rules.map((rule, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHTML(rule)}</p></li>`).join('');

  document.getElementById("detail-time").textContent = event.time;
  document.getElementById("detail-team-size").textContent = event.participantsText;

  if (event.format) {
    document.getElementById("detail-format").textContent = event.format;
    document.getElementById("format-block").style.display = "block";
  } else {
    document.getElementById("format-block").style.display = "none";
  }

  const coordsList = document.getElementById("detail-coordinators-list");
  coordsList.innerHTML = event.coordinators.map(coord => `<li>${escapeHTML(coord)}</li>`).join('');



  const registerBtn = document.getElementById("detail-register-btn");
  registerBtn.setAttribute("data-event-id", event.id);
  registerBtn.href = "#";
  document.body.classList.add("modal-open");

  // GSAP Cinematic Transition
  const allModules = Array.from(document.querySelectorAll(".event-module"));
  const eventSection = document.querySelector(".events-section");
  const eventOverlay = document.getElementById("event-details");
  const paths = Array.from(document.querySelectorAll("[data-connection]"));

  if (!window.gsap) {
    eventOverlay.style.display = "flex";
    eventOverlay.style.opacity = "1";
    eventOverlay.style.visibility = "visible";
    eventOverlay.setAttribute("aria-hidden", "false");
    return;
  }

  isModalAnimating = true;
  const tl = gsap.timeline({ onComplete: () => isModalAnimating = false });

  // Fade out other modules and push them back
  const otherModules = allModules.filter(m => m !== clickedModule);
  if (otherModules.length > 0) {
    tl.to(otherModules, {
      opacity: 0,
      z: -400,
      duration: 0.6,
      ease: "power2.inOut"
    }, 0);
  }

  // Highlight connection path if it exists
  const clickedIndex = clickedModule.getAttribute("data-depth");
  const connectionPath = paths[clickedIndex];
  if (connectionPath) {
    tl.to(connectionPath, {
      stroke: "#0A6ED3",
      strokeWidth: 3,
      opacity: 1,
      duration: 0.4
    }, 0);
  }

  // Push camera into clicked module
  tl.to(clickedModule, {
    scale: 1.5,
    opacity: 0,
    duration: 0.8,
    ease: "power3.in"
  }, 0.2);

  tl.to(".events-pin", {
    scale: 1.2,
    duration: 0.8,
    ease: "power3.in"
  }, 0.2);

  // Show Details Overlay
  tl.set(eventOverlay, { display: "flex", autoAlpha: 0, attr: { "aria-hidden": "false" } }, 0.8);

  tl.to(eventOverlay, {
    autoAlpha: 1,
    duration: 0.6,
    ease: "power2.out"
  }, 0.9);

  // Staggered reveal of details content
  tl.fromTo(".details-header", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 1.1);
  tl.fromTo(".detail-section", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 1.2);
  tl.fromTo(".info-block", { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }, 1.3);
  tl.fromTo(".info-section", { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }, 1.4);
  tl.fromTo(".cta-container", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }, 1.5);
}

function closeEventDetails() {
  if (isModalAnimating) return;
  const eventOverlay = document.getElementById("event-details");
  const allModules = Array.from(document.querySelectorAll(".event-module"));
  const paths = Array.from(document.querySelectorAll("[data-connection]"));
  document.body.classList.remove("modal-open");
  if (!window.gsap) {
    eventOverlay.style.display = "none";
    eventOverlay.style.opacity = "0";
    eventOverlay.style.visibility = "hidden";
    eventOverlay.setAttribute("aria-hidden", "true");
    return;
  }

  isModalAnimating = true;
  const tl = gsap.timeline({ onComplete: () => isModalAnimating = false });

  tl.to(eventOverlay, {
    autoAlpha: 0,
    duration: 0.5,
    ease: "power2.in"
  }, 0);

  tl.set(eventOverlay, { display: "none", attr: { "aria-hidden": "true" } }, 0.5);

  tl.to(".events-pin", {
    scale: 1,
    duration: 0.8,
    ease: "power3.out"
  }, 0.4);

  tl.to(allModules, {
    scale: 1,
    opacity: 1,
    z: 0,
    duration: 0.8,
    ease: "power3.out"
  }, 0.4);

  if (paths.length > 0) {
    tl.to(paths, {
      stroke: "rgba(10, 110, 211, 0.62)",
      strokeWidth: 1.3,
      opacity: 0.72,
      duration: 0.8,
      ease: "power3.out"
    }, 0.4);
  }
}

function openRegistration(eventId) {
  if (isModalAnimating) return;
  const event = eventData.find(e => e.id === eventId);
  if (!event) return;
  const isFreeFire = event.id === "freefire";

  // Setup Form UI
  document.getElementById("reg-event-id").value = event.id;
  document.getElementById("reg-event-name").textContent = event.name;
  document.getElementById("reg-event-tagline").textContent = event.tagline || "";
  // DOM elements from .reg-meta have been removed per rules, so we no longer assign them here.

  // Generate Member Fields
  const membersContainer = document.getElementById("members-container");
  membersContainer.innerHTML = "";
  const form = document.getElementById("technot-registration-form");
  form.classList.toggle("is-freefire-form", isFreeFire);
  form.querySelector(".form-section legend").textContent = isFreeFire ? "TEAM DETAILS" : "TEAM INFORMATION";
  document.querySelector("#team-members-section legend").textContent = isFreeFire ? "PLAYER DETAILS" : "TEAM MEMBERS";
  document.querySelector('label[for="contact-phone"]').textContent = isFreeFire ? "TEAM LEADER CONTACT" : "PRIMARY CONTACT PHONE";
  document.getElementById("contact-phone").placeholder = isFreeFire ? "ENTER TEAM LEADER CONTACT" : "ENTER PHONE NUMBER";
  document.getElementById("contact-email").required = !isFreeFire;
  document.getElementById("department").closest(".input-group").hidden = isFreeFire;
  document.getElementById("contact-email").closest(".input-group").hidden = isFreeFire;

  
  const teamNameGroup = document.getElementById("team-name-group");
  const teamInfoLegend = document.getElementById("team-info-legend");
  
  // Hide Team Name natively if individual
  if (teamNameGroup) {
    if (event.maxMembers === 1) {
      teamNameGroup.style.display = "none";
      document.getElementById("team-name").required = false;
      if (teamInfoLegend) teamInfoLegend.style.display = "none";
    } else {
      teamNameGroup.style.display = "block";
      document.getElementById("team-name").required = true;
      if (teamInfoLegend) teamInfoLegend.style.display = "block";
    }
  }

  for (let i = 1; i <= event.maxMembers; i++) {
    const memberNum = i.toString().padStart(2, '0');
    const isRequired = (i <= event.minMembers) ? "required" : "";
    const memberLabel = (event.maxMembers === 1) ? "YOUR NAME" : `TEAM MEMBER ${memberNum} NAME`;
    const enrollmentLabel = (event.maxMembers === 1) ? "YOUR ENROLLMENT NUMBER" : `TEAM MEMBER ${memberNum} ENROLLMENT`;
    const requiredClass = isRequired ? "required" : "optional";
    const semesterHtml = (event.maxMembers === 1) ? `
          <div class="input-group">
            <label for="semester-${i}">SEMESTER</label>
            <div class="input-wrapper">
              <select id="semester-${i}" name="semester${i}" ${isRequired}>
                <option value="" disabled selected>SELECT SEMESTER</option>
                <option value="1">SEM 1</option>
                <option value="3">SEM 3</option>
                <option value="5">SEM 5</option>
              </select>
              <div class="input-corners"></div>
            </div>
          </div>` : "";

    if (isFreeFire) {
      membersContainer.innerHTML += `
        <div class="player-fieldset ${requiredClass}">
          <h4>PLAYER ${memberNum} ${!isRequired ? '(OPTIONAL)' : ''}</h4>
          <div class="input-group">
            <label for="player-ign-${i}">IN-GAME NAME (IGN)</label>
            <div class="input-wrapper">
              <input type="text" id="player-ign-${i}" name="player${i}Ign" placeholder="ENTER PLAYER IGN" ${isRequired}>
              <div class="input-corners"></div>
            </div>
          </div>
          <div class="input-group">
            <label for="player-uid-${i}">UID</label>
            <div class="input-wrapper">
              <input type="text" id="player-uid-${i}" name="player${i}Uid" placeholder="ENTER PLAYER UID" inputmode="numeric" ${isRequired}>
              <div class="input-corners"></div>
            </div>
          </div>
          </div>
        </div>
      `;
    } else {
      membersContainer.innerHTML += `
        <div class="player-fieldset ${requiredClass}">
          <div class="input-group">
            <label for="member-${i}">${memberLabel} ${!isRequired ? '(OPTIONAL)' : ''}</label>
            <div class="input-wrapper">
              <input type="text" id="member-${i}" name="member${i}" placeholder="ENTER NAME" ${isRequired}>
              <div class="input-corners"></div>
            </div>
          </div>
          <div class="input-group">
            <label for="enrollment-${i}">${enrollmentLabel}</label>
            <div class="input-wrapper">
              <input type="text" id="enrollment-${i}" name="enrollment${i}" placeholder="ENTER ENROLLMENT NO." ${isRequired}>
              <div class="input-corners"></div>
            </div>
          </div>
          </div>
${semesterHtml}
        </div>
      `;
    }
  }

  // Reset Form State
// Reset Form State
  form.reset();
  form.style.display = "block";
  form.style.opacity = "1";
  document.getElementById("submit-registration").disabled = false;
  document.getElementById("registration-success").style.display = "none";
  document.querySelector(".form-submit-wrapper .btn-text").textContent = "SUBMIT REGISTRATION";
  document.querySelector(".form-submit-wrapper .btn-text").style.color = "";
  document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
  document.querySelectorAll(".input-group").forEach(el => el.classList.remove("has-error"));

  // GSAP Transition
  const detailsOverlay = document.getElementById("event-details");
  const regOverlay = document.getElementById("registration-overlay");
  document.body.classList.add("modal-open");

  if (!window.gsap) {
    detailsOverlay.style.display = "none";
    regOverlay.style.display = "block";
    regOverlay.style.opacity = "1";
    regOverlay.style.visibility = "visible";
    detailsOverlay.setAttribute("aria-hidden", "true");
    regOverlay.setAttribute("aria-hidden", "false");
    return;
  }

  isModalAnimating = true;
  const tl = gsap.timeline({ onComplete: () => isModalAnimating = false });

  // Push details further back
  tl.to(detailsOverlay, {
    scale: 0.9,
    opacity: 0,
    duration: 0.6,
    ease: "power2.in"
  }, 0);

  tl.set(detailsOverlay, { display: "none", attr: { "aria-hidden": "true" } }, 0.6);

  tl.to(".events-pin", {
    scale: 1.6,
    duration: 1,
    ease: "power3.inOut"
  }, 0);

  // Bring in registration
  tl.set(regOverlay, { display: "block", autoAlpha: 0, scale: 1.1, attr: { "aria-hidden": "false" } }, 0.6);

  tl.to(regOverlay, {
    autoAlpha: 1,
    scale: 1,
    duration: 0.8,
    ease: "power3.out"
  }, 0.7);

  // Staggered reveal of form sections
  tl.fromTo(".registration-header", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 1.0);
  tl.fromTo(".form-section", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 1.2);
  tl.fromTo(".form-submit-wrapper", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }, 1.5);
}

function closeRegistration() {
  if (isModalAnimating) return;
  const detailsOverlay = document.getElementById("event-details");
  const regOverlay = document.getElementById("registration-overlay");
  const openedDirectly = document.body.dataset.registrationSource === "global";
  if (!window.gsap) {
    regOverlay.style.display = "none";
    regOverlay.setAttribute("aria-hidden", "true");
    if (openedDirectly) {
      document.body.classList.remove("modal-open");
      delete document.body.dataset.registrationSource;
    } else {
      detailsOverlay.style.display = "flex";
      detailsOverlay.setAttribute("aria-hidden", "false");
    }
    return;
  }

  isModalAnimating = true;
  const tl = gsap.timeline({ onComplete: () => isModalAnimating = false });

  tl.to(regOverlay, {
    autoAlpha: 0,
    scale: 1.1,
    duration: 0.5,
    ease: "power2.in"
  }, 0);

  tl.set(regOverlay, { display: "none", attr: { "aria-hidden": "true" } }, 0.5);

  tl.to(".events-pin", {
    scale: 1.2,
    duration: 0.8,
    ease: "power3.out"
  }, 0.4);

  if (openedDirectly) {
    tl.to(".events-pin", {
      scale: 1,
      duration: 0.45,
      ease: "power2.out"
    }, 0.5);
    tl.call(() => {
      document.body.classList.remove("modal-open");
      delete document.body.dataset.registrationSource;
    }, null, 0.62);
  } else {
    tl.set(detailsOverlay, { display: "flex", scale: 0.9, opacity: 0, attr: { "aria-hidden": "false" } }, 0.5);

    tl.to(detailsOverlay, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    }, 0.6);
  }
}

window.technotOpenDefaultRegistration = function technotOpenDefaultRegistration() {
  if (!eventData.length) return;
  document.body.dataset.registrationSource = "global";
  openRegistration(eventData[0].id);
};

function handleRegistrationSubmit(e) {
  e.preventDefault();
  const form = e.target;
  let isValid = true;
  const isFreeFire = document.getElementById("reg-event-id").value === "freefire";

  document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
  document.querySelectorAll(".input-group").forEach(el => el.classList.remove("has-error"));
  document.querySelector(".confirmation-section").classList.remove("has-error");

  // Basic Validation
  const inputs = form.querySelectorAll("input[required]");
  inputs.forEach(input => {
    if (!input.value.trim()) {
      if (input.type === "checkbox") {
        if (!input.checked) {
          const group = input.closest(".confirmation-section");
          group.classList.add("has-error");
          group.querySelector(".error-msg").textContent = "[!] CONFIRMATION REQUIRED";
          isValid = false;
        }
      } else {
        const group = input.closest(".input-group");
        group.classList.add("has-error");
        group.querySelector(".error-msg").textContent = "[!] FIELD REQUIRED";
        isValid = false;
      }
    }
  });

  const email = document.getElementById("contact-email");
  if (!isFreeFire && email.value.trim() && !/^\S+@\S+\.\S+$/.test(email.value)) {
    const group = email.closest(".input-group");
    group.classList.add("has-error");
    group.querySelector(".error-msg").textContent = "[!] INVALID EMAIL FORMAT";
    isValid = false;
  }

  const phone = document.getElementById("contact-phone");
  if (phone.value.trim() && !/^[0-9\-\+\s]{7,15}$/.test(phone.value)) {
    const group = phone.closest(".input-group");
    group.classList.add("has-error");
    group.querySelector(".error-msg").textContent = "[!] INVALID PHONE FORMAT";
    isValid = false;
  }

  if (!isValid) return;

  const registrationPayload = {
    eventId: document.getElementById("reg-event-id").value,
    teamName: document.getElementById("team-name").value.trim()
  };

  if (isFreeFire) {
    registrationPayload.teamLeaderContact = document.getElementById("contact-phone").value.trim();
    registrationPayload.players = Array.from(document.querySelectorAll(".player-fieldset")).map((group, index) => ({
      ign: group.querySelector(`[name="player${index + 1}Ign"]`).value.trim(),
      uid: group.querySelector(`[name="player${index + 1}Uid"]`).value.trim()
    }));
  }

  form.dataset.registrationPayload = JSON.stringify(registrationPayload);

  // Submission Simulation
  const btnText = document.querySelector(".form-submit-wrapper .btn-text");
  const submitBtn = document.getElementById("submit-registration");
  submitBtn.disabled = true;

  const tl = gsap.timeline();
  tl.to(btnText, { opacity: 0, duration: 0.2, onComplete: () => btnText.textContent = "PROCESSING..." })
    .to(btnText, { opacity: 1, duration: 0.2 })
    .to(btnText, { opacity: 0, duration: 0.2, delay: 0.8, onComplete: () => btnText.textContent = "VERIFYING DATA..." })
    .to(btnText, { opacity: 1, duration: 0.2 })
    .to(btnText, {
      opacity: 0, duration: 0.2, delay: 0.8, onComplete: () => {
        btnText.textContent = "REGISTRATION // ACCEPTED";
        document.getElementById("success-event").textContent = document.getElementById("reg-event-name").textContent;
        document.getElementById("success-team").textContent = document.getElementById("team-name").value;
        submitBtn.disabled = false;

        gsap.to(form, { opacity: 0, y: -20, duration: 0.5, onComplete: () => form.style.display = "none" });
        gsap.set("#registration-success", { display: "block", opacity: 0, scale: 0.95 });
        gsap.to("#registration-success", { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)", delay: 0.5 });
      }
    })
    .to(btnText, { opacity: 1, color: "#0A6ED3", duration: 0.2 });
}


function setupEventsSection() {
  if (document.documentElement.dataset.eventsReady === "true") return;
  document.documentElement.dataset.eventsReady = "true";
  setupEventsCanvas();

  generateEventHTML();

  const section = document.querySelector(".events-section");
  const modules = Array.from(document.querySelectorAll("[data-event-module]"));
  const paths = Array.from(document.querySelectorAll("[data-connection]"));
  if (!section || !modules.length) return;

  const setActiveBackground = () => {
    const rect = section.getBoundingClientRect();
    section.classList.toggle("is-active", rect.top < window.innerHeight * 0.88 && rect.bottom > 0);
  };

  window.addEventListener("scroll", setActiveBackground, { passive: true });
  setActiveBackground();

  // Setup close button listener once
  document.getElementById("close-details").addEventListener("click", closeEventDetails);

  document.getElementById("detail-register-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const eventId = e.currentTarget.getAttribute("data-event-id");
    delete document.body.dataset.registrationSource;
    openRegistration(eventId);
  });

  document.getElementById("close-registration").addEventListener("click", closeRegistration);
  document.getElementById("technot-registration-form").addEventListener("submit", handleRegistrationSubmit);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const registrationOpen = document.getElementById("registration-overlay").getAttribute("aria-hidden") === "false";
    const detailsOpen = document.getElementById("event-details").getAttribute("aria-hidden") === "false";
    if (registrationOpen) {
      closeRegistration();
    } else if (detailsOpen) {
      closeEventDetails();
    }
  });

  if (!window.gsap) {
    section.querySelector(".events-head").style.opacity = "1";
    modules.forEach((module) => {
      module.style.opacity = "1";
      module.style.transform = "none";
    });
    document.querySelector(".events-end").style.opacity = "1";
    return;
  }

  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  gsap.set(".events-head", { autoAlpha: 0, y: 34 });
  gsap.set(".events-end", { autoAlpha: 0, y: 20 });
  gsap.set(paths, { opacity: 0, strokeDashoffset: 900 });

  gsap.to(".events-head", {
    autoAlpha: 1,
    y: 0,
    duration: 1.1,
    ease: "power3.out",
    scrollTrigger: window.ScrollTrigger ? {
      trigger: ".events-section",
      start: "top 78%",
      toggleActions: "play none none reverse"
    } : undefined
  });

  modules.forEach((module, index) => {
    const fromLeft = index % 2 === 0;
    const path = paths[index];
    gsap.set(module, {
      x: fromLeft ? "-42vw" : "42vw",
      y: 38,
      rotationY: fromLeft ? -11 : 11,
      autoAlpha: 0,
      scale: 0.94
    });

    const tl = gsap.timeline({
      scrollTrigger: window.ScrollTrigger ? {
        trigger: module,
        start: "top 84%",
        toggleActions: "play none none reverse"
      } : undefined
    });

    tl.to(module, {
      x: 0,
      y: 0,
      rotationY: 0,
      autoAlpha: 1,
      scale: 1,
      duration: 1,
      ease: "power3.out"
    }, 0);

    if (path) {
      tl.to(path, {
        opacity: 0.72,
        strokeDashoffset: 0,
        duration: 0.9,
        ease: "power2.out"
      }, 0.12);
    }

    gsap.fromTo(module.querySelector(".module-scan"),
      { xPercent: -120, opacity: 0 },
      {
        xPercent: 120,
        opacity: 0.85,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: window.ScrollTrigger ? {
          trigger: module,
          start: "top 72%",
          toggleActions: "play none none reset"
        } : undefined
      }
    );

    module.addEventListener("pointerenter", () => {
      gsap.to(module, { y: -8, scale: 1.025, duration: 0.25, ease: "power2.out" });
      if (path) gsap.to(path, { opacity: 1, strokeWidth: 2.4, duration: 0.2 });
    });

    module.addEventListener("pointerleave", () => {
      gsap.to(module, { y: 0, scale: 1, duration: 0.25, ease: "power2.out" });
      if (path) gsap.to(path, { opacity: 0.72, strokeWidth: 1.3, duration: 0.2 });
    });

    module.addEventListener("click", () => {
      openEventDetails(module.getAttribute("data-event-id"), module);
    });
  });

  gsap.to(".events-end", {
    autoAlpha: 1,
    y: 0,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: window.ScrollTrigger ? {
      trigger: ".events-end",
      start: "top 86%",
      toggleActions: "play none none reverse"
    } : undefined
  });

  if (window.ScrollTrigger) {
    ScrollTrigger.refresh();
  }
}

let eventsInitialized = false;
function initEvents() {
  if (eventsInitialized) return;
  eventsInitialized = true;
  const startEvents = () => setupEventsSection();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("intro-complete")) {
    startEvents();
    return;
  }

  window.addEventListener("technot:intro-complete", () => {
    startEvents();
    if (window.ScrollTrigger) {
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }
  }, { once: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEvents);
} else {
  initEvents();
}
window.addEventListener("load", initEvents);
