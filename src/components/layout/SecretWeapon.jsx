import { useRef } from "react"
import { motion } from "framer-motion"
import { site } from "../../data/content"
import { asset } from "../../lib/asset"
import { EASE } from "../motion/variants"
import { useScrollRevealStage } from "../motion/ScrollRevealStage"
import { T } from "../RunenText"

// Scroll-Linked Enthüllung mit PIN:
// Die Sektion pinnt sich (sticky), während man scrollt — die Seite "steht still",
// und der Effekt spielt sich vor Augen ab: der große, opake Text-Container wandert
// nach oben raus, das Herz-Bild (in einer gestapelten Spalte mit der Caption) wird
// darunter komplett sichtbar und bekommt den Fokus.
export default function SecretWeapon() {
  const s = site.secret
  const ref = useRef(null)
  const {
    imgY,
    imgScale,
    imgOpacity,
    panelY,
    panelOpacity,
    captionY,
    captionOpacity,
    glowShadow,
    imgFilter,
  } = useScrollRevealStage(ref)

  return (
    <section id="secret-weapon" ref={ref} className="relative border-y border-white/5 phase-gated">
      <div className="absolute inset-0 hud-grid opacity-30" aria-hidden="true" />

      {/* PIN-BÜHNE: sticky, füllt Viewport, läuft über lange Scroll-Strecke ab */}
      <div className="relative h-[320vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-5xl mx-auto px-5 sm:px-8 h-full flex items-center justify-center">
            {/* REVEAL-SPALTE (unter dem Panel): Bild + Caption gestapelt, am Ende komplett sichtbar */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
              {/* "Projekte • Scroll to reveal" — Tiffany-Blau (#00f0ff) via inline-style + textShadow (font-road-rage Bug-Workaround) */}
              <p className="mono-label" style={{ color: "#00f0ff", textShadow: "0 0 6px #00f0ff, 0 0 12px #2dd3ee" }}>Projekte • Scroll to reveal</p>

              <motion.div
                style={{ y: imgY, scale: imgScale, opacity: imgOpacity, filter: imgFilter }}
                className="relative z-10 flex justify-center"
              >
                <motion.div
                  style={{ boxShadow: glowShadow }}
                  className="relative rounded-2xl overflow-hidden border border-white/10 w-full max-w-2xl"
                >
                  {/* [T178] */}
                  <img
                    src={asset("/hitisop-cover.png")}
                    alt="HITisOP Cover"
                    className="w-full h-[48vh] sm:h-[54vh] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
                  <div className="absolute inset-0 bg-gradient-to-br from-neon/10 via-transparent to-gold/10 mix-blend-screen" />
                </motion.div>
              </motion.div>

              <motion.div
                style={{ y: captionY, opacity: captionOpacity }}
                className="relative z-30 -mt-6 sm:-mt-8 text-center max-w-2xl"
              >
                <h3 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl neon-text">
                  <a
                    href={s.name.de}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan hover:text-neon transition-colors underline decoration-cyan/50 hover:decoration-neon font-road-rage text-pulse link-pulse"
                  >
                    {s.name.de}
                  </a>
                </h3>
              </motion.div>
            </div>

            {/* TEXT-CONTAINER: GROSS + OPAK (Glass-Stil), verdeckt das Bild, wandert nach oben raus */}
            <motion.div
              style={{ y: panelY, opacity: panelOpacity }}
              className="relative z-20 mx-auto max-w-3xl"
            >
              <div className="rounded-none bg-transparent">
                <h2 className="font-road-rage font-bold text-4xl sm:text-5xl tracking-tight leading-[1.05] link-pulse" style={{ color: "#a400ff", textShadow: "0 0 8px #a400ff, 0 0 16px #6d28d9" }}>
                  My first game
                </h2>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
