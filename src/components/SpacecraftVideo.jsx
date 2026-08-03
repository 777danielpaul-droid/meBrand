import { useEffect, useRef } from "react"

export default function SpacecraftVideo() {
  const videoRef = useRef(null)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return

    let isMounted = true

    const handleLoadedMetadata = () => {
      if (!isMounted) return
      // Springe 1 Sekunde vor das Ende → dieser Abschnitt loopt sauber
      if (vid.duration && isFinite(vid.duration)) {
        vid.currentTime = Math.max(0, vid.duration - 1)
      }
      // Starte manuelle Wiedergabe (kein autoplay-Attribut mehr)
      vid.play().catch(() => {
        // Erlaubnis-Fehler sind meistens harmlos im Dev-Modus
      })
    }

    const handleEnded = () => {
      if (!isMounted) return
      // Springe zur letzten Sekunde, spiele erneut ab
      if (vid.duration && isFinite(vid.duration)) {
        vid.currentTime = Math.max(0, vid.duration - 1)
        vid.play().catch(() => {})
      }
    }

    vid.addEventListener("loadedmetadata", handleLoadedMetadata)
    vid.addEventListener("ended", handleEnded)

    return () => {
      isMounted = false
      vid.pause()
      vid.removeEventListener("loadedmetadata", handleLoadedMetadata)
      vid.removeEventListener("ended", handleEnded)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      muted
      loop={false}
      playsInline
      disablePictureInPicture
      preload="auto"
      className="absolute top-[44%] left-[52%] -translate-x-1/2 -translate-y-1/2 w-[64%] h-auto"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Cache-Buster ?v=2 zwingt Browser zum Neuladen */}
      <source src="/spacecraft-hero.webm?v=2" type="video/webm; codecs=vp8" />
    </video>
  )
}
