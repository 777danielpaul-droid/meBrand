import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { asset } from "../lib/asset"
import { cvData } from "../data/cv"
import SkillBar from "./SkillBar"

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

  const [frameCount] = useState(() =>
    window.matchMedia("(max-width: 768px)").matches ? MOBILE_FRAMES : TOTAL_FRAMES
  )

  frameCountRef.current = frameCount

  // Preload all frames
  useEffect(() => {
    const count = frameCount
    imagesRef.current = new Array(count)
    for (let i = 0; i < count; i++) {
      const img = new Image()
      img.onload = () => { imagesRef.current[i] = img }
      img.src = framePath(i)
    }
  }, [frameCount])

  // Canvas sizing + ScrollTrigger
  useEffect(() => {
    const canvas = canvasRef.current
    const pin = pinRef.current
    const skill = skillRef.current
    if (!canvas || !pin || !skill) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    const dpr = window.devicePixelRatio || 1
    let currentProgress = 0

    const drawFrame = (progress) => {
      const count = frameCountRef.current
      const invertedProgress = 1 - progress
      const img = imagesRef.current[Math.min(Math.floor(invertedProgress * (count - 1)), count - 1)]
      if (!img) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const scale = Math.min(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh)
    }

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      drawFrame(currentProgress)
    }

    resizeCanvas()
    const resizeObserver = new ResizeObserver(resizeCanvas)
    resizeObserver.observe(canvas)

    // Draw first frame + setup trigger when images available
    let tween = null
    let initialized = false

    const tryInit = () => {
      const loadedCount = imagesRef.current.filter(Boolean).length
      if (loadedCount === 0) return

      initialized = true
      drawFrame(0)

      // Skill-Balken-Reveal: unsichtbar bis Animation komplett durchgespielt
      const skillItems = skill.querySelectorAll(".skill-item")
      const skillHeading = skill.querySelector("h3")
      gsap.set(skill, { opacity: 0 })
      gsap.set(skillItems, { opacity: 0, y: 30 })
      gsap.set(skillHeading, { opacity: 0, y: 20 })

      // Pin-Höhe: Canvas + Puffer für Skill-Reveal
      const pinHeight = pin.getBoundingClientRect().height
      const extraRevealSpace = 200 // px extra scroll nach Animation für Skill-Reveal

      // Shared ScrollTrigger: Canvas-Animation (0→1) + Skill-Reveal (1→2)
      const dummy = { progress: 0 }
      tween = gsap.to(dummy, {
        progress: 2, // 0→1 = Canvas-Anim, 1→2 = Skill-Reveal
        duration: 1,
        ease: "none",
        onUpdate: () => {
          const p = dummy.progress
          currentProgress = Math.min(1, p)
          drawFrame(currentProgress)

          if (p < 1) {
            // Canvas-Animation läuft — Skills bleiben versteckt
            gsap.set(skill, { opacity: 0 })
            gsap.set(skillItems, { opacity: 0, y: 30 })
            gsap.set(skillHeading, { opacity: 0, y: 20 })
          } else {
            // Canvas-Fertig — Skills langsam sichtbar werden
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
      {/* Transparenter Container — Starfield durchscheint */}
      <div ref={pinRef} className="relative w-full h-[100vh]">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-screen"
          width={1920}
          height={1080}
        />

        {/* Skill-Balken-Reveal: erscheint ERST nach kompletter Scroll-Animation */}
        <div
          ref={skillRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl mx-auto flex flex-col gap-4 bg-ink/40 backdrop-blur-sm rounded-xl p-4 border border-white/5"
        >
          <h3 className="mono-label text-cyan text-xs uppercase tracking-[0.3em] text-center">
            Technische Skills &amp; Sprachen
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cvData.skills.map((s, i) => (
              <div key={s.name.de} className="skill-item">
                <SkillBar
                  label={s.name.de}
                  level={s.level}
                  color={s.color}
                  icon={s.icon}
                  index={i}
                />
              </div>
            ))}
            {cvData.softSkills.map((s, i) => (
              <div key={s.name.de} className="skill-item">
                <SkillBar
                  label={s.name.de}
                  level={s.level}
                  color={s.color}
                  icon={s.icon}
                  index={i}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
