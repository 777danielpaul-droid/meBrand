import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { asset } from "../lib/asset"
import SkillGrid from "./SkillGrid"

gsap.registerPlugin(ScrollTrigger)

const TOTAL_FRAMES = 150
const MOBILE_FRAMES = 75
const framePath = (i) => asset(`anim/robot-teardown/frame_${String(i + 1).padStart(4, "0")}.png`)

export default function RobotTeardown() {
  const canvasRef = useRef(null)
  const pinRef = useRef(null)
  const imagesRef = useRef([])
  const frameCountRef = useRef(TOTAL_FRAMES)
  const skillRef = useRef(null)
  const isMobileRef = useRef(window.innerWidth < 768)

  const [frameCount] = useState(() =>
    isMobileRef.current ? MOBILE_FRAMES : TOTAL_FRAMES
  )

  frameCountRef.current = frameCount

  const preloadRef = useRef(null)

  useEffect(() => {
    const count = frameCount
    imagesRef.current = new Array(count)

    // Lazy-Preload-Fenster: nur ~40 Frames um den aktuellen Scroll-Stand.
    // decoding="async" + decode() verhindert main-thread blocking auf schwachen Geräten.
    const PRELOAD_RADIUS = 20
    let currentIdx = -1

    const loadFrame = (i) => {
      if (i < 0 || i >= count || imagesRef.current[i]) return
      const img = new Image()
      img.decoding = "async"
      img.fetchPriority = i < PRELOAD_RADIUS ? (!isMobileRef.current || i === 0 ? "high" : "low") : "low"
      imagesRef.current[i] = img
      img.onload = () => { img.decode().then(() => { imagesRef.current[i] = img }).catch(() => {}) }
      img.src = framePath(i)
    }

    preloadRef.current = (idx) => {
      if (idx === currentIdx) return
      currentIdx = idx
      const start = Math.max(0, idx - PRELOAD_RADIUS)
      const end = Math.min(count - 1, idx + PRELOAD_RADIUS)
      for (let i = start; i <= end; i++) loadFrame(i)
    }

    // Initial: erste Frames vorrücken
    preloadRef.current(0)

    return () => { imagesRef.current = []; preloadRef.current = null }
  }, [frameCount])

  useEffect(() => {
    const canvas = canvasRef.current
    const pin = pinRef.current
    const skill = skillRef.current
    if (!canvas || !pin || !skill) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = frameCountRef.current > 100 ? "high" : "low"

    const dpr = window.devicePixelRatio || 1
    let currentProgress = 0

    const drawFrame = (progress) => {
      const count = frameCountRef.current
      const invertedProgress = 1 - progress
      const targetIdx = Math.min(Math.floor(invertedProgress * (count - 1)), count - 1)

      // Trigger lazy preload of frames around the current position
      if (preloadRef.current) preloadRef.current(targetIdx)

      const img = imagesRef.current[targetIdx]
      if (!img) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh)
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      const renderScale = isMobileRef.current ? 0.5 : 1
      canvas.width = Math.round(rect.width * dpr * renderScale)
      canvas.height = Math.round(rect.height * dpr * renderScale)
      ctx.setTransform(dpr * renderScale, 0, 0, dpr * renderScale, 0, 0)
      drawFrame(currentProgress)
    }

    resizeCanvas()
    const resizeObserver = new ResizeObserver(resizeCanvas)
    resizeObserver.observe(canvas)

    let tween = null
    let initialized = false

    const tryInit = () => {
      const loadedCount = imagesRef.current.filter(Boolean).length
      if (loadedCount === 0) return

      initialized = true
      drawFrame(0)

      const skillItems = skill.querySelectorAll(".skill-item")
      const skillHeading = skill.querySelector("h3")
      gsap.set(skill, { opacity: 0 })
      gsap.set(skillItems, { opacity: 0, y: 30 })
      gsap.set(skillHeading, { opacity: 0, y: 20 })

      const pinHeight = pin.getBoundingClientRect().height
      const extraRevealSpace = window.matchMedia("(max-width: 768px)").matches
        ? 320
        : 200
      const dummy = { progress: 0 }
      tween = gsap.to(dummy, {
        progress: 2,
        duration: 1,
        ease: "none",
        onUpdate: () => {
          const p = dummy.progress
          currentProgress = Math.min(1, p)
          drawFrame(currentProgress)

          if (p < 1) {
            gsap.set(skill, { opacity: 0 })
            gsap.set(skillItems, { opacity: 0, y: 30 })
            gsap.set(skillHeading, { opacity: 0, y: 20 })
          } else {
            const revealT = Math.min(1, p - 1)
            gsap.set(skill, { opacity: revealT })
            gsap.set(skillHeading, {
              opacity: revealT,
              y: 20 * (1 - revealT),
            })
            skillItems.forEach((item, i) => {
              const delay = i * 0.08
              const t = Math.max(0, Math.min(1, (revealT - delay) / (1 - delay)))
              gsap.set(item, {
                opacity: t,
                y: 30 * (1 - t),
              })
            })
          }
        },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: `+=${pinHeight + extraRevealSpace}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })
    }

    const poll = setInterval(() => {
      if (initialized) { clearInterval(poll); return }
      tryInit()
    }, 200)

    return () => {
      clearInterval(poll)
      resizeObserver.disconnect()
      if (tween) tween.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount])

  return (
    <section className="relative w-full mt-0">
      <div
        ref={pinRef}
        className="relative w-full h-[100vh] sm:h-[110vh]"
      >
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          width={1920}
          height={1080}
        />

        {/* Skill-Balken-Reveal: erscheint ERST nach kompletter Scroll-Animation.
            Auf Mobil: statisch unterhalb des Canvas (nicht abgeschnitten). */}
        <div
          ref={skillRef}
          className="absolute bottom-[-90px] sm:bottom-8 left-1/2 -translate-x-1/2 w-[90vw] max-w-3xl mx-auto flex flex-col gap-4 bg-[rgba(0,0,0,0.35)] backdrop-blur-sm rounded-xl p-4 border border-white/5"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
        >
          <h3 className="mono-label text-cyan text-xs uppercase tracking-[0.3em] text-center">
            Technische Skills &amp; Sprachen
          </h3>
          <SkillGrid baseDelay={0} className="mb-4" />
        </div>
      </div>
    </section>
  )
}
