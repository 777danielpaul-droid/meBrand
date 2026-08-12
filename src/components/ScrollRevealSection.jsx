import { useRef } from "react";
import { motion } from "framer-motion";
import { asset } from "../lib/asset";
import { useScrollRevealStage } from "./motion/ScrollRevealStage";
import { T } from "./RunenText";
import { useLang } from "./RunenContext";

// Generische Scroll-Reveal-Sektion: einen Text-Panel, der beim Scrollen nach oben
// wandert, und darunter ein Bild mit Caption, das nach und nach sichtbar wird.
// Beide (SecretWeapon / Battle) nutzen dieses gleiche Muster — Daten werden
// als Props übergeben, Styling ist im CSS (index.css) gekapselt.
export default function ScrollRevealSection({ section }) {
  const {
    id,
    image,
    link,
    linkLabel,
    titleCover,
    coverBody,
  } = section;
  const { mode } = useLang();

  const ref = useRef(null);
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
  } = useScrollRevealStage(ref);

  return (
    <section
      id={id}
      ref={ref}
      className="relative border-y border-white/5 phase-gated"
    >
      <div
        className="absolute inset-0 hud-grid opacity-30"
        aria-hidden="true"
      />

      {/* PIN-BÜHNE: sticky, füllt Viewport, läuft über lange Scroll-Strecke ab */}
      <div className="relative h-[220vh]">
        <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-5xl mx-auto px-5 sm:px-8 h-full flex items-center justify-center">
            {/* REVEAL-SPALTE (unter dem Panel): Bild + Caption gestapelt, am Ende komplett sichtbar */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
              <p
                className="mono-label text-tiffany"
                style={{
                  textShadow: "0 0 6px #00f0ff, 0 0 12px #2dd3ee",
                }}
              >
                Projekte • Scroll to reveal
              </p>

              <motion.div
                style={{
                  y: imgY,
                  scale: imgScale,
                  opacity: imgOpacity,
                  filter: imgFilter,
                }}
                className="relative z-10 flex justify-center"
              >
                <motion.div
                  style={{ boxShadow: glowShadow }}
                  className="relative rounded-2xl overflow-hidden border border-white/10 w-full max-w-2xl"
                >
                  <img
                    src={asset(image)}
                    alt={titleCover.de}
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
                <h3 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl neon-text">
                  <a
                    href={link[mode === "en" ? "en" : "de"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan hover:text-neon transition-colors underline decoration-cyan/50 hover:decoration-neon font-road-rage text-pulse link-pulse"
                  >
                    <T en={linkLabel.en}>{linkLabel.de}</T>
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
                <h2
                  className="font-road-rage font-bold text-4xl sm:text-5xl tracking-tight leading-[1.05] link-pulse text-magenta"
                >
                  <T en={titleCover.en}>{titleCover.de}</T>
                </h2>
                {coverBody && (
                  <p className="mt-6 text-bone/75 leading-relaxed text-lg">
                    <T en={coverBody.en}>{coverBody.de}</T>
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
