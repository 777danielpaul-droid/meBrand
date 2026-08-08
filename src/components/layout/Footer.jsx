import { motion } from "framer-motion"
import { site } from "../../data/content"
import { T } from "../RunenText"
import { useEffect, useState } from "react"

export default function Footer({ className = "" }) {
  const f = site.footer
  const [isActive, setIsActive] = useState(false)

  // Scroll-Triggered: Footer-Glow + volle Höhe, wenn Nutzer am Seitenende ist
  // (Footer ist position:fixed → IntersectionObserver nicht geeignet)
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight -
        200 // 200px Toleranz vor Seitenende

      setIsActive(window.scrollY >= scrollThreshold)
    }

    // Throttle für Performance: max. 15 FPS via requestAnimationFrame
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    // Initial check
    handleScroll()

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  return (
    <motion.footer
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderBottomColor: "rgba(192,38,211,1)" }}
      // Minimiert: max-h-4px (nur dünne Bar) | Maximiert: max-h-40 + Glow
      className={`fixed bottom-0 inset-x-0 z-50 overflow-hidden transition-all duration-500 ease-in-out ${
        isActive
          ? "footer-glow max-h-[120px]"
          : "max-h-[4px]"
      } ${className}`}
    >
      <nav className="backdrop-blur-md bg-ink/40 border-t border-white/10 glass h-full">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-1 flex items-center justify-between h-full">
          <a href="#hero" className="flex items-center gap-3 group">
            <span className="relative grid place-items-center w-8 h-8 rounded-md bg-neon/15 border border-neon/40">
              <span className="text-base leading-none" aria-hidden="true">🐻</span>
            </span>
            <span className="font-display font-bold tracking-[0.18em] text-sm">
              <T en={site.brand.en}>{site.brand.de}</T>
            </span>
          </a>

          <div className="flex items-center gap-4 sm:gap-6">
            {f.links.map((l, index) => (
              <a
                key={index}
                href={l.href}
                className="mono-label text-cyan hover:text-cyan transition-colors text-sm font-medium"
              >
                <T en={l.label.en}>{l.label.de}</T>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </motion.footer>
  )
}
