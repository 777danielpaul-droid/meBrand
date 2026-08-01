import { motion, useScroll, useTransform } from "framer-motion"
import { site } from "../../data/content"
import { T } from "../RunenText"

export default function Footer() {
  const f = site.footer

  // Scroll-Linked: Border-Glow wächst, wenn man zum Footer scrollt.
  const { scrollYProgress } = useScroll({ offset: ["start end", "end end"] })
  const borderGlow = useTransform(
    scrollYProgress,
    [0, 1],
    ["0 0 0px rgba(192,38,211,0)", "0 0 30px rgba(192,38,211,0.6)"]
  )

  return (
    <motion.footer
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderBottomColor: "rgba(192,38,211,1)", boxShadow: borderGlow }}
      className="fixed bottom-0 inset-x-0 z-50 header-glow"
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
