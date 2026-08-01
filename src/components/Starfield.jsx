import { useEffect, useRef } from "react"
import { initStarfield } from "../lib/starfield"

/**
 * Canvas-Starfield: ~1000 bunte, funkelnde Sterne als Hintergrund.
 * Canvas ist z-Index 1000 (hinter #root:1) und pointer-events:none,
 * damit alle Interaktionen durchkommen.
 *
 * Wichtig: Canvas wird als Geschwister-Element von #root in <body> gemountet
 * (via main.jsx), NICHT innerhalb von #root — sonst fängt #root's
 * Stacking-Context das Canvas mit z-index ein.
 */
export default function Starfield({ count = 1000 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = initStarfield(canvas, count)
    return () => ctx.destroy()
  }, [count])

  return <canvas ref={canvasRef} id="starfield" className="starfield" aria-hidden="true" />
}
