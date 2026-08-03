import { motion, useScroll, useTransform, useMotionValue } from "framer-motion"
import { stagger, EASE } from "../motion/variants"
import { site } from "../../data/content"
import { cvData } from "../../data/cv"
import { T, default as RunenText } from "../RunenText"
import SpacecraftVideo from "../SpacecraftVideo"
import { useRef, useLayoutEffect } from "react"

// SkillBar: wiederverwendbarer Balken mit glühendem Effekt und Icon.
// Farbe ist ein CSS-Farbstring (z.B. "#c026d3").
function SkillBar({ label, level, color, icon, index }) {
  return (
    <motion.div
      custom={index}
      variants={stagger}
      className="mb-3 last:mb-0"
    >
      <div className="flex justify-between mono-label text-xs text-bone/60 mb-1">
        <span className="flex items-center gap-2">
          {icon && (
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 flex-shrink-0"
              style={{ color }}
              fill="currentColor"
              aria-hidden="true"
            >
              <path d={icon} />
            </svg>
          )}
          <T>{label}</T>
        </span>
        <span>{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 + index * 0.08 }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color}60, ${color})`,
          }}
        >
          <div
            className="absolute inset-0 rounded-full opacity-70"
            style={{
              boxShadow: `0 0 8px ${color}, 0 0 16px ${color}40`,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

const TITLE_SHADOW =
  "2px 2px rgba(0,0,0,0.55), 4px 4px rgba(0,0,0,0.5), 6px 6px rgba(0,0,0,0.45), " +
  "8px 8px rgba(0,0,0,0.4), 10px 10px rgba(0,0,0,0.38), 12px 12px rgba(0,0,0,0.34), " +
  "14px 14px rgba(0,0,0,0.3), 16px 16px rgba(0,0,0,0.28), 18px 18px rgba(0,0,0,0.25), " +
  "20px 20px rgba(0,0,0,0.22), 24px 24px 10px rgba(0,0,0,0.3)"

export default function Hero() {
  const h = site.hero
  const c = cvData
  const { scrollY } = useScroll()
  const blobY = useTransform(scrollY, [0, 800], [0, 220])
  const blobOpacity = useTransform(scrollY, [0, 600], [1, 0.3])

  return (
    <section id="hero" className="hero-holo relative motion-reveal min-h-[56.25vw] h-screen max-h-[680px] bg-transparent">
      <SpacecraftVideo />

      <motion.div
        style={{ y: blobY, opacity: blobOpacity }}
        className="absolute top-24 right-[-6rem] w-[18rem] h-[18rem] sm:w-[28rem] sm:h-[28rem] rounded-full bg-neon/25 blur-[60px] sm:blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20 w-full h-full flex flex-col justify-center">
        <div className="relative">
          {/* Name + Lead (bleibt erhalten) */}
          <motion.h1
            className="font-display font-bold leading-[1.05] tracking-tight text-3xl sm:text-7xl lg:text-8xl max-w-4xl break-words"
            style={{ filter: TITLE_SHADOW }}
          >
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="block">
              <RunenText text="DANIEL" className="text-cyan block" />
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="block">
              <RunenText text="PAUL" className="text-cyan block" />
            </motion.span>
          </motion.h1>

          {/* Skill-Tags (bleiben erhalten) */}
          {h.skills && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5"
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
            className="mt-4 text-xl sm:text-2xl text-cyan font-display max-w-2xl"
          >
            <T en={c.role.en}>{c.role.de}</T>
          </motion.p>

          {/* Portrait + Kontaktdaten (zwei Spalten) — klickbar! */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start pointer-events-auto"
          >
            {/* Portrait */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(109,38,217,0.2)]">
                <img
                  src={c.portrait}
                  alt={c.name.de}
                  className="w-full h-full object-cover opacity-80"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Kontaktdaten */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="mono-label text-xs text-cyan/70">E-Mail</span>
                <a
                  href={`mailto:${c.contact.email}`}
                  className="block text-cyan hover:text-neon transition-colors mt-1"
                >
                  {c.contact.email}
                </a>
              </div>
              <div>
                <span className="mono-label text-xs text-cyan/70">GitHub</span>
                <a
                  href={c.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-cyan hover:text-neon transition-colors mt-1"
                >
                  github.com/777danielpaul-droid
                </a>
              </div>
              <div>
                <span className="mono-label text-xs text-cyan/70">Telefon</span>
                <span
                  className="block text-cyan mt-1"
                  aria-label={c.contact.phone}
                >
                  {c.contact.phone}
                </span>
              </div>
              <div>
                <span className="mono-label text-xs text-cyan/70">Standort</span>
                <span className="block text-cyan mt-1">
                  <T en={c.contact.address.en}>{c.contact.address.de}</T>
                </span>
              </div>
            </div>
          </motion.div>


          {/* Technische Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8"
          >
            <h3 className="mono-label text-cyan text-xs uppercase tracking-[0.3em] mb-4">
              Technische Skills
            </h3>
            {c.skills.map((s, i) => (
              <SkillBar
                key={s.name.de}
                label={s.name.de}
                level={s.level}
                color={s.color}
                icon={s.icon}
                index={i}
              />
            ))}
          </motion.div>

          {/* Sprachen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-6"
          >
            <h3 className="mono-label text-cyan text-xs uppercase tracking-[0.3em] mb-4">
              Sprachen
            </h3>
            {c.softSkills.map((s, i) => (
              <SkillBar
                key={s.name.de}
                label={s.name.de}
                level={s.level}
                color={s.color}
                icon={s.icon}
                index={i}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
