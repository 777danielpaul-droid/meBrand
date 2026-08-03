import { useEffect, useRef, useState } from "react"

export default function SpacecraftVideo() {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return

    let playedOnce = false

    // 2. Nach erstem Durchlauf: letzte Sekunde loopen
    const handleEnded = () => {
      if (!playedOnce) {
        playedOnce = true
      }
      // Springt immer wieder 1s vor Ende → nahtfreier Loop
      if (vid.duration && isFinite(vid.duration)) {
        vid.currentTime = Math.max(0, vid.duration - 1)
      }
      vid.play().catch(() => {})
    }

    vid.addEventListener("ended", handleEnded)

    return () => {
      vid.removeEventListener("ended", handleEnded)
    }
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

  return (
    <>
      {/* Klickfläche: das Raumschiff */}
      <div
        onClick={handleToggle}
        className="absolute top-[44%] left-[52%] -translate-x-1/2 -translate-y-1/2 w-[64%] h-auto cursor-pointer"
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

  {/* Klick-Hinweis direkt über dem Raumschiff — z-index 9999 für Vordergrund */}
      <div className="absolute top-[27%] left-[50%] -translate-x-1/2 -translate-y-full z-[9999] px-3 py-1 mono-label text-[10px] text-cyan/90 bg-ink/70 border border-cyan/40 rounded-sm pointer-events-none whitespace-nowrap animate-pulse">
        Klick 🖱️
      </div>
    </>
  )
}
