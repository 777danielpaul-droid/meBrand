import { motion } from "framer-motion"
import { stagger, EASE } from "./motion/variants"
import { T } from "./RunenText"

// SkillBar: wiederverwendbarer Balken mit glühendem Effekt und Icon.
// Farbe ist ein CSS-Farbstring (z.B. "#c026d3").
// label kann ein String (deutsch) oder ein {de, en} Objekt sein.
export default function SkillBar({ label, level, color, icon, index }) {
  const enLabel = typeof label === "object" ? label.en : undefined
  const deLabel = typeof label === "object" ? label.de : label
  return (
    <motion.div
      custom={index}
      variants={stagger}
      className="mb-3 last:mb-0"
    >
      <div className="flex justify-between mono-label text-xs text-bone/80 mb-1">
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
          <T en={enLabel}>{deLabel}</T>
        </span>
        <span>{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
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
