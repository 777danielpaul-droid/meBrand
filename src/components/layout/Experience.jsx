import { motion } from "framer-motion"
import { stagger, EASE } from "../motion/variants"
import { site } from "../../data/content"
import { T } from "../RunenText"
import { asset } from "../../lib/asset"

// Experience-Sektion: Bildung (highlighted) + Berufserfahrung in zwei Spalten.

function EduItem({ e, index }) {
  return (
    <motion.div custom={index} variants={stagger}>
      <div className="rounded-xl neon-border glass card p-6 hover:border-neon/50 transition-colors">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-2">
          <h3 className="font-display font-bold text-bone/90">
            <T en={e.title.en}>{e.title.de}</T>
          </h3>
          <span className="mono-label text-xs text-bone/40">
            {e.date.de}
          </span>
        </div>
        {e.org && <p className="mono-label text-cyan text-xs mb-2"><T en={e.org.en}>{e.org.de}</T></p>}
        {e.desc && (
          <p className="mt-2 text-sm text-bone/70 leading-relaxed">
            <T en={e.desc.en}>{e.desc.de}</T>
          </p>
        )}
      </div>
    </motion.div>
  )
}

function WorkItem({ w, index }) {
  return (
    <motion.div custom={index} variants={stagger} className="last:border-0 last:pb-0 border-b border-white/5 pb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 mb-1">
        <h3 className="font-display font-bold text-bone/90">
          <T en={w.title.en}>{w.title.de}</T>
        </h3>
        <span className="mono-label text-xs text-bone/40">
          {w.date.de}
        </span>
      </div>
      {w.org && <p className="mono-label text-cyan text-xs mb-2">{w.org.de}</p>}
      {w.desc && <p className="text-sm text-bone/70 leading-relaxed"><T en={w.desc.en}>{w.desc.de}</T></p>}
    </motion.div>
  )
}

export default function Experience() {
  const e = site.experience
  return (
    <section id="erfahrung" className="relative z-20 py-24 bg-ink/20 phase-gated">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.p
          custom={0}
          initial="hidden"
          whileInView="show"
          variants={stagger}
          className="mono-label text-gold mb-4"
        >
          <T en={e.eyebrow.en}>{e.eyebrow.de}</T>
        </motion.p>
        <motion.h2
          custom={1}
          initial="hidden"
          whileInView="show"
          variants={stagger}
          className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-16"
        >
          <T en={e.title.en}>{e.title.de}</T>
        </motion.h2>

        {/* Ausbildung */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mb-20"
        >
          <h3 className="mono-label text-cyan text-xs uppercase tracking-[0.3em] mb-6">
            Ausbildung
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {e.education.map((item, i) => (
              <EduItem key={i} e={item} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Berufserfahrung */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <h3 className="mono-label text-cyan text-xs uppercase tracking-[0.3em] mb-6">
            Berufserfahrung
          </h3>
          {e.work.map((item, i) => (
            <WorkItem key={i} w={item} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
