import { useRef } from "react"
import { motion } from "framer-motion"
import { site } from "../../data/content"
import { asset } from "../../lib/asset"
import { EASE } from "../motion/variants"
import { useScrollRevealStage } from "../motion/ScrollRevealStage"
import { T } from "../RunenText"

// Scroll-Linked Enthüllung mit PIN (gleiche Technik wie SecretWeapon):
// Die Sektion pinnt sich (sticky), während man scrollt — die Seite "steht still",
// und der Effekt spielt sich vor Augen ab: der große, opake Text-Container wandert
// nach oben raus, das Schlacht-Bild (in einer gestapelten Spalte mit der Figcaption)
// wird darunter komplett sichtbar. Die Figcaption liegt immer VOR dem Bild (z-30 > z-10).
export default function Battle() {
  const s = site.battleMeta
  const ref = useRef(null)
    const {
    imgY,
    imgScale,
    imgOpacity,
    panelY,
    panelOpacity,
    captionY,
    captionOpacity,
    linkY,
    linkOpacity,
    glowShadow,
    imgFilter,
  } = useScrollRevealStage(ref)

  return (
    <section id="battle" ref={ref} className="relative bg-ink/10 border-y border-white/5 phase-gated">
      <div className="absolute inset-0 hud-grid opacity-40" aria-hidden="true" />

      {/* PIN STAGE: sticky, fills viewport, unfolds across long scroll journey */}
      <div className="relative h-[320vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-5xl mx-auto px-5 sm:px-8 h-full flex items-center justify-center">
            {/* REVEAL-SPALTE (unter dem Panel): Bild + Figcaption gestapelt, am Ende komplett sichtbar */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
              {/* "Projekte • Scroll to reveal" — Tiffany-Blau (#00f0ff) */}
              <p className="mono-label" style={{ color: "#00f0ff" }}><T en={s.eyebrow.en}>{s.eyebrow.de}</T></p>

              <motion.div
                style={{ y: imgY, scale: imgScale, opacity: imgOpacity, filter: imgFilter }}
                className="relative z-10 flex justify-center"
              >
                <motion.div
                  style={{ boxShadow: glowShadow }}
                  className="relative rounded-2xl overflow-hidden border border-white/10 w-full max-w-3xl"
                >
                  {/* [T180] */}
                  <img
                    src={asset("/battle-cover.png")}
                    alt="Battle Screenshot"
                    className="w-full h-[48vh] sm:h-[54vh] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
                  <div className="absolute inset-0 bg-gradient-to-br from-neon/10 via-transparent to-cyan/10 mix-blend-screen" />

                  </motion.div>
              </motion.div>

            <motion.div
              style={{ y: captionY, opacity: captionOpacity }}
              className="relative z-30 -mt-6 sm:-mt-8 text-center max-w-2xl"
            >
              <motion.a
                href="https://humble-bee.de"
                target="_blank"
                rel="noopener noreferrer"
                style={{ y: linkY, opacity: linkOpacity }}
                className="font-road-rage text-cyan hover:text-neon transition-colors text-2xl sm:text-3xl md:text-4xl font-bold underline decoration-cyan/30 link-pulse"
              >
                Save the bees — humble-bee.de
              </motion.a>
            </motion.div>
            </div>

            {/* TEXT-CONTAINER: GROSS + OPAK (Glass-Stil), verdeckt das Bild, wandert nach oben raus */}
            <motion.div
              style={{ y: panelY, opacity: panelOpacity }}
              className="relative z-20 mx-auto max-w-3xl"
            >
              <div className="rounded-none bg-transparent">
                {/* "Humble-Bee" Titel — Lila (#a400ff) */}
                <h2 className="font-road-rage font-bold text-4xl sm:text-5xl tracking-tight leading-[1.05] link-pulse" style={{ color: "#a400ff", textShadow: "0 0 8px #a400ff, 0 0 16px #6d28d9" }}>
                  <T en={s.titleCover.en}>{s.titleCover.de}</T>
                </h2>
                <p className="mt-6 text-bone/75 leading-relaxed text-lg"><T en={s.coverBody.en}>{s.coverBody.de}</T></p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
