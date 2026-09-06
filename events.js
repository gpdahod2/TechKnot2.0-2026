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
  let rafId = 0;

  function render(time) {
    if (!isActive) {
      rafId = 0;
      return; // stop loop when off-screen
    }
    const t = time * 0.001;
    ctx.clearRect(0, 0, state.width, state.height);

    particles.forEach((particle) => {
      const x = particle.x * state.width + Math.sin(t * particle.speed + particle.y * 8) * 28;
      const y = ((particle.y * state.height + state.scroll * particle.speed * 0.12) % (state.height + 80)) - 40;
      ctx.fillStyle = `rgba(10, 110, 211,${particle.alpha})`;
      ctx.fillRect(x, y, particle.r, particle.r);
    });

    rafId = requestAnimationFrame(render);
  }

  function startLoop() {
    if (!rafId && isActive) {
      rafId = requestAnimationFrame(render);
    }
  }

  function checkActive() {
    const rect = canvas.getBoundingClientRect();
    const wasActive = isActive;
    isActive = !document.hidden && rect.top < window.innerHeight && rect.bottom > 0;
    if (isActive && !wasActive) startLoop();
  }

  window.addEventListener("scroll", (e) => {
    state.scroll = window.scrollY;
    checkActive();
  }, { passive: true });

  window.addEventListener("resize", () => { resize(); checkActive(); }, { passive: true });
  document.addEventListener("visibilitychange", checkActive);

  resize();
  checkActive();
  startLoop();
}

let isModalAnimating = false;

const eventData = [
  {
    id: "innovation-project",
    eventNumber: "01",
    name: "IdeaForge",
    tagline: "Forge the future.",
    moduleName: "INNOVATION ARENA",
    time: "11:30 AM",
    venue: "Main Seminar Hall",
    duration: "2 Hours",
    coordinators: ["Mustafa", "Ibrahim"],
    description: "Showcase cutting-edge hardware and software projects to a panel of industry experts and academic judges. IdeaForge challenges teams to present innovative, working solutions that address real-world problems — from prototypes to fully functional systems.",
    rules: [
      "Both hardware and software projects are permitted.",
      "Each team gets a maximum of 10 minutes for presentation, followed by a 5-minute Q&A session.",
      "Plagiarism or copying from existing open-source projects without significant modification is strictly prohibited.",
      "Judges' evaluation and scoring are final and binding.",
      "Teams must set up their projects within the designated time before presentations begin.",
      "Use of offensive, discriminatory, or politically sensitive content in any project is not permitted.",
      "Teams failing to report at the designated time will be disqualified."
    ],
    minMembers: 1,
    maxMembers: 4,
    participantsText: "1 TO 4 MEMBERS",
    format: "PRESENTATION + Q&A",
    rounds: [
      { label: "SETUP PHASE", desc: "Teams set up demonstrations and displays at assigned stations." },
      { label: "PRESENTATION ROUND", desc: "Each team presents their project to judges — 10 minutes strictly." },
      { label: "Q&A SESSION", desc: "Judges probe deeper into innovation, technical depth, and feasibility." },
      { label: "JUDGING & AWARDS", desc: "Scores are tallied and results are announced by the coordinators." }
    ],
    judging: [
      { criterion: "Innovation & Originality", weightage: "30%" },
      { criterion: "Technical Complexity", weightage: "25%" },
      { criterion: "Presentation & Communication", weightage: "20%" },
      { criterion: "Feasibility & Real-World Impact", weightage: "15%" },
      { criterion: "Q&A Handling", weightage: "10%" }
    ],
    eligibility: [
      "Open to all enrolled students of the college.",
      "Team can consist of 1 to 4 members.",
      "Cross-department teams are allowed.",
      "Each student can participate in only one team per event."
    ]
  },
  {
    id: "tech-quiz",
    eventNumber: "02",
    name: "MindMatrix",
    tagline: "Where knowledge meets logic.",
    moduleName: "MINDMATRIX",
    time: "11:30 AM",
    venue: "Computer Lab — Block B",
    duration: "90 Minutes",
    coordinators: ["Shreya", "Anshu"],
    description: "Test your knowledge across multiple domains of computer science and technology in this fast-paced, multi-round quiz competition. MindMatrix rewards both depth of knowledge and quick thinking — covering topics from programming and networking to emerging technologies and general tech awareness.",
    rules: [
      "No mobile devices, smartwatches, or any external electronic devices are allowed inside the quiz hall.",
      "Teams must arrive at least 10 minutes before the event begins.",
      "Negative marking may apply in specific rounds — instructions will be given before each round.",
      "Discussion between team members is permitted only during the allotted time in collaborative rounds.",
      "Judges' and quizmaster's decisions are final and binding — no disputes will be entertained.",
      "Any attempt to cheat, use unauthorized resources, or communicate with other teams will result in immediate disqualification.",
      "Teams failing to answer within the time limit forfeit that question."
    ],
    minMembers: 3,
    maxMembers: 3,
    participantsText: "3 MEMBERS",
    format: "3 ROUNDS",
    rounds: [
      { label: "ROUND 01 — RAPID FIRE", desc: "MCQ-based questions on CS fundamentals, networking, and general technology. 20 questions in 10 minutes." },
      { label: "ROUND 02 — VISUAL ROUND", desc: "Identify technologies, logos, code snippets, and technical diagrams. Team deliberation allowed." },
      { label: "ROUND 03 — FINALE BUZZER", desc: "High-stakes buzzer round. First correct answer wins points; wrong answers carry a penalty." }
    ],
    judging: [
      { criterion: "Round 1 — Rapid Fire Score", weightage: "30%" },
      { criterion: "Round 2 — Visual Round Score", weightage: "30%" },
      { criterion: "Round 3 — Buzzer Finale Score", weightage: "40%" }
    ],
    eligibility: [
      "Open to all enrolled students of the college.",
      "Team must consist of exactly 3 members.",
      "No cross-event participation for the same time slot.",
      "Each student may participate in only one team."
    ]
  },
  {
    id: "cyber-awareness",
    eventNumber: "03",
    name: "CyberCanvas",
    tagline: "Visualize. Secure. Inspire.",
    moduleName: "CYBERCANVAS",
    time: "12:30 PM",
    venue: "Exhibition Corridor — Ground Floor",
    duration: "1.5 Hours",
    coordinators: ["Alefiya", "Zainab"],
    description: "Design and present a visually compelling poster that communicates cybersecurity awareness, defense mechanisms, or emerging cyber threats. CyberCanvas is where design meets security — teams must balance technical accuracy with creative visual storytelling.",
    rules: [
      "Posters must be physically printed and mounted — digital-only displays are not accepted.",
      "Poster dimensions: A1 size (594mm × 841mm) — no larger, no smaller.",
      "Content must strictly maintain a cybersecurity theme — off-topic submissions will be disqualified.",
      "No offensive imagery, political content, or copyrighted material without proper attribution.",
      "Teams must be present at their poster for the entire judging duration.",
      "Punctuality is strictly enforced — late submissions or late arrivals will not be accepted.",
      "Judges may ask questions about the poster's technical content.",
      "Teams must not present another team's work — plagiarism results in immediate disqualification."
    ],
    minMembers: 2,
    maxMembers: 4,
    participantsText: "2 IS MINIMUM AND 4 IS MAXIMUM",
    format: "POSTER PRESENTATION",
    rounds: [
      { label: "SUBMISSION & DISPLAY SETUP", desc: "Teams mount and set up their A1 poster at the designated exhibition stand." },
      { label: "JUDGING WALKTHROUGH", desc: "Judges visit each team's poster. Teams must present and explain their work within 5 minutes." },
      { label: "RESULTS ANNOUNCEMENT", desc: "Winners announced after all teams are evaluated." }
    ],
    judging: [
      { criterion: "Visual Design & Creativity", weightage: "25%" },
      { criterion: "Technical Content & Accuracy", weightage: "30%" },
      { criterion: "Cyber Theme Relevance", weightage: "20%" },
      { criterion: "Clarity & Communication", weightage: "15%" },
      { criterion: "Q&A Response", weightage: "10%" }
    ],
    eligibility: [
      "Open to all enrolled students.",
      "Team size: minimum 2, maximum 4 members.",
      "Inter-department teams are allowed.",
      "Each student may be part of only one team for this event."
    ]
  },
  {
    id: "code-hunt",
    eventNumber: "04",
    name: "Codebreak",
    tagline: "Crack it. Solve it. Conquer it.",
    moduleName: "CODE RUSH",
    time: "12:30 PM",
    venue: "Programming Lab — Block C",
    duration: "2 Hours",
    coordinators: ["Shabbir", "Rehan"],
    description: "An intense individual competitive programming challenge where you navigate a series of algorithmic modules. Each solved problem outputs a clue that leads to the next module — speed and accuracy both matter. Only the sharpest coders finish the trail.",
    rules: [
      "This is an INDIVIDUAL event — no team participation allowed.",
      "Participants must follow the assigned starting module strictly.",
      "Each module's program output specifies the next module to visit — do not skip or reorder.",
      "Accessing another participant's code, computer, solution, or clues is strictly prohibited.",
      "Sharing answers or solutions between participants is prohibited.",
      "Tampering with the website, competition system, database, or any technical infrastructure is strictly prohibited and will result in permanent disqualification.",
      "Unauthorized external assistance, including AI tools, direct solution searching, or pre-written code libraries beyond standard I/O, is not allowed.",
      "Participants must immediately report any technical issues to the event coordinator.",
      "Any form of cheating, misconduct, or unfair practice results in disqualification.",
      "Participants must maintain discipline and respect fellow participants, organizers, and volunteers."
    ],
    minMembers: 1,
    maxMembers: 1,
    participantsText: "INDIVIDUAL",
    format: "MULTI-MODULE TRAIL",
    rounds: [
      { label: "MODULE ASSIGNMENT", desc: "Each participant is assigned a unique starting programming module at the beginning." },
      { label: "CODE TRAIL", desc: "Solve each module's challenge — the output reveals your next destination module. Race through all modules." },
      { label: "FINAL SUBMISSION", desc: "First participant to correctly complete all modules and submit the final answer wins." }
    ],
    judging: [
      { criterion: "Speed (First to Complete)", weightage: "50%" },
      { criterion: "Code Correctness & Logic", weightage: "30%" },
      { criterion: "Number of Modules Completed", weightage: "20%" }
    ],
    eligibility: [
      "Individual participation only — no teams.",
      "Open to all enrolled students of the college.",
      "Basic programming knowledge in at least one language (C, C++, Python, Java) is expected.",
      "Participants must bring their own college ID."
    ]
  },
  {
    id: "techhunt",
    eventNumber: "05",
    name: "TechTrail",
    tagline: "Follow the clues. Find the tech.",
    moduleName: "TECH QUEST",
    time: "2:00 PM",
    venue: "Campus-Wide",
    duration: "1.5 Hours",
    coordinators: ["Munira", "Tasneem"],
    description: "A campus-wide technical treasure hunt where teams solve technical riddles, decode data breadcrumbs, and race to checkpoints hidden across the college. TechTrail tests your tech knowledge, teamwork, and problem-solving speed simultaneously.",
    rules: [
      "Teams must stay together at all times — splitting up is not permitted.",
      "All campus property must be respected — damage to property will result in immediate disqualification.",
      "Clues must only be found through the official designated channels — no asking staff or outsiders.",
      "Teams must not interfere with other teams' progress or steal clues.",
      "Use of mobile internet to search for answers is not allowed unless explicitly permitted.",
      "Teams must check in at each checkpoint with the designated marshal.",
      "Any form of cheating or rule violation results in immediate disqualification.",
      "The team that completes all checkpoints with the highest accuracy in the least time wins."
    ],
    minMembers: 3,
    maxMembers: 5,
    participantsText: "3 IS MINIMUM AND 5 IS MAXIMUM",
    format: "MULTI-CHECKPOINT HUNT",
    rounds: [
      { label: "BRIEFING & CLUE 01", desc: "Teams receive their first clue and starting instructions from the organizers." },
      { label: "CHECKPOINT TRAIL", desc: "Solve riddles and navigate to each checkpoint spread across campus. Each checkpoint reveals the next." },
      { label: "FINAL CHECKPOINT", desc: "A final technical challenge must be solved at the last checkpoint before declaring completion." },
      { label: "RESULTS", desc: "Winner determined by time taken and number of checkpoints correctly cleared." }
    ],
    judging: [
      { criterion: "Total Time to Completion", weightage: "50%" },
      { criterion: "Checkpoints Correctly Cleared", weightage: "30%" },
      { criterion: "Final Challenge Accuracy", weightage: "20%" }
    ],
    eligibility: [
      "Open to all enrolled students.",
      "Team size: minimum 3, maximum 5 members.",
      "Cross-department teams are allowed.",
      "Each student may participate in only one team."
    ]
  },
  {
    id: "freefire",
    eventNumber: "06",
    name: "Final Strike",
    tagline: "Only one team stands.",
    moduleName: "GAME ARENA",
    time: "3:00 PM",
    venue: "Gaming Zone — Block D",
    duration: "Approx. 2 Hours",
    coordinators: ["Meet", "Rohit"],
    description: "The ultimate tactical squad-based battle royale esports championship. Squads of 4 compete in Free Fire matches to claim dominance and the championship title. Strategy, teamwork, and execution under pressure define the winner.",
    rules: [
      "MOBILE ONLY — PC emulator players are strictly not allowed. Device checks will be performed before matches.",
      "NO TEAMING — Forming alliances with enemy squads is banned. Both squads involved will be permanently disqualified from the tournament.",
      "ZERO TOLERANCE FOR HACKS — Any script, hack, cheat engine, or map glitch exploitation results in a permanent ban from the tournament.",
      "NO TOXICITY — Abusive language, harassment, or disrespectful behaviour towards any player, organizer, or volunteer will result in disqualification.",
      "Players must join the room with the correct IGN registered during sign-up. Impersonation will result in disqualification.",
      "All match results are recorded and final. Disputes must be raised within 2 minutes of match end — no late disputes accepted.",
      "Device battery issues or connectivity problems are the team's responsibility — no re-matches granted.",
      "Organizers' decisions on all matters during the tournament are final and binding."
    ],
    minMembers: 4,
    maxMembers: 4,
    participantsText: "4 MEMBERS",
    format: "SQUAD BATTLE ROYALE",
    rounds: [
      { label: "REGISTRATION VERIFICATION", desc: "All player IGNs and UIDs verified against registration data. Non-matching players are removed." },
      { label: "WARM-UP LOBBY", desc: "Teams join the practice lobby to familiarise with room settings and confirm device readiness." },
      { label: "LEAGUE MATCHES", desc: "Multiple battle royale matches played. Points awarded per kill and placement ranking." },
      { label: "GRAND FINALE", desc: "Top qualifying squads enter the championship final match. Winner takes all." }
    ],
    judging: [
      { criterion: "Placement Points (Survival)", weightage: "50%" },
      { criterion: "Kill Points", weightage: "35%" },
      { criterion: "Bonus Objective Points", weightage: "15%" }
    ],
    eligibility: [
      "Team must consist of exactly 4 players.",
      "Open to all enrolled students of the college.",
      "Players must use their own mobile device — sharing devices is not allowed.",
      "All players must register their in-game name (IGN) and UID during sign-up.",
      "A valid college ID must be presented before match entry."
    ]
  },
  {
    id: "trust-partner",
    eventNumber: "07",
    name: "Blind Sync",
    tagline: "Trust. Communicate. Execute.",
    moduleName: "TRUST WALK",
    time: "3:00 PM",
    venue: "Open Courtyard — Ground Floor",
    duration: "4 ROUNDS · 4-5 MINUTES EACH",
    coordinators: ["Patel Mihir", "Ronaldo"],
    description: "A two-player trust and communication challenge. One player is blindfolded and must reach the finish line by following the other player's voice instructions without touching obstacles or leaving the track.",
    rules: [
      "Only 2 players are allowed: one blindfolded player and one guide.",
      "The blindfolded player cannot remove the blindfold during the game.",
      "The guide cannot touch or push the blind player.",
      "The guide must use voice instructions only; no physical assistance is allowed.",
      "No shouting or unnecessary noise is allowed.",
      "The blind player must not cheat by peeking.",
      "The track may contain simple safe obstacles such as cones, chairs, or tape marks.",
      "Touching an obstacle or going outside the track results in immediate disqualification.",
      "If the blind player needs physical help, the referee may restart the current round."
    ],
    minMembers: 2,
    maxMembers: 2,
    participantsText: "2 MEMBERS",
    format: "4-ROUND TRUST CHALLENGE",
    rounds: [
      { label: "EASY", desc: "The blindfolded player follows the guide's voice instructions through the easiest track." },
      { label: "MEDIUM", desc: "The pair advances through a more demanding track while maintaining clear communication." },
      { label: "HARD", desc: "The pair completes the difficult track without touching obstacles or leaving the boundaries." },
      { label: "FINAL", desc: "The pair completes the final track. Any disqualification prevents the team from winning." }
    ],
    judging: [
      { criterion: "All Four Rounds Completed", weightage: "40%" },
      { criterion: "No Disqualifications", weightage: "35%" },
      { criterion: "Communication & Teamwork", weightage: "25%" }
    ],
    eligibility: [
      "Each team must consist of exactly 2 players.",
      "One player must take the blindfolded role and one player must be the guide.",
      "Both players must be able to follow safety instructions from the organizers.",
      "Each student may participate in only one pair for this event."
    ]
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

  // --- Core fields ---
  document.getElementById("detail-event-number").textContent = `EVENT // ${event.eventNumber}`;
  document.getElementById("detail-event-name").textContent = event.name;
  document.getElementById("detail-tagline").textContent = event.tagline || "";
  document.getElementById("detail-module-name").textContent = `CATEGORY // ${event.moduleName || "EVENT MODULE"}`;
  document.getElementById("detail-description").textContent = event.description;

  // --- Rules ---
  const rulesList = document.getElementById("detail-rules-list");
  rulesList.innerHTML = event.rules.map((rule, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHTML(rule)}</p></li>`).join('');

  // --- Sidebar: Time ---
  document.getElementById("detail-time").textContent = event.time;

  // --- Sidebar: Team Size ---
  document.getElementById("detail-team-size").textContent = event.participantsText;

  // --- Sidebar: Format ---
  if (event.format) {
    document.getElementById("detail-format").textContent = event.format;
    document.getElementById("format-block").style.display = "block";
  } else {
    document.getElementById("format-block").style.display = "none";
  }

  // --- Sidebar: Venue ---
  if (event.venue) {
    document.getElementById("detail-venue").textContent = event.venue;
    document.getElementById("venue-block").style.display = "block";
  } else {
    document.getElementById("venue-block").style.display = "none";
  }

  // --- Sidebar: Duration ---
  if (event.duration) {
    document.getElementById("detail-duration").textContent = event.duration;
    document.getElementById("duration-block").style.display = "block";
  } else {
    document.getElementById("duration-block").style.display = "none";
  }

  // --- Coordinators ---
  const coordsList = document.getElementById("detail-coordinators-list");
  coordsList.innerHTML = event.coordinators.map(coord => `<li>${escapeHTML(coord)}</li>`).join('');

  // --- Rounds / Format Section ---
  const roundsSection = document.getElementById("detail-rounds-section");
  const roundsContent = document.getElementById("detail-rounds-content");
  if (event.rounds && event.rounds.length) {
    roundsContent.innerHTML = event.rounds.map((r, i) => `
      <div class="round-item">
        <div class="round-step">${String(i + 1).padStart(2, "0")}</div>
        <div class="round-body">
          <dt>${escapeHTML(r.label)}</dt>
          <dd>${escapeHTML(r.desc)}</dd>
        </div>
      </div>`).join('');
    roundsSection.style.display = "block";
  } else {
    roundsSection.style.display = "none";
  }

  // --- Judging Criteria Section ---
  const judgingSection = document.getElementById("detail-judging-section");
  const judgingBody = document.getElementById("detail-judging-body");
  if (event.judging && event.judging.length) {
    judgingBody.innerHTML = event.judging.map(j => `
      <tr>
        <td>${escapeHTML(j.criterion)}</td>
        <td class="weightage-cell">${escapeHTML(j.weightage)}</td>
      </tr>`).join('');
    judgingSection.style.display = "block";
  } else {
    judgingSection.style.display = "none";
  }

  // --- Eligibility & Notes Section ---
  const notesSection = document.getElementById("detail-notes-section");
  const notesList = document.getElementById("detail-notes-list");
  if (event.eligibility && event.eligibility.length) {
    notesList.innerHTML = event.eligibility.map(note => `<li>${escapeHTML(note)}</li>`).join('');
    notesSection.style.display = "block";
  } else {
    notesSection.style.display = "none";
  }

  // --- Register Button ---
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
  }

   // ============================================================
// GENERATE REGISTRATION FIELDS
// ============================================================

if (event.id === "code-hunt") {

  // -----------------------------
  // CODEBREAK — INDIVIDUAL
  // -----------------------------
  membersContainer.innerHTML = `
    <div class="player-fieldset required">

      <div class="input-group">
        <label for="member-1">YOUR NAME</label>
        <div class="input-wrapper">
          <input
            type="text"
            id="member-1"
            name="member1"
            placeholder="ENTER YOUR NAME"
            required
            autocomplete="name"
          >
          <div class="input-corners"></div>
        </div>
      </div>

      <div class="input-group">
        <label for="enrollment-1">YOUR ENROLLMENT NUMBER</label>
        <div class="input-wrapper">
          <input
            type="text"
            id="enrollment-1"
            name="enrollment1"
            placeholder="ENTER ENROLLMENT NUMBER"
            required
            autocomplete="off"
          >
          <div class="input-corners"></div>
        </div>
      </div>

      <div class="input-group">
        <label for="semester-1">SEMESTER</label>
        <div class="input-wrapper">
          <select
            id="semester-1"
            name="semester1"
            required
          >
            <option value="" disabled selected>SELECT SEMESTER</option>
            <option value="1">SEM 1</option>
            <option value="3">SEM 3</option>
            <option value="5">SEM 5</option>
          </select>
          <div class="input-corners"></div>
        </div>
      </div>

    </div>
  `;

} else if (isFreeFire) {

  // -----------------------------
  // FINAL STRIKE
  // -----------------------------
  for (let i = 1; i <= event.maxMembers; i++) {

    const memberNum = i.toString().padStart(2, "0");
    const isRequired = i <= event.minMembers ? "required" : "";
    const requiredClass = isRequired ? "required" : "optional";

    membersContainer.innerHTML += `
      <div class="player-fieldset ${requiredClass}">

        <h4>
          PLAYER ${memberNum}
          ${!isRequired ? "(OPTIONAL)" : ""}
        </h4>

        <div class="input-group">
          <label for="player-ign-${i}">IN-GAME NAME (IGN)</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="player-ign-${i}"
              name="player${i}Ign"
              placeholder="ENTER PLAYER IGN"
              ${isRequired}
            >
            <div class="input-corners"></div>
          </div>
        </div>

        <div class="input-group">
          <label for="player-uid-${i}">UID</label>
          <div class="input-wrapper">
            <input
              type="text"
              id="player-uid-${i}"
              name="player${i}Uid"
              placeholder="ENTER PLAYER UID"
              inputmode="numeric"
              ${isRequired}
            >
            <div class="input-corners"></div>
          </div>
        </div>

      </div>
    `;
  }

} else {

  // -----------------------------
  // ALL OTHER TEAM EVENTS
  // -----------------------------
  for (let i = 1; i <= event.maxMembers; i++) {

    const memberNum = i.toString().padStart(2, "0");
    const isRequired = i <= event.minMembers ? "required" : "";
    const requiredClass = isRequired ? "required" : "";

    const memberLabel =
      `TEAM MEMBER ${memberNum} NAME`;

    const enrollmentLabel =
      `TEAM MEMBER ${memberNum} ENROLLMENT`;

    membersContainer.innerHTML += `
      <div class="player-fieldset ${requiredClass}">

        <div class="input-group">
          <label for="member-${i}">
            ${memberLabel}
            ${!isRequired ? "(OPTIONAL)" : ""}
          </label>

          <div class="input-wrapper">
            <input
              type="text"
              id="member-${i}"
              name="member${i}"
              placeholder="ENTER NAME"
              ${isRequired}
            >
            <div class="input-corners"></div>
          </div>
        </div>

        <div class="input-group">
          <label for="enrollment-${i}">
            ${enrollmentLabel}
          </label>

          <div class="input-wrapper">
            <input
              type="text"
              id="enrollment-${i}"
              name="enrollment${i}"
              placeholder="ENTER ENROLLMENT NO."
              ${isRequired}
            >
            <div class="input-corners"></div>
          </div>
        </div>

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

  const resetFormState = () => {
    isModalAnimating = false;
    const form = document.getElementById("technot-registration-form");
    if (form) {
      form.style.display = "block";
      form.style.opacity = "1";
      form.style.transform = "none";
    }
    const successDiv = document.getElementById("registration-success");
    if (successDiv) {
      successDiv.style.display = "none";
    }
  };

  if (!window.gsap) {
    regOverlay.style.display = "none";
    regOverlay.setAttribute("aria-hidden", "true");
    resetFormState();
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
  const tl = gsap.timeline({ onComplete: resetFormState });

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

function sendToAppsScript(url, payload) {
  if (!url || url.includes("YOUR_DEPLOYMENT_ID")) {
    console.warn("TECHNOT 2.0: Google Apps Script Web App URL is not set yet. Set window.TECHNOT_APPS_SCRIPT_URL or update APPS_SCRIPT_URL in events.js to save registrations directly to Google Sheets.");
    return new Promise(resolve => setTimeout(resolve, 600));
  }

  const payloadString = JSON.stringify(payload);

  // Try standard CORS request first
  return fetch(url, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: payloadString
  })
  .then(res => {
    return res.json().catch(() => ({ result: "success" }));
  })
  .catch(err => {
    console.warn("Browser CORS redirect restricted direct read, using secure background post fallback:", err);
    // Fallback using no-cors mode guarantees the POST reaches Google Apps Script from file:// or localhost
    return fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: payloadString
    }).then(() => ({ result: "success", fallback: true }));
  });
}

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
  if (!isFreeFire && email && email.value.trim() && !/^\S+@\S+\.\S+$/.test(email.value)) {
    const group = email.closest(".input-group");
    group.classList.add("has-error");
    group.querySelector(".error-msg").textContent = "[!] INVALID EMAIL FORMAT";
    isValid = false;
  }

  const phone = document.getElementById("contact-phone");
  if (phone && phone.value.trim() && !/^[0-9\-\+\s]{7,15}$/.test(phone.value)) {
    const group = phone.closest(".input-group");
    group.classList.add("has-error");
    group.querySelector(".error-msg").textContent = "[!] INVALID PHONE FORMAT";
    isValid = false;
  }

  if (!isValid) return;

  const eventId = document.getElementById("reg-event-id").value;
  const eventName = document.getElementById("reg-event-name").textContent.trim();
  const teamNameInput = document.getElementById("team-name");
  const teamName = teamNameInput ? teamNameInput.value.trim() : "";
  const phoneValue = phone ? phone.value.trim() : "";
  const emailValue = (!isFreeFire && email) ? email.value.trim() : "";
  const deptInput = document.getElementById("department");
  const deptValue = (!isFreeFire && deptInput) ? deptInput.value : "";

  const registrationPayload = {
    eventId: eventId,
    eventName: eventName,
    teamName: teamName,
    contactPhone: phoneValue,
    contactEmail: emailValue,
    department: deptValue,
    isFreeFire: isFreeFire,
    players: [],
    members: []
  };

 if (isFreeFire) {

    registrationPayload.players = Array.from(
        document.querySelectorAll("#members-container .player-fieldset")
    ).map((group, index) => {

        const ignInput = group.querySelector(`[name="player${index + 1}Ign"]`);
        const uidInput = group.querySelector(`[name="player${index + 1}Uid"]`);

        return {
            ign: ignInput ? ignInput.value.trim() : "",
            uid: uidInput ? uidInput.value.trim() : ""
        };

    }).filter(p => p.ign || p.uid);

} else if (eventId === "code-hunt") {

    // CODEBREAK — explicitly read each field by ID
    const nameInput = document.getElementById("member-1");
    const enrollmentInput = document.getElementById("enrollment-1");
    const semesterInput = document.getElementById("semester-1");

    registrationPayload.members = [{
        name: nameInput ? nameInput.value.trim() : "",
        enrollment: enrollmentInput ? enrollmentInput.value.trim() : "",
        semester: semesterInput ? semesterInput.value : ""
    }];

} else {

    // Normal team events
        registrationPayload.members = Array.from(
      document.querySelectorAll(
        "#members-container .player-fieldset"
      )
    ).map((group, index) => {

      const memberNumber = index + 1;

      const memberInput =
        document.getElementById(`member-${memberNumber}`);

      const enrollmentInput =
        document.getElementById(`enrollment-${memberNumber}`);

      return {
        name: memberInput
          ? memberInput.value.trim()
          : "",

        enrollment: enrollmentInput
          ? enrollmentInput.value.trim()
          : "",

        semester: ""
      };

    });
}

  form.dataset.registrationPayload = JSON.stringify(registrationPayload);

  // Backend submission & GSAP visual feedback
  const btnText = document.querySelector(".form-submit-wrapper .btn-text");
  const submitBtn = document.getElementById("submit-registration");
  submitBtn.disabled = true;

  // Google Apps Script Web App Endpoint URL
  const APPS_SCRIPT_URL = window.TECHNOT_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbxGnTs-YDcBuK4y-kNUFIgke4Pic5kVkPfvAyyXnJdZoNgcd-9zORmnYVYY5o2xl4_i/exec";

  const tl = gsap.timeline();
  tl.to(btnText, { opacity: 0, duration: 0.2, onComplete: () => btnText.textContent = "PROCESSING..." })
    .to(btnText, { opacity: 1, duration: 0.2 })
    .to(btnText, { opacity: 0, duration: 0.2, delay: 0.6, onComplete: () => btnText.textContent = "VERIFYING DATA..." })
    .to(btnText, { opacity: 1, duration: 0.2 })
    .to(btnText, {
      opacity: 0, duration: 0.2, delay: 0.6, onComplete: () => {
        btnText.textContent = "SAVING REGISTRATION...";
      }
    })
    .to(btnText, { opacity: 1, duration: 0.2 })
    .call(() => {
      sendToAppsScript(APPS_SCRIPT_URL, registrationPayload)
        .then(res => {
          if (res && res.result === "error") {
            throw new Error(res.error || "Google Apps Script rejected registration.");
          }
          btnText.textContent = "REGISTRATION // ACCEPTED";
          btnText.style.color = "#0A6ED3";
          
          const primaryName = teamName || (registrationPayload.members[0] ? registrationPayload.members[0].name : "Participant");
          document.getElementById("success-event").textContent = eventName;
          document.getElementById("success-team").textContent = primaryName;
          submitBtn.disabled = false;

          gsap.to(form, { opacity: 0, y: -20, duration: 0.5, onComplete: () => form.style.display = "none" });
          gsap.set("#registration-success", { display: "block", opacity: 0, scale: 0.95 });
          gsap.to("#registration-success", { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)", delay: 0.3 });
        })
        .catch(err => {
          console.error("Registration submission failed:", err);
          btnText.textContent = "SUBMISSION FAILED // RETRY";
          btnText.style.color = "#FF3366";
          submitBtn.disabled = false;
          
          const confirmGroup = document.querySelector(".confirmation-section");
          if (confirmGroup) {
            confirmGroup.classList.add("has-error");
            const errEl = confirmGroup.querySelector(".error-msg");
            if (errEl) errEl.textContent = "[!] NETWORK ERROR. PLEASE TRY AGAIN.";
          }
        });
    });
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
  document.getElementById("close-registration").addEventListener("click", closeRegistration);
  const successReturnBtn = document.getElementById("success-return-btn");
  if (successReturnBtn) {
    successReturnBtn.addEventListener("click", closeRegistration);
  }
  document.getElementById("close-details").addEventListener("click", closeEventDetails);

  document.getElementById("detail-register-btn").addEventListener("click", (e) => {
    e.preventDefault();
    const eventId = e.currentTarget.getAttribute("data-event-id");
    delete document.body.dataset.registrationSource;
    openRegistration(eventId);
  });

  const regForm = document.getElementById("technot-registration-form");
  if (regForm) {
    regForm.addEventListener("submit", handleRegistrationSubmit);
  }
  const submitBtn = document.getElementById("submit-registration");
  if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      if (regForm && typeof regForm.requestSubmit === "function") {
        e.preventDefault();
        regForm.requestSubmit();
      }
    });
  }
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
