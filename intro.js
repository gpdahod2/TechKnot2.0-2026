const LOGO_ASPECT = 1536 / 931;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let threeState;

function completeIntro() {
  if (document.documentElement.classList.contains("intro-complete")) return;
  if (threeState) threeState.running = false;

  const intro = document.querySelector(".intro-stage");
  const hero = document.querySelector(".hero-placeholder");
  const heroContent = document.querySelector(".hero-content");
  if (intro) {
    intro.style.opacity = "0";
    intro.style.pointerEvents = "none";
    intro.style.display = "none";
  }
  if (hero) hero.style.opacity = "1";
  if (heroContent) {
    heroContent.style.opacity = "1";
    heroContent.style.transform = "translateY(0)";
  }
  document.documentElement.classList.add("intro-complete");
  window.dispatchEvent(new CustomEvent("technot:intro-complete"));
}

window.technotCompleteIntro = completeIntro;

function makeFallbackTimeline() {
  threeState = setupCanvasSpace();
  const bootLines = document.querySelectorAll("[data-boot]");
  const intro = document.querySelector(".intro-stage");
  const hero = document.querySelector(".hero-placeholder");
  const heroContent = document.querySelector(".hero-content");
  const logoSystem = document.querySelector(".logo-system");
  const logoShell = document.querySelector(".logo-shell");
  const logoMain = document.querySelector(".logo-main");

  logoShell.style.clipPath = "inset(0 0 0 0)";
  bootLines.forEach((line, index) => {
    line.animate(
      [{ opacity: 0, transform: line.classList.contains("boot-g") ? "translateX(-50%) translateY(6px)" : "translateY(6px)" }, { opacity: 0.72, transform: line.classList.contains("boot-g") ? "translateX(-50%) translateY(0)" : "translateY(0)" }, { opacity: 0.08 }],
      { duration: 1600, delay: 900 + index * 220, fill: "forwards", easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  });

  logoSystem.animate(
    [{ opacity: 0, transform: "scale(.86)" }, { opacity: 1, transform: "scale(1)" }, { opacity: 1, transform: "scale(1.22)" }],
    { duration: 4400, delay: 2600, fill: "forwards", easing: "cubic-bezier(.2,.8,.2,1)" }
  );
  logoMain.animate(
    [{ opacity: 0.12, filter: "brightness(.55) saturate(.8)" }, { opacity: 0.92, filter: "brightness(1.25) saturate(1.2) drop-shadow(0 0 18px rgba(10, 110, 211,.58))" }],
    { duration: 3000, delay: 3100, fill: "forwards", easing: "ease-out" }
  );
  hero.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 6500, fill: "forwards", easing: "ease-out" });
  heroContent.animate([{ opacity: 0, transform: "translateY(26px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 900, delay: 6900, fill: "forwards", easing: "ease-out" });
  intro.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 700, delay: 7300, fill: "forwards", easing: "ease-out" });

  window.setTimeout(() => {
    completeIntro();
  }, 8050);
}

function setupCanvasSpace() {
  const canvas = document.getElementById("space");
  const ctx = canvas.getContext("2d");
  const count = window.innerWidth < 720 || prefersReducedMotion ? 90 : 220;
  const nodes = Array.from({ length: 24 }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: Math.random(),
    r: 0.8 + Math.random() * 2.7,
    phase: Math.random() * Math.PI * 2
  }));
  const particles = Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    z: Math.random(),
    speed: 0.0004 + Math.random() * 0.0016,
    phase: Math.random() * Math.PI * 2
  }));
  const state = {
    intensity: 0,
    networkOpacity: 0,
    cameraZ: 34,
    particleRush: 0,
    width: 0,
    height: 0,
    running: true
  };

  function resize() {
    state.width = window.innerWidth;
    state.height = window.innerHeight;
    canvas.width = Math.floor(state.width * Math.min(window.devicePixelRatio || 1, 1.8));
    canvas.height = Math.floor(state.height * Math.min(window.devicePixelRatio || 1, 1.8));
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    ctx.setTransform(canvas.width / state.width, 0, 0, canvas.height / state.height, 0, 0);
  }

  function project(point) {
    const depth = 0.18 + point.z;
    const drift = (34 - state.cameraZ) * 0.012;
    return {
      x: state.width * (0.5 + (point.x - 0.5) * (1.3 + drift) / depth),
      y: state.height * (0.5 + (point.y - 0.5) * (1.05 + drift) / depth),
      depth
    };
  }

  function drawPacket(a, b, progress, alpha) {
    const ax = a.x + (b.x - a.x) * progress;
    const ay = a.y + (b.y - a.y) * progress;
    const az = a.z + (b.z - a.z) * progress;
    const p = project({ x: ax, y: ay, z: az });
    ctx.beginPath();
    ctx.fillStyle = `rgba(234,247,255,${alpha})`;
    ctx.shadowColor = "rgba(10, 110, 211,0.9)";
    ctx.shadowBlur = 12;
    ctx.arc(p.x, p.y, Math.max(0.8, 3.8 / p.depth), 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function render(time) {
    if (!state.running) return;
    const t = time * 0.001;
    ctx.clearRect(0, 0, state.width, state.height);

    particles.forEach((particle) => {
      particle.z -= particle.speed * (1 + state.particleRush * 120);
      if (particle.z < 0.04) {
        particle.z = 1;
        particle.x = Math.random();
        particle.y = Math.random();
      }
      const centerPull = state.intensity * 0.0024;
      particle.x += (0.5 - particle.x) * centerPull;
      particle.y += (0.5 - particle.y) * centerPull;
      const p = project(particle);
      const alpha = (0.035 + state.intensity * 0.15 + state.networkOpacity * 0.08) * (1 - particle.z * 0.38);
      ctx.fillStyle = `rgba(10, 110, 211,${alpha})`;
      ctx.fillRect(p.x, p.y, 1.1 + state.particleRush * 3.5, 1.1);
    });

    const networkAlpha = state.networkOpacity;
    if (networkAlpha > 0.01) {
      for (let i = 0; i < nodes.length - 2; i += 1) {
        if (i % 4 === 0) continue;
        const a = project(nodes[i]);
        const b = project(nodes[(i + 3) % nodes.length]);
        const c = project(nodes[(i + 7) % nodes.length]);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(5, 78, 152,${0.16 * networkAlpha})`;
        ctx.lineWidth = Math.max(0.6, 1.8 / Math.min(a.depth, b.depth));
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(b.x, b.y, c.x, c.y);
        ctx.stroke();
      }

      nodes.forEach((node, index) => {
        const p = project(node);
        const pulse = 0.62 + Math.sin(t * 2.2 + node.phase) * 0.28;
        ctx.beginPath();
        ctx.fillStyle = `rgba(10, 110, 211,${networkAlpha * (0.38 + pulse * 0.34)})`;
        ctx.shadowColor = "rgba(10, 110, 211,0.78)";
        ctx.shadowBlur = 10 * networkAlpha;
        ctx.arc(p.x, p.y, node.r * (1.5 / p.depth), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        if (index % 3 === 0) {
          drawPacket(node, nodes[(index + 5) % nodes.length], (t * 0.16 + index * 0.13) % 1, networkAlpha * 0.72);
        }
      });
    }

    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(render);
  return state;
}

function setupThreeSpace() {
  if (!window.THREE) return setupCanvasSpace();

  const canvas = document.getElementById("space");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.z = 34;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const count = window.innerWidth < 720 || prefersReducedMotion ? 120 : 320;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const velocities = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const radius = 10 + Math.random() * 28;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 2] = -42 + Math.random() * 64;
    colors[i * 3] = 0.08 + Math.random() * 0.08;
    colors[i * 3 + 1] = 0.56 + Math.random() * 0.34;
    colors[i * 3 + 2] = 1;
    velocities[i] = 0.006 + Math.random() * 0.026;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      size: 0.052,
      vertexColors: true,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  scene.add(particles);

  const network = new THREE.Group();
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00d9ff, transparent: true, opacity: 0 });
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x008cff, transparent: true, opacity: 0 });
  const nodeGeometry = new THREE.SphereGeometry(0.08, 12, 8);
  const nodePositions = [];

  for (let i = 0; i < 34; i += 1) {
    const x = (Math.random() - 0.5) * 30;
    const y = (Math.random() - 0.5) * 15;
    const z = -35 - Math.random() * 36;
    nodePositions.push(new THREE.Vector3(x, y, z));
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
    node.position.set(x, y, z);
    const scale = 0.8 + Math.random() * 2.5;
    node.scale.setScalar(scale);
    network.add(node);
  }

  for (let i = 0; i < nodePositions.length - 1; i += 1) {
    if (i % 3 === 0) continue;
    const curve = new THREE.CatmullRomCurve3([
      nodePositions[i],
      nodePositions[(i + 3) % nodePositions.length].clone().add(new THREE.Vector3(0, Math.random() * 2 - 1, 0)),
      nodePositions[(i + 7) % nodePositions.length]
    ]);
    const points = curve.getPoints(24);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    network.add(new THREE.Line(geometry, lineMaterial.clone()));
  }

  scene.add(network);

  const packets = [];
  for (let i = 0; i < 12; i += 1) {
    const packet = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), new THREE.MeshBasicMaterial({ color: 0xeaf7ff, transparent: true, opacity: 0 }));
    packet.userData = {
      start: nodePositions[Math.floor(Math.random() * nodePositions.length)],
      end: nodePositions[Math.floor(Math.random() * nodePositions.length)],
      speed: 0.003 + Math.random() * 0.006,
      progress: Math.random()
    };
    scene.add(packet);
    packets.push(packet);
  }

  const state = {
    mode: "boot",
    intensity: 0,
    networkOpacity: 0,
    cameraZ: 34,
    particleRush: 0,
    renderer,
    scene,
    camera,
    particles,
    particleGeometry,
    velocities,
    network,
    packets,
    running: true
  };

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function render() {
    if (!state.running) return;
    const position = particleGeometry.attributes.position;
    const elapsed = performance.now() * 0.001;
    particles.rotation.z = elapsed * 0.015;
    particles.rotation.y = elapsed * 0.018;

    for (let i = 0; i < count; i += 1) {
      const ix = i * 3;
      const pull = state.intensity * 0.012;
      position.array[ix] *= 1 - pull;
      position.array[ix + 1] *= 1 - pull;
      position.array[ix + 2] += velocities[i] + state.particleRush * 0.34;
      if (position.array[ix + 2] > 18) {
        position.array[ix + 2] = -60 - Math.random() * 12;
        position.array[ix] = (Math.random() - 0.5) * 42;
        position.array[ix + 1] = (Math.random() - 0.5) * 22;
      }
    }

    position.needsUpdate = true;
    particles.material.opacity = prefersReducedMotion ? 0.18 : 0.12 + state.intensity * 0.52;
    camera.position.z = state.cameraZ;
    camera.position.x = Math.sin(elapsed * 0.42) * 0.28 * state.networkOpacity;
    camera.position.y = Math.cos(elapsed * 0.35) * 0.18 * state.networkOpacity;

    network.children.forEach((child, index) => {
      child.material.opacity = state.networkOpacity * (child.isLine ? 0.24 : 0.76);
      if (!child.isLine) {
        child.scale.setScalar(child.scale.x + Math.sin(elapsed * 2 + index) * 0.0006 * state.networkOpacity);
      }
    });

    packets.forEach((packet, index) => {
      packet.userData.progress += packet.userData.speed * (0.4 + state.networkOpacity * 3);
      if (packet.userData.progress > 1) {
        packet.userData.progress = 0;
        packet.userData.start = nodePositions[Math.floor(Math.random() * nodePositions.length)];
        packet.userData.end = nodePositions[Math.floor(Math.random() * nodePositions.length)];
      }
      packet.position.lerpVectors(packet.userData.start, packet.userData.end, packet.userData.progress);
      packet.material.opacity = state.networkOpacity * (0.25 + Math.sin(elapsed * 4 + index) * 0.18 + 0.28);
    });

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  requestAnimationFrame(render);
  return state;
}

function splitBootText() {
  document.querySelectorAll("[data-boot]").forEach((line) => {
    line.dataset.label = line.textContent;
    line.textContent = "";
    line.dataset.label.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.opacity = "0";
      line.appendChild(span);
    });
  });
}

function revealLine(tl, selector, at) {
  tl.set(selector, { opacity: 1 }, at)
    .to(`${selector} span`, { opacity: 1, stagger: 0.018, duration: 0.01, ease: "none" }, at + 0.02)
    .to(selector, { opacity: 0.24, duration: 0.45, ease: "power2.out" }, at + 0.72);
}

function introBoot(master) {
  master.to(".ambient-field", { opacity: 0.22, duration: 1.1, ease: "power2.out" }, 0.35);
  revealLine(master, ".boot-a", 1.34);
  revealLine(master, ".boot-b", 1.72);
  revealLine(master, ".boot-c", 1.95);
  revealLine(master, ".boot-d", 2.18);
  revealLine(master, ".boot-e", 2.38);
  revealLine(master, ".boot-f", 2.56);
  master.set(".boot-g", { opacity: 1 }, 2.82)
    .to(".boot-g span", { opacity: 1, stagger: 0.022, duration: 0.01, ease: "none" }, 2.84)
    .to(".boot:not(.boot-g)", { opacity: 0.06, duration: 0.8, ease: "power2.out" }, 3.15);
}

function logoReveal(master) {
  master.to(".logo-system", { opacity: 1, duration: 0.35, ease: "power2.out" }, 3.0)
    .to(".logo-shell", { clipPath: "inset(0% 0 0 0)", duration: 1.25, ease: "power3.inOut" }, 3.08)
    .fromTo(".scanner-horizontal", { yPercent: -80, opacity: 0 }, { yPercent: 410, opacity: 0.9, duration: 1.1, ease: "power2.inOut" }, 3.12)
    .fromTo(".scanner-vertical", { xPercent: -80, opacity: 0 }, { xPercent: 880, opacity: 0.56, duration: 1.2, ease: "power2.inOut" }, 3.26)
    .to(".logo-main", { opacity: 0.44, filter: "saturate(0.95) brightness(0.82) contrast(1.18) drop-shadow(0 0 6px rgba(10, 110, 211,0.22))", duration: 0.8, ease: "power2.out" }, 3.8)
    .to(".scanner", { opacity: 0, duration: 0.38, ease: "power2.out" }, 4.26);
}

function coreActivation(master) {
  master.to(".logo-glow", { opacity: 0.65, duration: 0.62, ease: "power2.out" }, 4.35)
    .to(".logo-main", { opacity: 0.72, filter: "saturate(1.08) brightness(1.05) contrast(1.14) drop-shadow(0 0 11px rgba(10, 110, 211,0.42))", duration: 0.65, ease: "power2.out" }, 4.58)
    .to(".logo-edge", { opacity: 0.65, duration: 0.42, ease: "power2.out" }, 4.8)
    .to(".energy-svg", { opacity: 1, duration: 0.36, ease: "power2.out" }, 4.98)
    .to(".energy-path", { strokeDashoffset: 0, duration: 1.15, stagger: 0.08, ease: "power2.inOut" }, 5.02)
    .to(".logo-main", { opacity: 0.95, filter: "saturate(1.22) brightness(1.23) contrast(1.1) drop-shadow(0 0 18px rgba(10, 110, 211,0.58))", duration: 0.5, ease: "power2.out" }, 5.6)
    .to(threeState || {}, { intensity: 1, duration: 1, ease: "power2.out" }, 5.0);
}

function energyPulse(master) {
  master.fromTo(".pulse-one", { opacity: 0.58, scale: 0.26 }, { opacity: 0, scale: 2.45, duration: 0.88, ease: "power3.out" }, 6.25)
    .fromTo(".pulse-two", { opacity: 0.46, scale: 0.14 }, { opacity: 0, scale: 1.62, duration: 0.64, ease: "power2.out" }, 6.32)
    .to(".whiteout", { opacity: 0.44, duration: 0.11, ease: "power1.out" }, 6.46)
    .to(".whiteout", { opacity: 0, duration: 0.5, ease: "power2.out" }, 6.58)
    .to(".logo-main", { filter: "saturate(1.24) brightness(1.4) contrast(1.18) drop-shadow(0 0 24px rgba(10, 110, 211,0.74))", duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }, 6.36);
}

function cameraPush(master) {
  master.to(".camera-rig", { scale: prefersReducedMotion ? 1.2 : 2.2, duration: 1.8, ease: "power2.in" }, 7.05)
    .to(".logo-system", { rotationX: -4, rotationY: 5, duration: 1.5, ease: "power1.inOut" }, 7.05)
    .to(".logo-glow", { opacity: 0.92, duration: 1.1, ease: "power2.in" }, 7.2)
    .to(threeState || {}, { cameraZ: prefersReducedMotion ? 25 : 18, particleRush: 0.45, duration: 1.75, ease: "power2.in" }, 7.05);
}

function enterCore(master) {
  master.to(".tunnel", { opacity: 0.78, scaleX: 1.6, duration: 0.2, ease: "power2.out" }, 8.78)
    .to(".camera-rig", { scale: prefersReducedMotion ? 1.6 : 3.8, duration: 0.72, ease: "power4.in" }, 8.85)
    .to(".whiteout", { opacity: 0.86, duration: 0.18, ease: "power2.out" }, 9.25)
    .to(".whiteout", { opacity: 0, duration: 0.64, ease: "power2.out" }, 9.55)
    .to(threeState || {}, { cameraZ: 8, particleRush: 1.15, networkOpacity: 0.9, duration: 0.78, ease: "power3.inOut" }, 9.05)
    .to(".tunnel", { opacity: 0, duration: 0.34, ease: "power2.out" }, 9.55);
}

function networkReveal(master) {
  master.to(".camera-rig", { scale: 1, duration: 1.45, ease: "power3.out" }, 9.85)
    .to(".logo-system", { rotationX: 0, rotationY: 0, duration: 1.45, ease: "power3.out" }, 9.85)
    .to(threeState || {}, { cameraZ: 2.5, particleRush: 0.22, networkOpacity: 1, duration: 1.45, ease: "power2.out" }, 9.85)
    .to(".intro-stage", { backgroundColor: "rgba(0, 9, 25,0)", duration: 1.0, ease: "power2.out" }, 10.2)
    .to(".hero-placeholder", { opacity: 1, duration: 1.0, ease: "power2.out" }, 10.28);
}

function finishIntro(master) {
  master.to(".intro-stage", { opacity: 0, duration: 0.8, ease: "power2.out", pointerEvents: "none" }, 11.0)
    .to(".hero-content", { opacity: 1, y: 0, duration: 0.84, ease: "power3.out" }, 11.16)
    .to(threeState || {}, { cameraZ: -4, particleRush: 0.03, networkOpacity: 0.55, intensity: 0.42, duration: 1.1, ease: "power2.out" }, 11.0)
    .call(() => {
      completeIntro();
    }, null, 11.95);
}

function buildTimeline() {
  if (document.getElementById("cinematic-intro-overlay") || document.documentElement.classList.contains("intro-complete")) {
    return;
  }

  if (!window.gsap) {
    makeFallbackTimeline();
    return;
  }

  splitBootText();
  threeState = setupThreeSpace();

  if (prefersReducedMotion) {
    gsap.set(".logo-system", { opacity: 1 });
    gsap.set(".logo-shell", { clipPath: "inset(0% 0 0 0)" });
    gsap.timeline()
      .to(".logo-main", { opacity: 0.86, duration: 0.65, ease: "power2.out" })
      .to(".hero-placeholder", { opacity: 1, duration: 0.45, ease: "power2.out" }, 1.1)
      .to(".intro-stage", { opacity: 0, duration: 0.5, ease: "power2.out" }, 1.45)
      .to(".hero-content", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.55)
      .call(() => {
        completeIntro();
      }, null, 2.05);
    return;
  }

  const master = gsap.timeline();
  introBoot(master);
  logoReveal(master);
  coreActivation(master);
  energyPulse(master);
  cameraPush(master);
  enterCore(master);
  networkReveal(master);
  finishIntro(master);
  master.timeScale(1.35);
}

window.addEventListener("load", () => {
  if (!document.getElementById("cinematic-intro-overlay")) {
    setTimeout(buildTimeline, 1000);
  }
});
