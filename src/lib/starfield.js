// Canvas 2D starfield engine — ~8000 stars, 3 parallax layers, per-star twinkle,
// mouse drift, hero-star glow, DPR-aware, reduced-motion.
// Angepasst für ~1000 Sterne mit buntem Neon/Gold-Weiß-Mix.
const PALETTES = {
  white: [[234, 246, 255], [180, 230, 255], [255, 255, 255]],
  neon: [[34, 211, 238], [255, 53, 208], [182, 255, 59]],
  gold: [[255, 215, 106], [255, 190, 80]],
}

const LAYER = {
  white: { weight: 0.45, parallax: 0.12 },
  neon: { weight: 0.40, parallax: 0.30 },
  gold: { weight: 0.15, parallax: 0.55 },
}

/* Radius-Multiplikator: Sterne größer machen (weniger Sterne, dafür auffälliger) */
const RADIUS_SCALE = 2.0

const mod = (v, m) => ((v % m) + m) % m
const pick = (a) => a[(Math.random() * a.length) | 0]

function buildStars(count, w, h) {
  const stars = []
  const order = []
  for (const k of Object.keys(LAYER)) {
    const n = Math.round(count * LAYER[k].weight)
    for (let i = 0; i < n; i++) order.push(k)
  }
  while (order.length < count) order.push("white")
  for (let i = 0; i < order.length; i++) {
    const layer = order[i]
    const color = pick(PALETTES[layer])
    const baseR =
      layer === "gold"
        ? (0.9 + Math.random() * 1.6) * RADIUS_SCALE
        : layer === "neon"
          ? (0.7 + Math.random() * 1.2) * RADIUS_SCALE
          : (0.5 + Math.random() * 1.1) * RADIUS_SCALE
    const bright = Math.random() < 0.012 // ~1% hero stars
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: bright ? baseR * 1.4 : baseR,
      layer,
      p: LAYER[layer].parallax,
      color,
      bright,
      twPhase: Math.random() * Math.PI * 2,
      twSpeed: 0.8 + Math.random() * 3.0,
      depth: 0.35 + Math.random() * 0.65,
    })
  }
  return stars
}

export function initStarfield(canvas, count = 8000) {
  const ctx = canvas.getContext("2d")
  let w = 0,
    h = 0,
    dpr = 1,
    stars = [],
    raf = 0,
    running = true,
    scrollY = 0,
    mouseX = 0,
    mouseY = 0

  const reduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = innerWidth
    h = innerHeight
    canvas.width = (w * dpr) | 0
    canvas.height = (h * dpr) | 0
    canvas.style.width = w + "px"
    canvas.style.height = h + "px"
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    stars = buildStars(count, w, h)
  }

  const onScroll = () => {
    scrollY = window.scrollY || window.pageYOffset || 0
  }
  const onMouse = (e) => {
    mouseX = e.clientX / w - 0.5
    mouseY = e.clientY / h - 0.5
  }

  function drawStatic() {
    ctx.clearRect(0, 0, w, h)
    for (const s of stars) {
      const a = 0.75 * s.depth
      ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${a})`
      ctx.fillRect(s.x, s.y, s.r, s.r)
    }
  }

  let t = 0
  function frame() {
    if (!running) return
    t += 0.016
    const sy = scrollY
    ctx.clearRect(0, 0, w, h)
    for (const s of stars) {
      const offY = sy * s.p - mouseY * s.p * 40
      const offX = -mouseX * s.p * 40
      const rx = mod(s.x + offX, w)
      const ry = mod(s.y - offY, h)
      const tw = 0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * s.twSpeed + s.twPhase))
      const a = tw * s.depth
      ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${a})`
      ctx.fillRect(rx, ry, s.r, s.r)
      if (s.bright && tw > 0.55) {
        ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${a * 0.25})`
        ctx.fillRect(rx - s.r, ry - s.r, s.r * 3, s.r * 3)
      }
    }
    raf = requestAnimationFrame(frame)
  }

  function start() {
    reduce ? (drawStatic(), (running = false)) : (running = true, (raf = requestAnimationFrame(frame)))
  }
  function stop() {
    running = false
    cancelAnimationFrame(raf)
  }

  resize()
  start()
  addEventListener("resize", resize)
  addEventListener("scroll", onScroll, { passive: true })
  addEventListener("mousemove", onMouse, { passive: true })

  return {
    stop,
    setCount(n) {
      count = n
      stars = buildStars(count, w, h)
    },
    destroy() {
      stop()
      removeEventListener("resize", resize)
      removeEventListener("scroll", onScroll)
      removeEventListener("mousemove", onMouse)
      canvas.width = canvas.height = 0
    },
  }
}
