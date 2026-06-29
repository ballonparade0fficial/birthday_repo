# 🎂 Happy Birthday Vauju!

An interactive birthday webpage with animated candles, fireworks, balloons, confetti, and side flowers.

---

## Project Structure

```
birthday/
├── index.html        — HTML structure & flower SVGs
├── css/
│   └── style.css     — All styles & animations
├── js/
│   └── app.js        — All interactive logic (candles, fireworks, balloons, confetti)
└── README.md
```

---

## Features

| Feature | Description |
|---|---|
| 🕯️ Candles | 7 colourful candles on a 3-tier cake. Click **Blow the Candles!** to extinguish them one by one. |
| 🎆 Fireworks | Fires when all candles are blown out. Auto-resets back to the initial state afterwards. |
| 🎈 Balloons | Float up continuously in the background; a burst launches when the candles go out. |
| 🎊 Confetti | Launches on the candle blow-out and via the **Party Poppers** button. |
| 🌸 Flowers | Six animated flowers decorating both sides of the screen. |
| 🎉 Party Poppers | Button always available to pop confetti and balloons at any time. |

---

## How to Use

Open `index.html` directly in any modern browser — no build tools or server needed.

```bash
# macOS quick-open
open birthday/index.html

# Or just drag-and-drop index.html into your browser
```

---

## Bug Fixes (v2)

### Fireworks getting stuck after 1–2 bursts
**Root cause:** The original code ran `p.life -= p.decay` and then immediately
called `fCtx.arc(…, p.r * p.life, …)`. When `p.life` went slightly negative
(e.g. `−0.007`), the arc radius became negative and the Canvas API threw a
`DOMException`. This killed the `requestAnimationFrame` loop entirely, freezing
the animation after just 1–2 firework bursts.

**Fix (in `js/app.js` → `fwLoop`):**
```js
// Decrement life FIRST — skip drawing if particle is already dead
p.life -= p.decay;
if (p.life <= 0) return;

// Clamp radius as a belt-and-suspenders guard
fCtx.arc(p.x, p.y, Math.max(0.01, p.r * p.life), 0, Math.PI * 2);
```

A `try/catch` wraps the entire loop body so that any future unexpected error
can never kill the animation chain.

### Page not returning to initial state after fireworks
Added `resetBirthday()` — called automatically ~900 ms after the last particle
dies (or after the 9-second safety timeout). It re-lights all candles, hides
the wish message, and resets the blow button.

### Flowers appearing half-cut
All six flower SVG `viewBox` heights were expanded (e.g. `"0 0 60 60"` →
`"0 0 60 68"`) so that leaves and stems that extend below `y = 60` are fully
visible. `overflow: visible` is also set on `.flower-svg` in CSS as an
additional guard.

---

## Customisation

- **Name** — Change every occurrence of `Vauju` in `index.html`.
- **Wish message** — Edit the `.wish` div content in `index.html`.
- **Candle count / colours** — Adjust `CANDLE_PALETTE` and the two
  `placeCandlesOnTier(…)` calls in `js/app.js`.
- **Cake colours** — Edit `.tier-top`, `.tier-mid`, `.tier-bottom` in
  `css/style.css`.
- **Fireworks shell count** — Change `TOTAL = 10` in `launchFireworks()`.
