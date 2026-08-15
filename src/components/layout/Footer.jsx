import { motion } from "framer-motion"
import { site } from "../../data/content"
import { T, default as RunenText } from "../RunenText"
import { useEffect, useState } from "react"
import ShadowHelmetIcon from "../icons/ShadowHelmetIcon"

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
              <ShadowHelmetIcon className="w-6 h-6 text-cyan group-hover:text-neon transition-colors" />
            </span>
            <span className="font-display font-bold tracking-[0.18em] text-sm">
              <T en={site.brand.en}>{site.brand.de}</T>
            </span>
          </a>

          {/* Text-Links (bleiben erhalten) */}
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

          {/* Social-Media Icons (statt Datenschutz/AGB) */}
          {f.social && (
            <div className="flex items-center gap-3 sm:gap-4">
              {f.social.map((s, index) => (
                <a
                  key={index}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-md bg-neon/10 border border-neon/30 hover:bg-neon/25 hover:border-neon/50 transition-all flex items-center justify-center text-cyan hover:text-neon"
                >
                  {s.icon === "github" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.83-.258.83-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.469-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.813 5.604-5.489 5.951.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297 24 5.67 18.627.297 12 .297"></path>
                    </svg>
                  )}
                  {s.icon === "linkedin" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.451v6.289zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 012.063-2.063 2.062 2.062 0 012.062 2.063 2.063 2.063 0 01-2.062 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.222 9c-.019.033-.038.064-.038.099 0 3.226-.157 5.752-.754 7.604-2.322-1.902-3.96-4.428-4.724-7.404 1.032-.156 2.048-.244 3.048-.244 3.929 0 6.69 2.342 7.222 5.829l.734-.448c.734-5.546.413-10.278-1.542-13.777-1.085-.92-2.32-1.67-3.63-2.223-1.183-.553-2.45-.857-3.73-.857-3.4 0-6.127 2.637-6.673 6.129.083.033.166.065.233.085.564.165 1.048.585 1.278 1.128.38.858.268 1.856-.37 2.598-.638.74-1.667 1.128-2.683 1.128-1.089 0-2.02-.322-2.809-.87-.073-.04-1.616-.972-1.407-3.732.043-.589.157-1.137.337-1.634-2.208 2.072-3.72 5.025-3.72 8.284 0 3.417 1.332 6.502 3.528 8.832-.213.058-.445.085-.679.085-1.534 0-2.86-.554-3.939-1.445.368-.534.654-1.008.873-1.427.035-.07.07-.14.105-.212.033-.073.066-.146.098-.22z"></path>
                    </svg>
                  )}
                  {s.icon === "twitter" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 0 11.084 0 0-7.105-8.26H3.125l7.7 9.465-7.5 11.314h3.331l6.36-9.73 5.3 9.73h3.308l-7.88-10.14z"></path>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          )}
          {/* Per Aspera Ad Astra — zentrierte Runen, desktop only, hinter Glas */}
          <div className="hidden sm:block sm:absolute inset-x-0 text-center mono-label text-cyan/30 text-[9px] pointer-events-none">
            <RunenText text="Per Aspera Ad Astra" className="center" />
          </div>
        </div>
      </nav>
    </motion.footer>
  )
}
