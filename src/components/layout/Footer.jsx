import { motion } from "framer-motion"
import { site } from "../../data/content"
import { T } from "../RunenText"
import { useEffect, useState, useRef } from "react"

export default function Footer() {
  const f = site.footer
  const footerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  // IntersectionObserver: aktiviert Glow nur, wenn Footer im Viewport ist (am Seitenende)
  useEffect(() => {
    const currentRef = footerRef.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Wenn Footer mehr als 10% sichtbar ist → Glow aktivieren
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      },
      {
        root: null,
        threshold: [0, 0.1, 0.5], // Schwellen für granularere Reaktion
        rootMargin: "-80% 0px 0px 0px", // Trigger, wenn Footer in unterer Drittel der Seite ist
      }
    )

    observer.observe(currentRef)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.footer
      ref={footerRef}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderBottomColor: "rgba(192,38,211,1)" }}
      // Glow nur sichtbar, wenn Footer im Viewport (unten gescrollt)
      className={`fixed bottom-0 inset-x-0 z-50 transition-all duration-500 ${
        isVisible ? "footer-glow" : ""
      }`}
    >
      <nav className="backdrop-blur-md bg-ink/40 border-t border-white/10 glass">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-1 flex items-center justify-between">
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
