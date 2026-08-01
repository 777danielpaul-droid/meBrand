import { motion, useScroll, useTransform } from "framer-motion"
import { EASE, titleLine } from "../motion/variants"
import { site } from "../../data/content"
import { useVotes } from "../../lib/votes"
import { useCountUp } from "../../lib/countup"
import { T } from "../RunenText"

const NEON = ["#c026d3", "#7c3aed", "#22d3ee", "#c9a227"]

function randomNeon() {
  return NEON[(Math.random() * NEON.length) | 0]
}

const TITLE_SHADOW =
  "2px 2px rgba(0,0,0,0.55), 4px 4px rgba(0,0,0,0.5), 6px 6px rgba(0,0,0,0.45), " +
  "8px 8px rgba(0,0,0,0.4), 10px 10px rgba(0,0,0,0.38), 12px 12px rgba(0,0,0,0.34), " +
  "14px 14px rgba(0,0,0,0.3), 16px 16px rgba(0,0,0,0.28), 18px 18px rgba(0,0,0,0.25), " +
  "20px 20px rgba(0,0,0,0.22), 24px 24px 10px rgba(0,0,0,0.3)"

export default function Hero() {
  const h = site.hero
  const votes = useVotes()

  const MILCHMAEUSE_BASE = h.milchmaeuseBase || 17171

  const nWiderstand = useCountUp(
    votes.loaded ? votes.erdbaeren : 0,
    0,
    votes.loaded
  )
  const nUnterdruecker = useCountUp(
    votes.loaded ? MILCHMAEUSE_BASE + votes.milchmaeuse : MILCHMAEUSE_BASE,
    MILCHMAEUSE_BASE,
    votes.loaded
  )

  const liveValue = (label) => {
    if (label === "Der Widerstand") return nWiderstand.toLocaleString("de-DE")
    if (label === "Die Unterdrücker") return nUnterdruecker.toLocaleString("de-DE")
    return null
  }

  const { scrollY } = useScroll()
  const blobY = useTransform(scrollY, [0, 800], [0, 220])
  const blobOpacity = useTransform(scrollY, [0, 600], [1, 0.3])

  return (
    <section id="top" className="hero-holo relative bg-theatre grain overflow-hidden motion-reveal">
      <motion.div
        style={{ y: blobY, opacity: blobOpacity }}
        className="absolute top-24 right-[-6rem] w-[18rem] h-[18rem] sm:w-[28rem] sm:h-[28rem] rounded-full bg-neon/25 blur-[60px] sm:blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20 w-full pointer-events-none">
        <div className="relative">
          {/* LINKS: HeadtitleLine + Copy + CTAs + Stats */}

          <motion.p
            custom={0}
            initial="hidden"
            animate="show"
            variants={titleLine}
            className="mono-label text-neon mb-6"
          >
            <T en="text">text</T>
          </motion.p>

          <h1
            className="font-display font-bold leading-[1.05] tracking-tight text-3xl sm:text-7xl lg:text-8xl max-w-4xl break-words"
            style={{ filter: TITLE_SHADOW }}
          >
            <motion.span custom={1} initial="hidden" animate="show" variants={titleLine} className="block title-rainbow">
              <T en="text">text</T>
            </motion.span>
            <motion.span
              custom={2}
              initial="hidden"
              animate="show"
              variants={titleLine}
              className="block title-rainbow"
            >
              <T en="text">text</T>
            </motion.span>
          </h1>

          <motion.p
            custom={3}
            initial="hidden"
            animate="show"
            variants={titleLine}
            className="mt-8 text-lg sm:text-xl text-bone/70 max-w-2xl leading-relaxed"
          >
            <T en="text">text</T>
          </motion.p>

          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={titleLine}
            className="mt-10 flex flex-wrap gap-4 pointer-events-auto"
          >
            <a
              href={h.primaryCta.href}
              className="mono-label bg-neon hover:bg-neon-2 transition-colors text-white px-6 py-3 rounded-sm shadow-[0_0_40px_rgba(192,38,211,0.45)]"
            >
              <T en="text">text</T>
            </a>
            <a
              href={h.secondaryCta.href}
              className="mono-label border border-white/15 hover:border-gold/60 text-bone px-6 py-3 rounded-sm transition-colors"
            >
              <T en="text">text</T>
            </a>
          </motion.div>

          <motion.div
            custom={5}
            initial="hidden"
            animate="show"
            variants={titleLine}
            className="mt-16 grid grid-cols-1 sm:grid-cols-4 gap-px bg-white/5 border border-white/10 rounded-xl overflow-hidden max-w-4xl"
          >
            {h.stats.map((s, index) => (
              <div key={index} className="bg-white/5 px-6 py-6 backdrop-blur-sm">
                <div className="font-display font-bold text-3xl text-gold text-glow-gold">
                  {liveValue(s.label.de) ?? s.value.de}
                </div>
                <div className="mono-label text-bone/50 mt-2"><T en={s.label.en}>{s.label.de}</T></div>
              </div>
            ))}
          </motion.div>
          {/* end */}
        </div>
      </div>

      <motion.div
        style={{ y: useTransform(scrollY, [0, 800], [0, 60]) }}
        className="absolute bottom-8 right-8 hidden lg:block mono-label text-bone/30"
      >
        text
      </motion.div>
    </section>
  )
}
