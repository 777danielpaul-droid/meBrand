import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const TOTAL_FRAMES = 150
const MOBILE_FRAMES = 75
const FRAME_PATH = (i) => `/anim/robot-teardown/frame_${String(i + 1).padStart(4, "0")}.png`

export default function RobotTeardown() {
  const canvasRef = useRef(null)
  const pinRef = useRef(null)
  const imagesRef = useRef([])
  const frameCountRef = useRef(TOTAL_FRAMES)

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
      img.src = FRAME_PATH(i)
    }
  }, [frameCount])

  // Canvas sizing + ScrollTrigger
  useEffect(() => {
    const canvas = canvasRef.current
    const pin = pinRef.current
    if (!canvas || !pin) return

    const ctx = canvas.getContext("2d")
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    const dpr = window.devicePixelRatio || 1
    const srcWidth = 1920
    const srcHeight = 1080
    let currentProgress = 0

    const drawFrame = (progress) => {
      const count = frameCountRef.current
      const img = imagesRef.current[Math.min(Math.floor(progress * (count - 1)), count - 1)]
      if (!img) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // contain: Bild passt komplett in die Canvas (kein Abschneiden oben/unten)
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

    // Initial size + resize handling
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

      // Draw first frame
      drawFrame(0)

      // Apple.com pattern: dummy tween drives ScrollTrigger
      const dummy = { progress: 0 }
      tween = gsap.to(dummy, {
        progress: 1,
        duration: 1,
        ease: "none",
        onUpdate: () => {
          currentProgress = dummy.progress
          drawFrame(dummy.progress)
        },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: `+=${pin.getBoundingClientRect().height}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      })
    }

    // Poll for first loaded image, then init
    const poll = setInterval(() => {
      if (initialized) { clearInterval(poll); return }
      tryInit()
    }, 200)

    // Cleanup
    return () => {
      clearInterval(poll)
      resizeObserver.disconnect()
      if (tween) tween.kill()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount])

  return (
    <section className="relative w-full mt-0">{/* Transparent — Starfield durchscheint, kein freier Abstand */}
      <div ref={pinRef} className="relative w-full h-[200vh]">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-screen"
          width={1920}
          height={1080}
        />
      </div>
    </section>
  )
}
