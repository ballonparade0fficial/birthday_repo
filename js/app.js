/* ═══════════════════════════════════════════════════
   Happy Birthday Vauju — Main Script
   ═══════════════════════════════════════════════════ */

/* ══════════════════════════════════════════
   STARS
   ══════════════════════════════════════════ */
(function () {
  const c = document.getElementById("stars-canvas");
  const ctx = c.getContext("2d");
  let stars = [];

  function resize() {
    c.width = innerWidth;
    c.height = innerHeight;
    stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight * 0.7,
      r: Math.random() * 1.2 + 0.3,
      phase: Math.random() * Math.PI * 2,
      sp: Math.random() * 0.005 + 0.002,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    const t = performance.now() * 0.001;
    stars.forEach((s) => {
      ctx.globalAlpha =
        0.2 + 0.35 * Math.abs(Math.sin(t * s.sp * 10 + s.phase));
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
})();

/* ══════════════════════════════════════════
   CAKE DECORATION
   ══════════════════════════════════════════ */
function makeDripSVG(w, h, fill) {
  let path = "M0,0 ",
    x = 0;
  while (x < w) {
    const dw = 12 + Math.random() * 14;
    const dh = 8 + Math.random() * h * 0.55;
    path += `L${x},0 L${x},${dh} Q${x + dw / 2},${dh + 6} ${x + dw},${dh} L${x + dw},0 `;
    x += dw + 3 + Math.random() * 5;
  }
  path += `L${w},0 Z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"
    viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <path d="${path}" fill="${fill}" opacity=".93"/>
  </svg>`;
}

function decorateTier(tid, did, pid, dotid, dripColor, pearlCount, dotCount) {
  const el = document.getElementById(tid);
  const w = el.getBoundingClientRect().width || 200;
  document.getElementById(did).innerHTML = makeDripSVG(
    Math.max(w + 6, 60),
    26,
    dripColor,
  );

  const pr = document.getElementById(pid);
  for (let i = 0; i < pearlCount; i++) {
    const p = document.createElement("div");
    p.className = "pearl";
    pr.appendChild(p);
  }
  const dr = document.getElementById(dotid);
  for (let i = 0; i < dotCount; i++) {
    const d = document.createElement("span");
    dr.appendChild(d);
  }
}

requestAnimationFrame(() => {
  decorateTier(
    "tier-top",
    "drip-top",
    "pearls-top",
    "dots-top",
    "#ffaed8",
    5,
    6,
  );
  decorateTier(
    "tier-mid",
    "drip-mid",
    "pearls-mid",
    "dots-mid",
    "#c084fc",
    7,
    8,
  );
  decorateTier(
    "tier-bot",
    "drip-bot",
    "pearls-bot",
    "dots-bot",
    "#fdba74",
    10,
    11,
  );
});

/* ══════════════════════════════════════════
   CANDLES
   ══════════════════════════════════════════ */
const CANDLE_PALETTE = [
  "#ff4da6",
  "#ffd700",
  "#43e97b",
  "#38b6ff",
  "#d63aff",
  "#ff7043",
  "#00e5d1",
];

function shadedColor(hex, offset) {
  const n = parseInt(hex.slice(1), 16);
  const clamp = (v) => Math.min(255, Math.max(0, v));
  return `rgb(${clamp(((n >> 16) & 0xff) + offset)},${clamp(((n >> 8) & 0xff) + offset)},${clamp((n & 0xff) + offset)})`;
}

function makeCandle(color, animDelay) {
  const wrap = document.createElement("div");
  wrap.className = "candle";
  wrap.innerHTML = `
    <div class="flame-wrap" style="animation-delay:${animDelay}s">
      <div class="flame-glow"></div>
      <div class="flame-outer"></div>
      <div class="flame-inner"></div>
      <div class="flame-core"></div>
    </div>
    <div class="smoke"></div>
    <div class="wick"></div>
    <div class="candle-body" style="background:linear-gradient(175deg,${color} 0%,${shadedColor(color, -40)} 100%)"></div>`;
  return wrap;
}

let totalCandles = 0;
let outCount = 0;

function placeCandlesOnTier(tierId, colors, bottomPx) {
  const tier = document.getElementById(tierId);
  const tw = tier.offsetWidth;
  colors.forEach((col, i) => {
    const c = makeCandle(col, (i * 0.33) % 1.8);
    c.style.position = "absolute";
    const frac = colors.length === 1 ? 0.5 : i / (colors.length - 1);
    c.style.left = frac * (tw - 12) + "px";
    c.style.bottom = bottomPx + "px";
    tier.appendChild(c);
    totalCandles++;
  });
}

// Two rAF ticks to let the layout settle before measuring tier widths
requestAnimationFrame(() =>
  requestAnimationFrame(() => {
    placeCandlesOnTier(
      "tier-top",
      [CANDLE_PALETTE[0], CANDLE_PALETTE[1], CANDLE_PALETTE[2]],
      58,
    );
    placeCandlesOnTier(
      "tier-mid",
      [
        CANDLE_PALETTE[3],
        CANDLE_PALETTE[4],
        CANDLE_PALETTE[5],
        CANDLE_PALETTE[6],
      ],
      72,
    );
    updateCounter();
  }),
);

/* ══════════════════════════════════════════
   BLOW / RESET LOGIC
   ══════════════════════════════════════════ */
const blowBtn = document.getElementById("blow-btn");
const wishEl = document.getElementById("wish");
const counterEl = document.getElementById("candle-counter");

function updateCounter() {
  const left = totalCandles - outCount;
  counterEl.textContent =
    left > 0 ? `🕯️ ${left} candle${left !== 1 ? "s" : ""} left` : "";
}

function resetBirthday() {
  outCount = 0;
  document.querySelectorAll(".candle").forEach((c) => {
    c.classList.remove("out");
    const s = c.querySelector(".smoke");
    if (s) s.style.animation = "";
  });
  // ▸ Wish stays visible once shown — we never remove .show
  blowBtn.textContent = "🌬️ Blow the Candles!";
  blowBtn.classList.remove("done");
  updateCounter();
}

blowBtn.addEventListener("click", () => {
  if (outCount >= totalCandles) return;

  const alive = document.querySelectorAll(".candle:not(.out)");
  if (!alive.length) return;

  const pick = alive[Math.floor(Math.random() * alive.length)];
  pick.classList.add("out");

  // Restart smoke animation
  const smoke = pick.querySelector(".smoke");
  smoke.style.animation = "none";
  void smoke.offsetWidth; // force reflow
  smoke.style.animation = "smokeDrift 1.5s ease-out forwards";

  outCount++;

  if (outCount >= totalCandles) {
    blowBtn.textContent = "🎉 All Out!";
    blowBtn.classList.add("done");
    wishEl.classList.add("show");
    counterEl.textContent = "🎊 All candles blown!";
    launchBalloons(14);
    launchConfettiBurst(200);
    launchFireworks();
  } else {
    blowBtn.textContent = "🌬️ Blow Again!";
    updateCounter();
  }
});

/* ══════════════════════════════════════════
   BALLOONS
   ══════════════════════════════════════════ */
const bCvs = document.getElementById("balloon-canvas");
const bCtx = bCvs.getContext("2d");
let balloons = [];
const B_COLORS = [
  "#ff4da6",
  "#ffd700",
  "#43e97b",
  "#38b6ff",
  "#d63aff",
  "#ff9900",
  "#ff6060",
  "#aaf0d1",
];

function resizeB() {
  bCvs.width = innerWidth;
  bCvs.height = innerHeight;
}
resizeB();
window.addEventListener("resize", resizeB);

function mkBalloon(ambient) {
  return {
    x: Math.random() * innerWidth,
    y: innerHeight + 70,
    r: 26 + Math.random() * 18,
    color: B_COLORS[Math.floor(Math.random() * B_COLORS.length)],
    speed: ambient ? 0.5 + Math.random() * 0.6 : 1.4 + Math.random() * 1.4,
    sway: Math.random() * Math.PI * 2,
    swayA: 0.5 + Math.random() * 0.9,
    swayS: 0.012 + Math.random() * 0.018,
    opacity: ambient ? 0.6 : 0,
    ambient,
    delay: 0,
    _t: Date.now(),
  };
}

function launchBalloons(n) {
  for (let i = 0; i < n; i++) {
    const b = mkBalloon(false);
    b.delay = i * 110;
    balloons.push(b);
  }
}

function drawBalloon(b) {
  bCtx.save();
  bCtx.globalAlpha = b.opacity;
  const g = bCtx.createRadialGradient(
    b.x - b.r * 0.32,
    b.y - b.r * 0.32,
    b.r * 0.08,
    b.x,
    b.y,
    b.r,
  );
  g.addColorStop(0, "#fffc");
  g.addColorStop(0.28, b.color + "ee");
  g.addColorStop(1, b.color + "88");
  bCtx.beginPath();
  bCtx.ellipse(b.x, b.y, b.r, b.r * 1.22, 0, 0, Math.PI * 2);
  bCtx.fillStyle = g;
  bCtx.fill();
  // Knot
  bCtx.beginPath();
  bCtx.moveTo(b.x, b.y + b.r * 1.22);
  bCtx.quadraticCurveTo(b.x + 5, b.y + b.r * 1.4, b.x, b.y + b.r * 1.5);
  bCtx.strokeStyle = b.color;
  bCtx.lineWidth = 2.5;
  bCtx.stroke();
  // String
  bCtx.beginPath();
  bCtx.moveTo(b.x, b.y + b.r * 1.5);
  for (let i = 0; i < 28; i++)
    bCtx.lineTo(
      b.x + Math.sin(i * 0.5 + b.sway) * 4,
      b.y + b.r * 1.5 + i * 3.2,
    );
  bCtx.strokeStyle = b.color + "88";
  bCtx.lineWidth = 1;
  bCtx.stroke();
  bCtx.restore();
}

let ambTimer = 0;
function bLoop(now) {
  bCtx.clearRect(0, 0, bCvs.width, bCvs.height);
  if (now - ambTimer > 4000 && balloons.filter((b) => b.ambient).length < 4) {
    balloons.push(mkBalloon(true));
    ambTimer = now;
  }
  balloons.forEach((b) => {
    if (b.delay && Date.now() - b._t < b.delay) return;
    b.opacity = Math.min(b.ambient ? 0.6 : 1, b.opacity + 0.022);
    b.y -= b.speed;
    b.sway += b.swayS;
    b.x += Math.sin(b.sway) * b.swayA;
  });
  balloons = balloons.filter((b) => b.y > -130);
  balloons.forEach(drawBalloon);
  requestAnimationFrame(bLoop);
}
requestAnimationFrame(bLoop);
setTimeout(() => launchBalloons(3), 800);

/* ══════════════════════════════════════════
   CONFETTI
   ══════════════════════════════════════════ */
const cCvs = document.getElementById("confetti-canvas");
const cCtx = cCvs.getContext("2d");
let pieces = [];
const C_COLORS = [
  "#ff4da6",
  "#ffd700",
  "#43e97b",
  "#38b6ff",
  "#d63aff",
  "#ff9900",
  "#fff",
  "#ff6060",
  "#aaf0d1",
];

function resizeC() {
  cCvs.width = innerWidth;
  cCvs.height = innerHeight;
}
resizeC();
window.addEventListener("resize", resizeC);

function mkPiece(x, y, fast) {
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * (fast ? 12 : 9),
    vy: -(Math.random() * (fast ? 16 : 13) + 5),
    w: 7 + Math.random() * 9,
    h: 4 + Math.random() * 5,
    color: C_COLORS[Math.floor(Math.random() * C_COLORS.length)],
    rot: Math.random() * Math.PI * 2,
    rs: (Math.random() - 0.5) * 0.28,
    g: fast ? 0.25 : 0.3,
    op: 1,
    shape: Math.random() < 0.5 ? "rect" : "circle",
  };
}

function launchConfettiBurst(n, cx, cy, fast) {
  const x = cx ?? innerWidth / 2;
  const y = cy ?? innerHeight * 0.38;
  for (let i = 0; i < n; i++) pieces.push(mkPiece(x, y, fast));
}

function launchEdge(n) {
  for (let i = 0; i < n; i++) {
    const p = mkPiece(Math.random() * innerWidth, 0);
    p.vy = Math.random() * 5 + 2;
    p.g = 0.2;
    pieces.push(p);
  }
}

function cLoop() {
  cCtx.clearRect(0, 0, cCvs.width, cCvs.height);
  pieces.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.g;
    p.vx *= 0.99;
    p.rot += p.rs;
    if (p.y > innerHeight * 0.75) p.op -= 0.02;
    cCtx.save();
    cCtx.globalAlpha = Math.max(0, p.op);
    cCtx.translate(p.x, p.y);
    cCtx.rotate(p.rot);
    cCtx.fillStyle = p.color;
    if (p.shape === "circle") {
      cCtx.beginPath();
      cCtx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
      cCtx.fill();
    } else {
      cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    }
    cCtx.restore();
  });
  pieces = pieces.filter((p) => p.op > 0);
  requestAnimationFrame(cLoop);
}
cLoop();

/* ══════════════════════════════════════════
   FIREWORKS
   ══════════════════════════════════════════

   ROOT-CAUSE FIX:
   The original code called  fCtx.arc(p.x, p.y, p.r * p.life, …)
   AFTER  p.life -= p.decay.  When p.life crossed zero and went slightly
   negative (e.g. −0.007), the arc radius became negative and the canvas
   threw a DOMException, which crashed fwLoop — killing the rAF chain and
   freezing the animation after just 1–2 bursts.

   Fix: decrement p.life first, then SKIP drawing (and physics) if
   p.life ≤ 0.  Also clamp the radius with Math.max(0.01, …) as a
   belt-and-suspenders guard.  A try/catch around the whole loop body
   ensures that even an unforeseen error never kills the rAF chain.
   ══════════════════════════════════════════ */

const fCvs = document.getElementById("firework-canvas");
const fCtx = fCvs.getContext("2d");
let shells = [];
let fwTrails = [];
let fireworksActive = false;
let fwSafetyTimer = null;

function resizeF() {
  fCvs.width = innerWidth;
  fCvs.height = innerHeight;
}
resizeF();
window.addEventListener("resize", resizeF);

const FW_COLORS = [
  "#ff4da6",
  "#ffd700",
  "#43e97b",
  "#38b6ff",
  "#d63aff",
  "#ff9900",
  "#ffffff",
  "#ff6060",
  "#aaf0d1",
  "#ffe0ff",
];

function mkShell(x, targetY) {
  return {
    x,
    y: fCvs.height,
    targetY,
    vy: -(fCvs.height - targetY) / 55,
    color: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)],
    trail: [],
    done: false,
  };
}

function burstShell(s) {
  const count = 65 + Math.floor(Math.random() * 40);
  const col = s.color;
  const col2 = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];

  // Main burst particles
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2.5 + Math.random() * 5;
    fwTrails.push({
      x: s.x,
      y: s.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: Math.random() < 0.5 ? col : col2,
      life: 1,
      decay: 0.018 + Math.random() * 0.018, // faster than original → shorter show
      r: 2.5 + Math.random() * 2,
      g: 0.09,
    });
  }

  // Sparkle ring
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    fwTrails.push({
      x: s.x,
      y: s.y,
      vx: Math.cos(angle) * 1.5,
      vy: Math.sin(angle) * 1.5,
      color: "#fff",
      life: 1,
      decay: 0.03,
      r: 1.5,
      g: 0.04,
    });
  }
}

function fwLoop() {
  try {
    /* ── Background fade (only while active) ── */
    if (fireworksActive) {
      fCtx.fillStyle = "rgba(19,4,38,0.13)";
      fCtx.fillRect(0, 0, fCvs.width, fCvs.height);
    } else {
      fCtx.clearRect(0, 0, fCvs.width, fCvs.height);
    }

    /* ── Rising shells ── */
    shells.forEach((s) => {
      if (s.done) return;
      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > 10) s.trail.shift();
      s.y += s.vy;

      s.trail.forEach((t, i) => {
        fCtx.save();
        fCtx.globalAlpha = (i / s.trail.length) * 0.5;
        fCtx.fillStyle = s.color;
        fCtx.beginPath();
        fCtx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        fCtx.fill();
        fCtx.restore();
      });

      if (s.y <= s.targetY) {
        burstShell(s);
        s.done = true;
      }
    });
    shells = shells.filter((s) => !s.done);

    /* ── Burst particles ── */
    fwTrails.forEach((p) => {
      // ▸ Decrement life FIRST — then skip if already dead.
      //   This prevents p.life from being negative when we draw,
      //   which was causing fCtx.arc() to throw on a negative radius.
      p.life -= p.decay;
      if (p.life <= 0) return;

      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.vy += p.g;

      fCtx.save();
      fCtx.globalAlpha = p.life;
      fCtx.fillStyle = p.color;
      fCtx.shadowBlur = 6;
      fCtx.shadowColor = p.color;
      fCtx.beginPath();
      // ▸ Math.max(0.01, …) ensures radius is never zero or negative
      fCtx.arc(p.x, p.y, Math.max(0.01, p.r * p.life), 0, Math.PI * 2);
      fCtx.fill();
      fCtx.restore();
    });
    fwTrails = fwTrails.filter((p) => p.life > 0);

    /* ── Completion check ── */
    if (fireworksActive && shells.length === 0 && fwTrails.length === 0) {
      _fireworksDone();
    }
  } catch (err) {
    /* Safety net: an unexpected error must never kill the rAF chain */
    console.warn("[fwLoop] caught error:", err);
    _fireworksDone();
  }

  requestAnimationFrame(fwLoop);
}
fwLoop();

/** Called once when the fireworks show is completely finished */
function _fireworksDone() {
  if (!fireworksActive) return; // guard against double-call
  fireworksActive = false;
  shells = [];
  fwTrails = [];
  fCtx.clearRect(0, 0, fCvs.width, fCvs.height);
  if (fwSafetyTimer) {
    clearTimeout(fwSafetyTimer);
    fwSafetyTimer = null;
  }
  setTimeout(resetBirthday, 900); // let the clear frame render before reset
}

function launchFireworks() {
  // Reset any leftover state from a previous show
  if (fwSafetyTimer) clearTimeout(fwSafetyTimer);
  shells = [];
  fwTrails = [];

  fireworksActive = true;
  fCtx.clearRect(0, 0, fCvs.width, fCvs.height);

  let count = 0;
  const POSITIONS = [0.2, 0.5, 0.8, 0.35, 0.65, 0.15, 0.85, 0.45, 0.7, 0.3];
  const TOTAL = 10; // 10 shells — snappier show than original 18

  function fire() {
    if (count >= TOTAL) return;
    const x = POSITIONS[count % POSITIONS.length] * innerWidth;
    const y = innerHeight * (0.08 + Math.random() * 0.3);
    shells.push(mkShell(x, y));
    count++;
    const delay = count < 4 ? 400 : count < 7 ? 320 : 250;
    setTimeout(fire, delay);
  }
  fire();

  // Extra confetti bursts during the show
  setTimeout(
    () => launchConfettiBurst(120, innerWidth * 0.3, innerHeight * 0.3, true),
    300,
  );
  setTimeout(
    () => launchConfettiBurst(120, innerWidth * 0.7, innerHeight * 0.3, true),
    700,
  );
  setTimeout(() => launchEdge(70), 500);

  // Absolute safety timeout — cleans up even if completion check somehow misses
  fwSafetyTimer = setTimeout(() => {
    if (fireworksActive) _fireworksDone();
  }, 9000);
}

/* ══════════════════════════════════════════
   PARTY POPPER BUTTON
   ══════════════════════════════════════════ */
const popperBtn = document.getElementById("popper-btn");
popperBtn.addEventListener("click", () => {
  [
    [innerWidth * 0.18, innerHeight * 0.45],
    [innerWidth * 0.82, innerHeight * 0.45],
    [innerWidth * 0.5, innerHeight * 0.25],
  ].forEach(([x, y]) => launchConfettiBurst(85, x, y));
  launchEdge(60);
  launchBalloons(4);

  popperBtn.textContent = "💥 BOOM!";
  popperBtn.style.transform = "scale(1.12)";
  setTimeout(() => {
    popperBtn.textContent = "🎉 Party Poppers!";
    popperBtn.style.transform = "";
  }, 650);
});
