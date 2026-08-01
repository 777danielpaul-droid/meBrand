import { motion, useScroll, useTransform } from "framer-motion"
import { titleLine } from "../motion/variants"
import { site } from "../../data/content"
import { cvData } from "../../data/cv"
import { T, default as RunenText } from "../RunenText"

const TITLE_SHADOW =
  "2px 2px rgba(0,0,0,0.55), 4px 4px rgba(0,0,0,0.5), 6px 6px rgba(0,0,0,0.45), " +
  "8px 8px rgba(0,0,0,0.4), 10px 10px rgba(0,0,0,0.38), 12px 12px rgba(0,0,0,0.34), " +
  "14px 14px rgba(0,0,0,0.3), 16px 16px rgba(0,0,0,0.28), 18px 18px rgba(0,0,0,0.25), " +
  "20px 20px rgba(0,0,0,0.22), 24px 24px 10px rgba(0,0,0,0.3)"

export default function Hero() {
  const h = site.hero
  const { scrollY } = useScroll()
  const blobY = useTransform(scrollY, [0, 800], [0, 220])
  const blobOpacity = useTransform(scrollY, [0, 600], [1, 0.3])

  return (
    <section id="top" className="hero-holo relative bg-theatre overflow-hidden motion-reveal">
      <motion.div
        style={{ y: blobY, opacity: blobOpacity }}
        className="absolute top-24 right-[-6rem] w-[18rem] h-[18rem] sm:w-[28rem] sm:h-[28rem] rounded-full bg-neon/25 blur-[60px] sm:blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20 w-full pointer-events-none">
        <div className="relative">
          {/* HeadtitleLine + Copy + CTAs */}
          <motion.p
            custom={0}
            initial="hidden"
            animate="show"
            variants={titleLine}
            className="mono-label text-neon mb-6"
          >
            <T en={h.eyebrow.en}>{h.eyebrow.de}</T>
          </motion.p>

          <h1
            className="font-display font-bold leading-[1.05] tracking-tight text-3xl sm:text-7xl lg:text-8xl max-w-4xl break-words"
            style={{ filter: TITLE_SHADOW }}
          >
            <motion.span custom={1} initial="hidden" animate="show" variants={titleLine} className="block">
              <RunenText text="DANIEL" className="text-cyan block" />
            </motion.span>
            <motion.span custom={2} initial="hidden" animate="show" variants={titleLine} className="block">
              <RunenText text="PAUL" className="text-cyan block" />
            </motion.span>
          </h1>

          {/* Lead-Titel (linksbündig) */}
          <motion.p
            custom={4}
            initial="hidden"
            animate="show"
            variants={titleLine}
            className="mt-4 text-xl sm:text-2xl text-bone/80 font-display max-w-2xl"
          >
            <T en={h.lead.title.en}>{h.lead.title.de}</T>
          </motion.p>

          {/* Lead-Haupttext (linksbündig) */}
          <motion.p
            custom={4.5}
            initial="hidden"
            animate="show"
            variants={titleLine}
            className="mt-4 text-lg sm:text-xl text-bone/70 max-w-2xl leading-relaxed"
          >
            <T en={h.lead.body.en}>{h.lead.body.de}</T>
          </motion.p>

          {/* Skill-Tags */}
          {h.skills && (
            <motion.div
              custom={4.5}
              initial="hidden"
              animate="show"
              variants={titleLine}
              className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5"
            >
              {h.skills.map((s, i) => (
                <span
                  key={i}
                  className="mono-label text-xs text-cyan/70 bg-cyan/5 border border-cyan/15 rounded px-2 py-0.5"
                >
                  <T en={s.en}>{s.de}</T>
                </span>
              ))}
            </motion.div>
          )}

          <motion.div
            custom={5}
            initial="hidden"
            animate="show"
            variants={titleLine}
            className="mt-10 flex flex-wrap gap-4 pointer-events-auto"
          >
            <a
              href={h.primaryCta.href}
              className="mono-label bg-cyan hover:bg-cyan/80 transition-colors text-ink px-6 py-3 rounded-sm shadow-[0_0_40px_rgba(34,211,238,0.45)]"
            >
              <T en={h.primaryCta.label.en}>{h.primaryCta.label.de}</T>
            </a>
            <a
              href={h.secondaryCta.href}
              className="mono-label border border-white/15 hover:border-gold/60 text-bone px-6 py-3 rounded-sm transition-colors"
            >
              <T en={h.secondaryCta.label.en}>{h.secondaryCta.label.de}</T>
            </a>
          </motion.div>

          <motion.div
            custom={5}
            initial="hidden"
            animate="show"
            variants={titleLine}
          >
            <motion.div
              style={{ y: useTransform(scrollY, [0, 800], [0, 60]) }}
              className="absolute bottom-8 right-8 hidden lg:block mono-label text-bone/30"
            >
              {/* [T168] */}
              text168
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
