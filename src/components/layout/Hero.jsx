import { motion, useScroll, useTransform } from "framer-motion"
import { stagger, EASE } from "../motion/variants"
import { site } from "../../data/content"
import { cvData } from "../../data/cv"
import { T, default as RunenText } from "../RunenText"
import ShadowHelmet from "../ShadowHelmet"

// Titel-Schatten für Tiefe (schwarzer Mehrfach-Schatten)
// Lila Outline: via CSS text-stroke (echte Kontur, sichtbar über dem Text)
const TITLE_SHADOW =
  // Tiefe: schwarzer Mehrfach-Schatten
  "1px 1px rgba(0,0,0,0.6), 2px 2px rgba(0,0,0,0.55), 3px 3px rgba(0,0,0,0.5), " +
  "4px 4px rgba(0,0,0,0.45), 6px 6px rgba(0,0,0,0.4), 8px 8px rgba(0,0,0,0.35), " +
  "12px 12px rgba(0,0,0,0.3), 18px 18px rgba(0,0,0,0.25), 24px 24px 10px rgba(0,0,0,0.3)"

export default function Hero() {
  const h = site.hero
  const c = cvData
  const { scrollY } = useScroll()
  const blobY = useTransform(scrollY, [0, 800], [0, 220])
  const blobOpacity = useTransform(scrollY, [0, 600], [1, 0.3])

  return (
    <section id="hero" className="hero-holo relative motion-reveal min-h-[100vh] h-auto sm:h-screen sm:max-h-[680px] bg-transparent z-0">
      {/* Canvas-Shuttle-Animation: transparenter, voller Hero-Bereich */}
      <motion.div
        style={{ y: blobY, opacity: blobOpacity }}
        className="absolute top-24 right-[-6rem] w-[18rem] h-[18rem] sm:w-[28rem] sm:h-[28rem] rounded-full bg-neon/25 blur-[60px] sm:blur-[120px]"
        aria-hidden="true"
      />

      {/* Shadow Helmet Canvas-Animation — IN FRONT of all content (z-20 > z-10).
          Canvas background ist transparent (clearRect), nur der Helm-Sprite ist opaque.
          Content bleibt darunter sichtbar. Maus-Tracking über document-level-Listener. */}
      <ShadowHelmet />

      {/* Hero-Content — z-10, liegt unter ShadowHelmet-Canvas, direkt unter Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-24 sm:pt-28 pb-12 sm:pb-20 w-full flex flex-col justify-start">
        <div className="relative">
          {/* Name + Lead (bleibt erhalten) */}
          <motion.h1
            className="font-display font-bold leading-[1.05] tracking-tight text-2xl sm:text-7xl lg:text-8xl max-w-4xl break-words text-cyan pulse-glow"
            style={{}}
          >
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="block">
              <RunenText text="DANIEL" className="block" />
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="block">
              <RunenText text="PAUL" className="block" />
            </motion.span>
          </motion.h1>

          {/* Skill-Tags (bleiben erhalten) */}
          {h.skills && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-3 sm:mt-4 flex flex-wrap gap-x-2 gap-y-1.5 sm:gap-x-3"
            >
              {h.skills.map((s, i) => (
                <span
                  key={i}
                  className="mono-label text-xs text-cyan drop-shadow-[0_0_8px_rgba(0,0,0,0.7)] bg-ink/45 backdrop-blur-[2px] border border-cyan/25 rounded px-2 py-0.5"
                >
                  <T en={s.en}>{s.de}</T>
                </span>
              ))}
            </motion.div>
          )}

          {/* === Profil-Inhalt hier eingefügt (statt der Hero-Texte) === */}

          {/* Rolle / Titel */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-3 text-lg sm:text-2xl text-cyan font-display max-w-2xl"
          >
            <T en={c.role.en}>{c.role.de}</T>
          </motion.p>
        </div>
      </div>
    </section>
  )
}
