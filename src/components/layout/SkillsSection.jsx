import { motion } from "framer-motion"
import { stagger } from "../motion/variants"
import { site } from "../../data/content"
import { T } from "../RunenText"
import { SkillsGrid, SkillBar } from "../motion/SkillBar"

// Skills-Sektion — visualisiert den Skill-Balken-Diagrammen aus cv.js.
// Zeigt technische Skills als Balken, Tools als Chips und Sprachen als Balken.

export default function Skills() {
  const s = site.skills
  return (
    <section id="skills" className="relative z-20 py-24 phase-gated">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.p
          custom={0}
          initial="hidden"
          whileInView="show"
          variants={stagger}
          className="mono-label text-gold mb-4"
        >
          <T en={s.eyebrow.en}>{s.eyebrow.de}</T>
        </motion.p>
        <motion.h2
          custom={1}
          initial="hidden"
          whileInView="show"
          variants={stagger}
          className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-16"
        >
          <T en={s.title.en}>{s.title.de}</T>
        </motion.h2>

        {/* Skill-Balken */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
          className="mb-16"
        >
          <SkillsGrid skills={s.bars} labelKey="de" />
        </motion.div>

        {/* Zwei-Spalten: Tools + Sprachen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <h3 className="font-display font-bold text-lg text-cyan mb-4 mono-label">
              Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {s.tools.map((t, i) => (
                <motion.span
                  key={t}
                  custom={i}
                  variants={stagger}
                  className="mono-label text-xs px-3 py-1 rounded-sm bg-white/5 border border-white/10 text-bone/70 hover:text-bone hover:border-neon transition-colors"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
          >
            <h3 className="font-display font-bold text-lg text-cyan mb-4 mono-label">
              Sprachen
            </h3>
            {s.soft.map((l, i) => (
              <SkillBar
                key={l.de}
                label={l.de}
                level={l.de === "Deutsch — Muttersprache" ? 100 : 80}
                color={i === 0 ? "gold" : "neon"}
                index={i}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
