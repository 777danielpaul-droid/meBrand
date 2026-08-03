import { useEffect, useRef, useState } from "react"

export default function SpacecraftVideo() {
  const videoRef = useRef(null)
  const emitterRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return

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
    } else {
      vid.currentTime = 0
      vid.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }

  // Partikel-Effekt am Heck
  useEffect(() => {
    if (!isPlaying) return   // Canvas nur öffnen wenn Video spielt
    const canvas = emitterRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    // Feste Canvas-Größe — groß genug für freies Fliegen
    canvas.width = 800 * dpr
    canvas.height = 500 * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const W = 800
    const H = 500

    let particles = []
    let raf = 0
    let lastEmit = 0

    // Emitter: direkt unterhalb des Videos, mittig ausgerichtet
    const EMITTER_X = W / 2
    const EMITTER_Y = H * 0.92

    function emit() {
      const count = 3 + Math.random() * 2
      for (let i = 0; i < count; i++) {
        particles.push({
          x: EMITTER_X,
          y: EMITTER_Y,
          vx: 0.3 + Math.random() * 0.8,   // ✅ Rechts
          vy: 0.2 + Math.random() * 0.5,   // ✅ Runter
          r: 0.5 + Math.random() * 1.8,
          a: 0.2 + Math.random() * 0.3,
          life: 1,
        })
      }
    }

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
        p.life -= 0.004
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        // Staub/Nebel Look
        const grad = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.r * 2.5
        )
        grad.addColorStop(0, `rgba(255, 150, 80, ${p.a * p.life})`)
        grad.addColorStop(1, `rgba(100, 120, 140, 0)`)

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
    }
  }, [isPlaying])

  return (
    <>
      {/* Klickfläche: das Raumschiff */}
      <div
        onClick={handleToggle}
        className="absolute top-[44%] left-[56%] -translate-x-1/2 -translate-y-1/2 w-[64%] h-auto cursor-pointer"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
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
          <source src="/spacecraft-hero.webm?v=3" type="video/webm; codecs=vp8" />
        </video>
      </div>

      {/* Partikel-Emitter Canvas – direkt unterhalb des Videos, frei im Hero-Bereich }
      {isPlaying && (
        <canvas
          ref={emitterRef}
          width="800"
          height="500"
          className="absolute top-[80%] left-[50%] -translate-x-1/2 w-[800px] h-[500px]"
          style={{
            zIndex: 1,
            pointerEvents: "none",
            overflow: "visible",
            clipPath: "none"
          }}
          aria-hidden="true"
        />
      )}

      {/* Klick-Hinweis */}
      <div className="absolute top-[27%] left-[50%] -translate-x-1/2 -translate-y-full z-[9999] px-3 py-1 mono-label text-[10px] text-cyan/90 bg-ink/70 border border-cyan/40 rounded-sm pointer-events-none whitespace-nowrap animate-pulse">
        Klick 🖱️
      </div>
    </>
  )
}
