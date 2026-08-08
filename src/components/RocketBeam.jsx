import { useRef, useEffect, useCallback } from 'react'

const ROTATION = -Math.PI / 5

function pulse(t) {
  return 0.5 + 0.5 * Math.sin(t * 3.0) + 0.25 * Math.sin(t * 7.2 + 1.0) + 0.15 * Math.sin(t * 11.5 + 2.3)
}

function flicker(t) {
  return 0.7 + 0.3 * Math.sin(t * 9.0) + 0.2 * Math.sin(t * 17.3 + 0.7)
}

class Particle {
  constructor(x, y, isBeam, time) {
    this.x = x
    this.y = y
    this.isBeam = isBeam
    const spread = isBeam ? 0.15 : 1.0
    const angle = (Math.random() - 0.5) * spread
    const speed = isBeam ? Math.random() * 1.0 + 0.5 : Math.random() * 1.5 + 0.3
    this.vx = Math.sin(angle) * speed
    this.vy = isBeam ? Math.cos(angle) * speed + 0.8 : Math.random() * 1.0 + 0.3
    this.life = 1.0
    this.decay = isBeam ? Math.random() * 0.003 + 0.001 : Math.random() * 0.006 + 0.002
    this.size = isBeam ? Math.random() * 3.5 + 1.0 : Math.random() * 2.5 + 0.8
    this.birthTime = time

    const hue = isBeam ? 210 + Math.random() * 25 : 225 + Math.random() * 60
    const sat = 70 + Math.random() * 30
    const light = isBeam ? 55 + Math.random() * 35 : 45 + Math.random() * 45
    this.baseColor = { h: hue, s: sat, l: light }
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.life -= this.decay
    if (!this.isBeam) {
      this.vx *= 0.992
      this.vy *= 0.997
    }
  }

  draw(ctx, t) {
    const p = pulse(t + this.birthTime)
    const f = flicker(t + this.birthTime)
    const alpha = Math.max(0, this.life * p * f)
    const s = this.size * this.life * (0.8 + 0.4 * p)

    const h = this.baseColor.h
    const s_ = this.baseColor.s
    const l = Math.min(98, this.baseColor.l + 20 * p)

    ctx.beginPath()
    ctx.arc(this.x, this.y, s, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${h}, ${s_}%, ${l}%, ${alpha})`
    ctx.fill()

    if (this.isBeam && alpha > 0.2) {
      ctx.beginPath()
      ctx.arc(this.x, this.y, s * 0.4, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${h + 15}, ${s_}%, ${Math.min(100, l + 25)}%, ${alpha * 0.7})`
      ctx.fill()
    }
  }
}

function drawFighter(ctx, t, running) {
  const bodyW = 32
  const bodyH = 95
  const noseH = 35
  const wingSpan = 65
  const topY = -bodyH - noseH
  const bottomY = 40

  // Ambient glow
  if (running && t !== undefined) {
    const p = pulse(t)
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 90 + 25 * p)
    glow.addColorStop(0, `rgba(80, 60, 180, ${0.08 * p})`)
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(-100, topY - 30, 200, bodyH + noseH + 100)
  }

  // === MAIN FUSELAGE ===
  const bodyGrad = ctx.createLinearGradient(-bodyW, 0, bodyW, 0)
  bodyGrad.addColorStop(0, '#12121e')
  bodyGrad.addColorStop(0.25, '#1e1e32')
  bodyGrad.addColorStop(0.5, '#2a2a42')
  bodyGrad.addColorStop(0.75, '#1e1e32')
  bodyGrad.addColorStop(1, '#12121e')

  ctx.beginPath()
  ctx.moveTo(-bodyW / 2, bottomY - 15)
  ctx.lineTo(-bodyW / 2, topY + noseH + 10)
  ctx.lineTo(-bodyW / 3, topY + 5)
  ctx.lineTo(0, topY)
  ctx.lineTo(bodyW / 3, topY + 5)
  ctx.lineTo(bodyW / 2, topY + noseH + 10)
  ctx.lineTo(bodyW / 2, bottomY - 15)
  ctx.quadraticCurveTo(bodyW / 2, bottomY, 0, bottomY + 5)
  ctx.quadraticCurveTo(-bodyW / 2, bottomY, -bodyW / 2, bottomY - 15)
  ctx.closePath()
  ctx.fillStyle = bodyGrad
  ctx.fill()
  ctx.strokeStyle = 'rgba(100, 80, 200, 0.15)'
  ctx.lineWidth = 1
  ctx.stroke()

  // === COCKPIT ===
  const cpGrad = ctx.createRadialGradient(-3, topY + 22, 0, 0, topY + 25, 14)
  cpGrad.addColorStop(0, '#3a5a90')
  cpGrad.addColorStop(0.4, '#1a3060')
  cpGrad.addColorStop(1, '#0a1530')

  ctx.beginPath()
  ctx.moveTo(-10, topY + 18)
  ctx.quadraticCurveTo(-12, topY + 30, -8, topY + 38)
  ctx.lineTo(8, topY + 38)
  ctx.quadraticCurveTo(12, topY + 30, 10, topY + 18)
  ctx.quadraticCurveTo(0, topY + 14, -10, topY + 18)
  ctx.closePath()
  ctx.fillStyle = cpGrad
  ctx.fill()
  ctx.strokeStyle = 'rgba(80, 140, 255, 0.4)'
  ctx.lineWidth = 1.2
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(0, topY + 16)
  ctx.lineTo(0, topY + 37)
  ctx.strokeStyle = 'rgba(60, 100, 200, 0.3)'
  ctx.lineWidth = 0.8
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(-4, topY + 22, 2, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(100, 200, 255, 0.6)'
  ctx.fill()

  // === SWEPT WINGS ===
  const wingGradR = ctx.createLinearGradient(0, 0, wingSpan, 0)
  wingGradR.addColorStop(0, '#1a1a2e')
  wingGradR.addColorStop(0.5, '#252540')
  wingGradR.addColorStop(1, '#1e1e35')

  ctx.beginPath()
  ctx.moveTo(bodyW / 2 - 2, 15)
  ctx.lineTo(bodyW / 2 - 2, -5)
  ctx.lineTo(wingSpan, 35)
  ctx.lineTo(wingSpan - 8, 48)
  ctx.lineTo(bodyW / 2 + 5, 55)
  ctx.lineTo(bodyW / 2 - 2, 55)
  ctx.closePath()
  ctx.fillStyle = wingGradR
  ctx.fill()
  ctx.strokeStyle = 'rgba(100, 80, 200, 0.2)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(bodyW / 2 - 2, -5)
  ctx.lineTo(wingSpan, 35)
  ctx.strokeStyle = running && t !== undefined ? `rgba(100, 150, 255, ${0.4 + 0.3 * pulse(t)})` : 'rgba(80, 120, 220, 0.25)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  const wingGradL = ctx.createLinearGradient(0, 0, -wingSpan, 0)
  wingGradL.addColorStop(0, '#1a1a2e')
  wingGradL.addColorStop(0.5, '#252540')
  wingGradL.addColorStop(1, '#1e1e35')

  ctx.beginPath()
  ctx.moveTo(-bodyW / 2 + 2, 15)
  ctx.lineTo(-bodyW / 2 + 2, -5)
  ctx.lineTo(-wingSpan, 35)
  ctx.lineTo(-wingSpan + 8, 48)
  ctx.lineTo(-bodyW / 2 - 5, 55)
  ctx.lineTo(-bodyW / 2 + 2, 55)
  ctx.closePath()
  ctx.fillStyle = wingGradL
  ctx.fill()
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(-bodyW / 2 + 2, -5)
  ctx.lineTo(-wingSpan, 35)
  ctx.strokeStyle = running && t !== undefined ? `rgba(100, 150, 255, ${0.4 + 0.3 * pulse(t)})` : 'rgba(80, 120, 220, 0.25)'
  ctx.lineWidth = 1.5
  ctx.stroke()

  // === VERTICAL STABILIZERS ===
  ;[-18, 18].forEach((sx) => {
    const side = sx > 0 ? 1 : -1
    const tailGrad = ctx.createLinearGradient(sx, 0, sx + side * 8, 0)
    tailGrad.addColorStop(0, '#1e1e32')
    tailGrad.addColorStop(1, '#2a2a45')

    ctx.beginPath()
    ctx.moveTo(sx, 10)
    ctx.lineTo(sx + side * 3, -35)
    ctx.lineTo(sx + side * 8, -30)
    ctx.lineTo(sx + side * 5, 15)
    ctx.closePath()
    ctx.fillStyle = tailGrad
    ctx.fill()
    ctx.strokeStyle = 'rgba(100, 80, 200, 0.2)'
    ctx.lineWidth = 0.8
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(sx + side * 3, -35)
    ctx.lineTo(sx + side * 8, -30)
    ctx.strokeStyle = running && t !== undefined ? `rgba(140, 100, 255, ${0.3 + 0.2 * pulse(t)})` : 'rgba(120, 80, 220, 0.2)'
    ctx.lineWidth = 1
    ctx.stroke()
  })

  // === ENGINE NACELLES ===
  const engines = []
  ;[-14, 14].forEach((ex) => {
    const nacGrad = ctx.createLinearGradient(ex - 10, 0, ex + 10, 0)
    nacGrad.addColorStop(0, '#161626')
    nacGrad.addColorStop(0.5, '#222238')
    nacGrad.addColorStop(1, '#161626')

    ctx.beginPath()
    ctx.moveTo(ex - 9, bottomY - 20)
    ctx.lineTo(ex - 7, bottomY + 5)
    ctx.lineTo(ex + 7, bottomY + 5)
    ctx.lineTo(ex + 9, bottomY - 20)
    ctx.closePath()
    ctx.fillStyle = nacGrad
    ctx.fill()
    ctx.strokeStyle = 'rgba(100, 80, 200, 0.15)'
    ctx.lineWidth = 0.8
    ctx.stroke()

    ctx.beginPath()
    ctx.ellipse(ex, bottomY + 5, 8, 3, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#0a0a15'
    ctx.fill()
    ctx.strokeStyle = 'rgba(120, 80, 255, 0.3)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.beginPath()
    ctx.ellipse(ex, bottomY + 5, 6, 2.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = running && t !== undefined ? `rgba(140, 100, 255, ${0.3 * pulse(t)})` : 'rgba(80, 60, 180, 0.15)'
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(ex - 5, bottomY + 5)
    ctx.lineTo(ex - 3, bottomY + 10)
    ctx.lineTo(ex + 3, bottomY + 10)
    ctx.lineTo(ex + 5, bottomY + 5)
    ctx.closePath()
    ctx.fillStyle = '#0a0a12'
    ctx.fill()
    ctx.strokeStyle = 'rgba(100, 80, 200, 0.2)'
    ctx.stroke()

    engines.push({ x: ex, y: bottomY + 12 })
  })

  // === PANEL LINES & DETAILS ===
  ctx.beginPath()
  ctx.moveTo(0, topY + noseH + 5)
  ctx.lineTo(0, bottomY - 25)
  ctx.strokeStyle = 'rgba(100, 80, 200, 0.12)'
  ctx.lineWidth = 1
  ctx.stroke()

  ;[-20, 0, 20].forEach((py) => {
    ctx.beginPath()
    ctx.moveTo(-bodyW / 2 + 3, py)
    ctx.lineTo(bodyW / 2 - 3, py)
    ctx.strokeStyle = 'rgba(100, 80, 200, 0.08)'
    ctx.lineWidth = 0.6
    ctx.stroke()
  })

  ctx.beginPath()
  ctx.moveTo(-8, -15)
  ctx.lineTo(-4, -19)
  ctx.lineTo(0, -15)
  ctx.lineTo(0, -7)
  ctx.lineTo(-4, -3)
  ctx.lineTo(-8, -7)
  ctx.closePath()
  ctx.strokeStyle = running && t !== undefined ? `rgba(120, 100, 255, ${0.15 + 0.1 * pulse(t)})` : 'rgba(100, 80, 200, 0.1)'
  ctx.lineWidth = 0.8
  ctx.stroke()

  ;[
    [-6, 30],
    [6, 30],
    [-10, -5],
    [10, -5],
  ].forEach(([lx, ly]) => {
    ctx.beginPath()
    ctx.arc(lx, ly, 1.5, 0, Math.PI * 2)
    ctx.fillStyle = running && t !== undefined ? `rgba(100, 200, 255, ${0.5 + 0.3 * pulse(t)})` : 'rgba(80, 160, 255, 0.3)'
    ctx.fill()
  })

  ;[-wingSpan + 15, wingSpan - 15].forEach((wx) => {
    ctx.beginPath()
    ctx.moveTo(wx, 42)
    ctx.lineTo(wx, 55)
    ctx.lineTo(wx + (wx > 0 ? -3 : 3), 58)
    ctx.lineTo(wx + (wx > 0 ? -2 : 2), 45)
    ctx.closePath()
    ctx.fillStyle = '#1a1a28'
    ctx.fill()
    ctx.strokeStyle = 'rgba(100, 80, 200, 0.15)'
    ctx.lineWidth = 0.5
    ctx.stroke()
  })

  ctx.beginPath()
  ctx.arc(0, topY + 2, 2, 0, Math.PI * 2)
  ctx.fillStyle = running && t !== undefined ? `rgba(180, 150, 255, ${0.3 + 0.2 * pulse(t)})` : 'rgba(140, 120, 220, 0.15)'
  ctx.fill()

  return engines
}

function drawEngineGlow(ctx, ex, ey, t, running) {
  if (!running) return
  const p = pulse(t)
  const f = flicker(t)
  const glowR = 28 + 22 * p
  const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, glowR)
  glow.addColorStop(0, `rgba(200, 130, 255, ${0.9 * p * f})`)
  glow.addColorStop(0.3, `rgba(120, 80, 240, ${0.4 * p})`)
  glow.addColorStop(0.7, `rgba(60, 40, 180, ${0.15 * p})`)
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(ex - glowR, ey - glowR, glowR * 2, glowR * 2)
}

function drawBeam(ctx, ex, ey, t, running) {
  if (!running) return
  const p = pulse(t)
  const f = flicker(t)
  const beamLen = 500

  const beamGrad1 = ctx.createLinearGradient(ex, ey, ex, ey + beamLen)
  beamGrad1.addColorStop(0, `rgba(170, 120, 255, ${0.85 * p * f})`)
  beamGrad1.addColorStop(0.1, `rgba(110, 80, 255, ${0.6 * p})`)
  beamGrad1.addColorStop(0.35, `rgba(60, 80, 220, ${0.3 * p})`)
  beamGrad1.addColorStop(0.65, `rgba(30, 45, 150, ${0.12 * p})`)
  beamGrad1.addColorStop(1, 'rgba(8, 10, 40, 0)')

  const w1 = 5 + 3 * p
  const w1b = 2 + 1.5 * p
  ctx.beginPath()
  ctx.moveTo(ex - w1, ey)
  ctx.lineTo(ex + w1, ey)
  ctx.lineTo(ex + w1b, ey + beamLen)
  ctx.lineTo(ex - w1b, ey + beamLen)
  ctx.closePath()
  ctx.fillStyle = beamGrad1
  ctx.fill()

  const beamGrad2 = ctx.createLinearGradient(ex, ey, ex, ey + beamLen * 0.9)
  beamGrad2.addColorStop(0, `rgba(200, 160, 255, ${0.6 * p * f})`)
  beamGrad2.addColorStop(0.2, `rgba(140, 110, 255, ${0.35 * p})`)
  beamGrad2.addColorStop(0.5, `rgba(80, 70, 220, ${0.15 * p})`)
  beamGrad2.addColorStop(1, 'rgba(20, 20, 80, 0)')

  const w2 = 2.5 + 1.5 * p
  const w2b = 1 + 0.8 * p
  ctx.beginPath()
  ctx.moveTo(ex - w2, ey)
  ctx.lineTo(ex + w2, ey)
  ctx.lineTo(ex + w2b, ey + beamLen * 0.9)
  ctx.lineTo(ex - w2b, ey + beamLen * 0.9)
  ctx.closePath()
  ctx.fillStyle = beamGrad2
  ctx.fill()

  const coreGrad = ctx.createLinearGradient(ex, ey, ex, ey + beamLen * 0.6)
  coreGrad.addColorStop(0, `rgba(240, 210, 255, ${0.7 * p * f})`)
  coreGrad.addColorStop(0.15, `rgba(190, 150, 255, ${0.4 * p})`)
  coreGrad.addColorStop(0.4, `rgba(120, 90, 240, ${0.18 * p})`)
  coreGrad.addColorStop(1, 'rgba(40, 30, 120, 0)')

  const wc = 1.2 + 0.8 * p
  const wcb = 0.4 + 0.3 * p
  ctx.beginPath()
  ctx.moveTo(ex - wc, ey)
  ctx.lineTo(ex + wc, ey)
  ctx.lineTo(ex + wcb, ey + beamLen * 0.6)
  ctx.lineTo(ex - wcb, ey + beamLen * 0.6)
  ctx.closePath()
  ctx.fillStyle = coreGrad
  ctx.fill()
}

export default function RocketBeam() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const runningRef = useRef(true)  // Auto-start beim Mount

  const timeRef = useRef(0)
  const animIdRef = useRef(null)
  const particlesRef = useRef([])
  const beamParticlesRef = useRef([])

  const spawnParticles = useCallback((ex, ey) => {
    if (!runningRef.current) return
    const time = timeRef.current

    // Denser beams - more particles per frame
    for (let i = 0; i < 6; i++) {
      beamParticlesRef.current.push(
        new Particle(ex + (Math.random() - 0.5) * 3, ey + Math.random() * 2, true, time)
      )
    }

    for (let i = 0; i < 5; i++) {
      particlesRef.current.push(
        new Particle(ex + (Math.random() - 0.5) * 5, ey + 5 + Math.random() * 10, false, time)
      )
    }
  }, [])

  const animate = useCallback(() => {
    if (!runningRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    // Transparente Trail-Effekt: verblassen lassen, ohne dunklen Block
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)'
    ctx.fillRect(0, 0, W, H)
    ctx.globalCompositeOperation = 'source-over'

    timeRef.current += 0.016
    const t = timeRef.current

    const cx = W / 2
    const cy = H / 2 - 80

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(ROTATION)

    const engines = drawFighter(ctx, t, runningRef.current)

    engines.forEach((eng) => {
      drawEngineGlow(ctx, eng.x, eng.y, t, runningRef.current)
      drawBeam(ctx, eng.x, eng.y + 3, t, runningRef.current)
      spawnParticles(eng.x, eng.y + 3)
    })

    const beamParts = beamParticlesRef.current
    for (let i = beamParts.length - 1; i >= 0; i--) {
      beamParts[i].update()
      beamParts[i].draw(ctx, t)
      if (beamParts[i].life <= 0) beamParts.splice(i, 1)
    }

    const parts = particlesRef.current
    for (let i = parts.length - 1; i >= 0; i--) {
      parts[i].update()
      parts[i].draw(ctx, t)
      if (parts[i].life <= 0 || parts[i].y > 500) parts.splice(i, 1)
    }

    if (beamParts.length > 800) beamParts.splice(0, beamParts.length - 800)
    if (parts.length > 600) parts.splice(0, parts.length - 600)

    ctx.restore()

    animIdRef.current = requestAnimationFrame(animate)
  }, [spawnParticles])

  const drawStatic = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)'
    ctx.fillRect(0, 0, W, H)

    const cx = W / 2
    const cy = H / 2 - 80

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(ROTATION)
    drawFighter(ctx, 0, false)
    ctx.restore()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current

    function resize() {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      drawStatic()
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [drawStatic])

  // Auto-start Animation beim Mount (Running-Ref ist bereits true)
  useEffect(() => {
    animate()
    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current)
    }
  }, [animate])

  return (
      <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}