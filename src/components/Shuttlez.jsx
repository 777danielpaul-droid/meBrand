import { useRef, useEffect } from "react"

/**
 * Shuttlez — minimalistisches Canvas-Overlay für den Hero-Bereich.
 *
 * Alles was den Hero-Bereich verdeckt (body-bg, game-container-bg,
 * Sternenhintergrund, UI-Overlays) wurde entfernt.  Das Canvas ist
 * komplett transparent; nur die zwei Schiffe, Laser und Partikel
 * werden gezeichnet, sodass der dahinterliegende Hero sichtbar bleibt.
 *
 * @param {object} props
 * @param {number} [props.shipScale=1.6]  Skalierung der Schiffe
 */
export default function Shuttlez({ shipScale = 1.6, className = "hidden sm:block" }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  // Hilfsfunktion: Hex-Farbe → rgba mit Alpha (für Glow-Effekte auf transparentem Canvas)
  const hexWithAlpha = (hex, alpha) => {
    const h = hex.replace("#", "")
    const r = parseInt(h.substring(0, 2), 16)
    const g = parseInt(h.substring(2, 4), 16)
    const b = parseInt(h.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Canvas immer über die volle Hero-Fläche großziehen.
    // width/height-Attributes nur für das Pixel-Grid, NICHT für das Layout —
    // das Layout läuft über CSS (inset-0 h-full w-full), damit kein CLS entsteht.
    const resize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width || 1280
      canvas.height = rect.height || 720
    }
    // Verzögertes resize: nach dem ersten Paint, wenn das Hero-Layout steht.
    // Ohne direkten resize(): parentElement.getBoundingClientRect() kann 0×0
    // zurückgeben, wenn das Layout noch nicht berechnet ist → Schiffe bei (0,0) unsichtbar.
    requestAnimationFrame(resize)
    // Sofortiger resize für korrekte Initialisierung der Schiffspositionen:
    resize()
    window.addEventListener("resize", resize)

    /* ------------------------------------------------------------------
     *  State — bewusst minimal gehalten, Hintergrund-Elemente weggelassen
     * ------------------------------------------------------------------ */
    const stars = [] // leer — Sternenhintergrund entfernt
    let mouseX = canvas.width / 2
    let mouseY = canvas.height / 2
    let mouseDown = false

    const container = canvas.parentElement
    container.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    })
    container.addEventListener("mousedown", () => (mouseDown = true))
    container.addEventListener("mouseup", () => (mouseDown = false))
    container.addEventListener("mouseleave", () => (mouseDown = false))

    const player = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      angle: 0,
      cooldown: 0,
      maxCooldown: 20,
      color: "#00e5ff",
      trail: [],
    }

    const npc = {
      x: canvas.width * 0.8,
      y: canvas.height * 0.2,
      angle: 0,
      cooldown: 0,
      maxCooldown: 35,
      color: "#c084fc",
      trail: [],
      targetOffset: { x: 0, y: 0 },
      offsetTimer: 0,
      alive: true,
      respawnTimer: 0,
      respawnDelay: 180,
    }

    let lasers = []
    let particles = []
    let score = 0
    let frame = 0

    /* ------------------------------------------------------------------
     *  Render-Helfer
     * ------------------------------------------------------------------ */
    function drawShip(x, y, angle, color, thrust) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)

      ctx.scale(shipScale, shipScale)

      // Ship body (triangle)
      ctx.beginPath()
      ctx.moveTo(18, 0)
      ctx.lineTo(-12, 10)
      ctx.lineTo(-8, 0)
      ctx.lineTo(-12, -10)
      ctx.closePath()
      ctx.fillStyle = color
      ctx.fill()

      // Cockpit
      ctx.beginPath()
      ctx.ellipse(2, 0, 5, 3, 0, 0, Math.PI * 2)
      ctx.fillStyle = "#ffffff"
      ctx.fill()

      if (thrust) {
        // Engine flames — mehrere Layer für Glow
        ctx.fillStyle = hexWithAlpha("#ffaa00", 0.4)
        ctx.beginPath()
        ctx.moveTo(-10, 4)
        ctx.lineTo(-22 - Math.random() * 8, 0)
        ctx.lineTo(-10, -4)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = hexWithAlpha("#ffaa00", 0.6)
        ctx.beginPath()
        ctx.moveTo(-8, 3)
        ctx.lineTo(-18 - Math.random() * 5, 0)
        ctx.lineTo(-8, -3)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
    }

    function spawnLaser(from, angle, color, isPlayer) {
      lasers.push({
        x: from.x + Math.cos(angle) * 20,
        y: from.y + Math.sin(angle) * 20,
        vx: Math.cos(angle) * 9,
        vy: Math.sin(angle) * 9,
        color: color,
        life: 80,
        isPlayer: isPlayer,
      })
    }

    function spawnParticles(x, y, color, count, speedMult) {
      speedMult = speedMult || 1
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        const s = (Math.random() * 3 + 1) * speedMult
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s,
          life: 40,
          color: color,
          size: Math.random() * 3 + 1,
        })
      }
    }

    function respawnNPC() {
      npc.x = Math.random() > 0.5 ? -50 : canvas.width + 50
      npc.y = Math.random() * canvas.height
      npc.alive = true
      npc.cooldown = npc.maxCooldown
      npc.respawnTimer = 0
      npc.trail = []
    }

    /* ------------------------------------------------------------------
     *  Haupt-Loop — Hintergrund-Schwarz wird durch transparent
     *  (clearRect ohne Füllung) ersetzt, damit der Hero sichtbar bleibt.
     * ------------------------------------------------------------------ */
    function loop() {
      frame++

      // Transparentes Löschen — NICHT mit rgba(0,0,0,0.25) füllen!
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Sterne: absichtlich übersprungen (transparent)

      const dx = mouseX - player.x
      const dy = mouseY - player.y
      player.x += dx * 0.08
      player.y += dy * 0.08
      player.angle = Math.atan2(dy, dx)

      player.trail.push({ x: player.x, y: player.y })
      if (player.trail.length > 12) player.trail.shift()

      if (npc.alive) {
        npc.offsetTimer++
        if (npc.offsetTimer > 120) {
          npc.targetOffset = {
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
          }
          npc.offsetTimer = 0
        }
        const targetX = mouseX + npc.targetOffset.x
        const targetY = mouseY + npc.targetOffset.y
        npc.x += (targetX - npc.x) * 0.015
        npc.y += (targetY - npc.y) * 0.015
        const ndx = mouseX - npc.x
        const ndy = mouseY - npc.y
        npc.angle = Math.atan2(ndy, ndx)

        npc.trail.push({ x: npc.x, y: npc.y })
        if (npc.trail.length > 12) npc.trail.shift()
      } else {
        npc.respawnTimer++
        if (npc.respawnTimer >= npc.respawnDelay) respawnNPC()
      }

      // Trails
      for (let i = 0; i < player.trail.length - 1; i++) {
        ctx.beginPath()
        ctx.moveTo(player.trail[i].x, player.trail[i].y)
        ctx.lineTo(player.trail[i + 1].x, player.trail[i + 1].y)
        ctx.strokeStyle = `rgba(0,229,255,${(i / player.trail.length) * 0.4})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
      if (npc.alive) {
        for (let i = 0; i < npc.trail.length - 1; i++) {
          ctx.beginPath()
          ctx.moveTo(npc.trail[i].x, npc.trail[i].y)
          ctx.lineTo(npc.trail[i + 1].x, npc.trail[i + 1].y)
          ctx.strokeStyle = `rgba(192,132,252,${(i / npc.trail.length) * 0.4})`
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }

      // Lasers
      if (mouseDown && player.cooldown <= 0) {
        spawnLaser(player, player.angle, player.color, true)
        player.cooldown = player.maxCooldown
        spawnParticles(player.x, player.y, player.color, 5)
      }
      if (player.cooldown > 0) player.cooldown--

      if (npc.alive) {
        const distToPlayer = Math.hypot(mouseX - npc.x, mouseY - npc.y)
        if (npc.cooldown <= 0 && distToPlayer < 400 && Math.random() < 0.03) {
          spawnLaser(npc, npc.angle, npc.color, false)
          npc.cooldown = npc.maxCooldown
          spawnParticles(npc.x, npc.y, npc.color, 5)
        }
        if (npc.cooldown > 0) npc.cooldown--
      }

      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i]
        l.x += l.vx
        l.y += l.vy
        l.life--

        ctx.save()
        ctx.strokeStyle = l.color
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(l.x, l.y)
        ctx.lineTo(l.x - l.vx * 2, l.y - l.vy * 2)
        ctx.stroke()

        // Glow-Layer (mehrere dicke Striche mit reduzierter Alpha)
        ctx.strokeStyle = hexWithAlpha(l.color, 0.25)
        ctx.lineWidth = 6
        ctx.beginPath()
        ctx.moveTo(l.x - l.vx * 0.5, l.y - l.vy * 0.5)
        ctx.lineTo(l.x - l.vx * 2.5, l.y - l.vy * 2.5)
        ctx.stroke()

        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(l.x, l.y)
        ctx.lineTo(l.x - l.vx, l.y - l.vy)
        ctx.stroke()
        ctx.restore()

        if (l.isPlayer && npc.alive) {
          const d = Math.hypot(l.x - npc.x, l.y - npc.y)
          if (d < 18) {
            spawnParticles(npc.x, npc.y, "#00e5ff", 30, 2.5)
            spawnParticles(npc.x, npc.y, "#8a2be2", 20, 2)
            spawnParticles(npc.x, npc.y, "#ffaa00", 15, 1.8)
            score++
            npc.alive = false
            npc.respawnTimer = 0
            lasers.splice(i, 1)
            continue
          }
        }
        if (!l.isPlayer) {
          const d = Math.hypot(l.x - mouseX, l.y - mouseY)
          if (d < 18) {
            spawnParticles(mouseX, mouseY, "#00e5ff", 12)
            lasers.splice(i, 1)
            continue
          }
        }

        if (
          l.life <= 0 ||
          l.x < -50 ||
          l.x > canvas.width + 50 ||
          l.y < -50 ||
          l.y > canvas.height + 50
        ) {
          lasers.splice(i, 1)
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life--
        p.vx *= 0.95
        p.vy *= 0.95
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        const alpha = p.life / 40
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        // Hellere Kern (wie RocketBeam Particle) — silber-weißer Akzent
        ctx.globalAlpha = alpha * 0.8
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.45, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      drawShip(player.x, player.y, player.angle, player.color, true)
      if (npc.alive) drawShip(npc.x, npc.y, npc.angle, npc.color, true)

      // Cursor-Zielhilfe (zweistrich-kreuz) — transparentes SVG bleibt erhalten
      ctx.strokeStyle = "rgba(0,229,255,0.4)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(mouseX, mouseY, 14, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(mouseX - 20, mouseY)
      ctx.lineTo(mouseX + 20, mouseY)
      ctx.moveTo(mouseX, mouseY - 20)
      ctx.lineTo(mouseX, mouseY + 20)
      ctx.stroke()

      rafRef.current = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      window.removeEventListener("resize", resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [shipScale])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ zIndex: 2 }}
      data-shuttlez="true"
    />
  )
}