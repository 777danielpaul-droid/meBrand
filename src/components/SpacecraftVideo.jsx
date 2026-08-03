import { useEffect, useRef } from "react"

export default function SpacecraftVideo() {
  const videoRef = useRef(null)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return

    let playedOnce = false

    // 1. Video bei Laden ab Sekunde 0 abspielen
    const handleLoadedMetadata = () => {
      vid.currentTime = 0
      vid.play().catch(() => {})
    }

    // 2. Nach erstem Durchlauf: letzte Sekunde loopen
    const handleEnded = () => {
      if (!playedOnce) {
        playedOnce = true
      }
      // Springe immer wieder 1s vor Ende → nahtfreier Loop
      if (vid.duration && isFinite(vid.duration)) {
        vid.currentTime = Math.max(0, vid.duration - 1)
      }
      vid.play().catch(() => {})
    }

    vid.addEventListener("loadedmetadata", handleLoadedMetadata)
    vid.addEventListener("ended", handleEnded)

    return () => {
      vid.removeEventListener("loadedmetadata", handleLoadedMetadata)
      vid.removeEventListener("ended", handleEnded)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      muted
      loop={false}          // manuell steuern
      playsInline
      disablePictureInPicture
      preload="auto"
      className="absolute top-[44%] left-[52%] -translate-x-1/2 -translate-y-1/2 w-[64%] h-auto"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* Cache-Buster ?v=3 → Browser holt neue Runde */}
      <source src="/spacecraft-hero.webm?v=3" type="video/webm; codecs=vp8" />
    </video>
  )
}
