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
    canvas.width = 1920 * dpr
    canvas.height = 1080 * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const drawFrame = (progress) => {
      const count = frameCountRef.current
      const img = imagesRef.current[Math.min(Math.floor(progress * (count - 1)), count - 1)]
      if (!img) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      ctx.drawImage(img, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh)
    }

    let tween = null
    let initialized = false

    const tryInit = () => {
      const loadedCount = imagesRef.current.filter(Boolean).length
      if (loadedCount === 0) return

      initialized = true

      // Draw first frame
      const first = imagesRef.current.find(Boolean)
      if (first) {
        const scale = Math.max(canvas.width / first.naturalWidth, canvas.height / first.naturalHeight)
        const dw = first.naturalWidth * scale
        const dh = first.naturalHeight * scale
        ctx.drawImage(first, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh)
      }

      // Apple.com pattern: animated tween drives ScrollTrigger
      const dummy = { progress: 0 }
      tween = gsap.to(dummy, {
        progress: 1,
        duration: 1,
        ease: "none",
        onUpdate: () => drawFrame(dummy.progress),
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
      if (tween) tween.kill()
    }
  }, [frameCount])

  return (
    <section className="relative w-full bg-black">
      <div ref={pinRef} className="relative w-full" style={{ height: "200vh" }}>
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-screen object-cover"
          width="1920"
          height="1080"
        />
      </div>

    </section>
  )
}
