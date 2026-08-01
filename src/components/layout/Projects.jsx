import { motion } from "framer-motion"
import { stagger, EASE } from "../motion/variants"
import { site } from "../../data/content"
import { T } from "../RunenText"
import { asset } from "../../lib/asset"

// Projects — grid of interactive cards mit Bild-Vorschau und Tech-Tags.
// Bilder sind Platzhalter, solange keine Projekt-Screenshots vorhanden sind.

function ProjectCard({ p, index }) {
  return (
    <motion.article
      key={p.id}
      custom={index}
      variants={stagger}
      className="group relative rounded-2xl neon-border glass card overflow-hidden hover:border-neon/50 transition-colors"
    >
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={asset("/placeholder-project.svg")}
          alt={p.title.de}
          className="w-full h-full object-cover opacity-80 group-hover:scale-[1.04] transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 mono-label text-xs text-neon bg-ink/60 px-2 py-1 rounded-sm">
          {p.date.de}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display font-bold text-xl text-bone group-hover:text-neon transition-colors">
          <T en={p.title.en}>{p.title.de}</T>
        </h3>
        <p className="mono-label text-cyan text-xs mt-1 mb-3">
          <T en={p.role.en}>{p.role.de}</T>
        </p>
        <p className="mt-3 text-sm text-bone/70 leading-relaxed line-clamp-3">
          <T en={p.desc.en}>{p.desc.de}</T>
        </p>
        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block mono-label text-xs text-cyan hover:text-neon transition-colors"
          >
            ↗ Live
          </a>
        )}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <span key={t} className="mono-label text-[9px] text-bone/40">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const ps = site.projects
  return (
    <section id="projekte" className="relative z-20 py-24 bg-ink/20 phase-gated">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.p
          custom={0}
          initial="hidden"
          whileInView="show"
          variants={stagger}
          className="mono-label text-gold mb-4"
        >
          <T en={site.projectSection.eyebrow.en}>{site.projectSection.eyebrow.de}</T>
        </motion.p>
        <motion.h2
          custom={1}
          initial="hidden"
          whileInView="show"
          variants={stagger}
          className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-16"
        >
          <T en={site.projectSection.title.en}>{site.projectSection.title.de}</T>
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {ps.map((p, i) => (
            <ProjectCard key={p.id} p={p} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
