import { useEffect, useRef, useState } from "react"

/**
 * Hook: erstellt einen Canvas-basierten Partikeleffekt (RocketTrail).
 * Liest canvasRef.current innerhalb von useEffect — nach DOM-Mount.
 */
function useRocketTrail(canvasRef, isPlaying, opts) {
  useEffect(() => {
    if (!isPlaying) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let W, H

    function setup() {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    setup()

    let particles = []
    let raf = 0
    let lastEmit = 0

    // Emitter-Position: dynamisch, weil W/H bei Resize neu berechnet werden
    function emitterPos() {
      return { x: W * opts.x, y: H * opts.y }
    }

    const COLORS = [
      { r: 138, g: 43, b: 226 }, // Lila
      { r: 0, g: 240, b: 255 }, // Tiffany / Cyan
    ]

    function emit() {
      const { x, y } = emitterPos()
      const count = 3 + Math.random() * 2
      for (let i = 0; i < count; i++) {
        const c = COLORS[(Math.random() * COLORS.length) | 0]
        particles.push({
          x,
          y,
          vx: 0.3 + Math.random() * 1.2,
          vy: 0.2 + Math.random() * 0.8,
          r: 0.5 + Math.random() * 1.8,
          a: 0.2 + Math.random() * 0.3,
          life: 1,
          // Farb-Kanal für 2-farbigen Trail (Lila / Tiffany)
          cr: c.r,
          cg: c.g,
          cb: c.b,
        })
      }
    }

    const rot = opts.rotation ? (opts.rotation * Math.PI) / 180 : 0

    function animate() {
      raf = requestAnimationFrame(animate)
      ctx.clearRect(0, 0, W, H)

      const now = performance.now()
      if (now - lastEmit > 18) {
        emit()
        lastEmit = now
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.002
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        if (rot) {
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(rot)
          const drawX = 0
          const drawY = 0
          const grad = ctx.createRadialGradient(
            drawX,
            drawY,
            0,
            drawX,
            drawY,
            p.r * 2.5,
          )
          grad.addColorStop(
            0,
            `rgba(${p.cr}, ${p.cg}, ${p.cb}, ${p.a * p.life})`,
          )
          grad.addColorStop(1, `rgba(${p.cr}, ${p.cg}, ${p.cb}, 0)`)

          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(drawX, drawY, p.r, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        } else {
          const grad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.r * 2.5,
          )
          grad.addColorStop(
            0,
            `rgba(${p.cr}, ${p.cg}, ${p.cb}, ${p.a * p.life})`,
          )
          grad.addColorStop(1, `rgba(${p.cr}, ${p.cg}, ${p.cb}, 0)`)

          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const onResize = () => setup()
    window.addEventListener("resize", onResize)

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [isPlaying, canvasRef, opts])
}

export default function SpacecraftVideo() {
  const videoRef = useRef(null)
  const emitterRef = useRef(null)
  const emitter2Ref = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Emitter-Positionen: Trail 1 (84% W, 73% H) + Trail 2 (85% W, 69% H, 25° links)
  useRocketTrail(emitterRef, isPlaying, { x: 0.84, y: 0.73 })
  useRocketTrail(emitter2Ref, isPlaying, { x: 0.85, y: 0.69, rotation: -25 })

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return

    // Video nicht automatisch abspielen — startet erst per Klick
    // Dadurch startet auch der RocketTrail-Effekt gleichzeitig (handleToggle)
    let playedOnce = false

    const handleEnded = () => {
      if (!playedOnce) playedOnce = true
      if (vid.duration && isFinite(vid.duration)) {
        vid.currentTime = Math.max(0, vid.duration - 1)
      }
      vid.play().catch(() => {})
    }

    vid.addEventListener("ended", handleEnded)
    return () => vid.removeEventListener("ended", handleEnded)
  }, [])

  const handleToggle = () => {
    const vid = videoRef.current
    if (!vid) return

    if (isPlaying) {
      vid.pause()
      vid.currentTime = 0
      setIsPlaying(false)
    } else {
      vid.currentTime = 0
      vid.play().catch(() => {})
      // RocketTrail startet 1 Sekunde nach Klick verzögert
      setTimeout(() => setIsPlaying(true), 1000)
    }
  }

  return (
    <>
      {/* Raumschiff-Video (visuell, nicht klickbar — Klick kommt vom Hinweis-Button) */}
      <div className="absolute top-[44%] left-[56%] -translate-x-1/2 -translate-y-1/2 w-[64%] h-auto pointer-events-none z-[5]">
        <video
          ref={videoRef}
          muted
          loop={false}
          playsInline
          disablePictureInPicture
          preload="auto"
          className="w-full h-auto block"
          aria-hidden="true"
        >
          <source
            src="/spacecraft-hero.webm?v=3"
            type="video/webm; codecs=vp8"
          />
          <source
            src="/spacecraft-hero.mp4?v=3"
            type="video/mp4"
          />
        </video>
      </div>

      {/* RocketTrail Canvas 1 — Vollbild, über Video */}
      {isPlaying && (
        <canvas
          ref={emitterRef}
          className="fixed inset-0 w-screen h-screen"
          style={{
            zIndex: 9999,
            pointerEvents: "none",
            overflow: "visible",
            clipPath: "none",
            contain: "none",
          }}
          aria-hidden="true"
        />
      )}

      {/* RocketTrail Canvas 2 — Vollbild, 7% über Canvas 1 */}
      {isPlaying && (
        <canvas
          ref={emitter2Ref}
          className="fixed inset-0 w-screen h-screen"
          style={{
            zIndex: 9999,
            pointerEvents: "none",
            overflow: "visible",
            clipPath: "none",
            contain: "none",
          }}
          aria-hidden="true"
        />
      )}

      {/* Klick-Hinweis — echter Button, startet die Animation */}
      <button
        onClick={handleToggle}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleToggle()}
        className="absolute top-[52%] left-[45%] -translate-x-1/2 -translate-y-full z-[9999] px-3 py-1 mono-label text-[10px] text-cyan/90 bg-ink/70 border border-cyan/40 rounded-sm cursor-pointer hover:bg-ink/80 hover:border-cyan/60 transition-colors whitespace-nowrap animate-pulse"
        role="button"
        tabIndex={0}
        aria-label="Raumschiff starten / Animation abspielen"
      >
        Klick 🖱️
      </button>
    </>
  )
}
