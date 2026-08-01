import { motion } from "framer-motion"
import { stagger, EASE } from "./variants"

// SkillBar: ein Balken mit SVG-ähnlichem Glüheffekt, der aus cv.js Daten kommt.
// Farbsystem: neon (#c026d3), cyan (#22d3ee), gold (#f5c542) — aus index.css.
// Wiederverwendbar für Skills, Tools oder Sprachen.

const COLOR_MAP = {
  neon: "#c026d3",
  cyan: "#22d3ee",
  gold: "#f5c542",
}

export function SkillBar({ label, level, color = "neon", index = 0 }) {
  const hue = COLOR_MAP[color] || COLOR_MAP.neon
  return (
    <motion.div
      variants={stagger}
      custom={index}
      className="mb-3 last:mb-0"
    >
      <div className="flex justify-between mono-label text-xs text-bone/60 mb-1">
        <span>{label}</span>
        <span>{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.1 + index * 0.08 }}
          className="h-full rounded-full relative"
          style={{ background: `linear-gradient(90deg, ${hue}60, ${hue})` }}
        >
          <div
            className="absolute inset-0 rounded-full opacity-60 blur-[1px]"
            style={{
              boxShadow: `0 0 8px ${hue}, 0 0 16px ${hue}40`,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

// SkillsGrid: Container, der eine Liste von SkillBars abrendet.
// Akzeptiert { skills, labelKey } wo labelKey = "de" | "en"
export function SkillsGrid({ skills, labelKey = "de", delay = 0 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger}
      className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2"
    >
      {skills.map((s, i) => (
        <SkillBar
          key={s.name[labelKey] || s.name.de}
          label={s.name[labelKey] || s.name.de}
          level={s.level}
          color={s.color}
          index={i}
        />
      ))}
    </motion.div>
  )
}
