import { motion, useScroll, useTransform, useMotionValue } from "framer-motion"
import { useRef, useLayoutEffect } from "react"
import { stagger, EASE } from "../motion/variants"
import { cvData } from "../../data/cv"
import { T } from "../RunenText"

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

// ProjectCardRadial: Projekt-Karte mit radialer Stapel-Animation beim Scrollen.
// Beim Scrollen schieben die Karten sich radial auseinander und ordnen sich –
// ähnlich dem Archiv-Effekt, aber mit anderen Scroll-Offsets für die CV-Sektion.
function ProjectCardRadial({ p, index, count, progress }) {
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const opacity = useMotionValue(1)

  // Radial-Position: Karten mittig, nach oben verschoben beim Scrollen
  useLayoutEffect(() => {
    const card = cardRef.current
    const grid = card && card.parentElement
    if (!grid) return

    const apply = (p) => {
      const stacked = window.matchMedia("(min-width: 1024px)").matches
      if (!stacked) return

      const g = grid.getBoundingClientRect()
      const r = card.getBoundingClientRect()
      const naturalLeft = r.left - x.get()
      const center = g.left + g.width / 2 - (naturalLeft + r.width / 2)

      // Karten starten auseinander (factor=1 bei p=0), sammeln sich beim Scrollen zur Mitte (factor=0 bei p=0.5+)
      let factor = 1 - p * 2  // p=0 → 1, p=0.5 → 0, p>0.5 → 0
      if (factor < 0) factor = 0
      if (factor > 1) factor = 1

      x.set(factor * center)
      opacity.set(0.8 + factor * 0.2)
    }

    apply(progress.get())
    const off = progress.on("change", apply)
    return off
  }, [progress, x, opacity])

  const rel = index - (count - 1) / 2
  // Rotation: am Anfang leicht, verschwindet beim Scrollen (sammelt sich zur Mitte)
  const rotate = useTransform(progress, [0, 0.5], [rel * 8, 0])

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={stagger}
      style={{ x, rotate, opacity }}
      className="rounded-xl neon-border glass card p-6 hover:border-neon/50 transition-colors group"
    >
      <div className="flex justify-between items-baseline mb-2">
        <h4 className="font-display font-bold text-bone/90 group-hover:text-neon transition-colors">
          <T en={p.title.en}>{p.title.de}</T>
        </h4>
        <span className="mono-label text-xs text-bone/40">
          {p.date.de}
        </span>
      </div>
      <p className="mono-label text-cyan text-xs mb-2">
        <T en={p.role.en}>{p.role.de}</T>
      </p>
      <p className="text-sm text-bone/70 leading-relaxed line-clamp-3">
        <T en={p.desc.en}>{p.desc.de}</T>
      </p>
      {p.url && (
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block mono-label text-xs text-cyan hover:text-neon transition-colors"
        >
          ↗ {p.url.replace("https://", "")}
        </a>
      )}
    </motion.div>
  )
}

// CvSection — ergänzende Business-Card-Sektion mit Daniel Pauls Profil-Daten.
// Erscheint im Space-Theme-Fluss zwischen Battle und WarRoomArchive.
export default function CvSection() {
  const c = cvData
  const cvRef = useRef(null)
  const projectsGridRef = useRef(null)

  // Scroll-Linked Progress für die Karten-Stapel-Animation
  const { scrollYProgress } = useScroll({
    target: cvRef,
    offset: ["start start", "end end"],
  })

  return (
    <section
      id="cv"
      ref={cvRef}
      className="relative z-20 py-28 bg-ink/10 border-y border-white/5 phase-gated"
    >
      <div className="absolute inset-0 hud-grid opacity-10" aria-hidden="true" />
      <div className="max-w-5xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <motion.p
          custom={0}
          initial="hidden"
          whileInView="show"
          variants={stagger}
          className="mono-label text-gold mb-4"
        >
          /* Profil */
        </motion.p>
        <motion.h2
          custom={1}
          initial="hidden"
          whileInView="show"
          variants={stagger}
          className="font-display font-bold text-4xl sm:text-5xl tracking-tight text-cyan mb-6"
        >
          Daniel Paul
        </motion.h2>
        <motion.p
          custom={2}
          initial="hidden"
          whileInView="show"
          variants={stagger}
          className="text-bone/70 text-lg leading-relaxed mb-12 max-w-2xl"
        >
          <T en={c.role.en}>{c.role.de}</T>
        </motion.p>

        {/* Portrait + Kontakt in zwei Spalten */}
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start mb-20">
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="show"
            variants={stagger}
            className="flex-shrink-0"
          >
            <div className="w-48 h-48 rounded-xl overflow-hidden border border-neon/30 shadow-[0_0_40px_rgba(123,30,43,0.3)]">
              <img
                src={c.portrait}
                alt={c.name.de}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            whileInView="show"
            variants={stagger}
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
          >
            <div className="space-y-4">
              <div>
                <span className="mono-label text-xs text-bone/40">E-Mail</span>
                <a
                  href={`mailto:${c.contact.email}`}
                  className="block text-bone/80 hover:text-neon transition-colors mt-1"
                >
                  {c.contact.email}
                </a>
              </div>
              <div>
                <span className="mono-label text-xs text-bone/40">Telefon</span>
                <span
                  className="block text-bone/80 mt-1 numRotate"
                  aria-label={c.contact.phone}
                  style={{ direction: "rtl", unicodeBidi: "bidi-override" }}
                >
                  {c.contact.phone.split("").reverse().join("")}
                </span>
              </div>
              <div>
                <span className="mono-label text-xs text-bone/40">Standort</span>
                <span className="block text-bone/80 mt-1">
                  <T en={c.contact.address.en}>{c.contact.address.de}</T>
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <span className="mono-label text-xs text-bone/40">GitHub</span>
                <a
                  href={c.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-bone/80 hover:text-neon transition-colors mt-1"
                >
                  github.com/777danielpaul-droid
                </a>
              </div>
              <div>
                <span className="mono-label text-xs text-bone/40">Tools</span>
                <div className="flex flex-wrap gap-3 mt-1">
                  {c.tools.map((t) => (
                    <span
                      key={t.name}
                      className="mono-label text-[9px] text-bone/30 flex items-center gap-1"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3 h-3"
                        style={{ color: "#6d28d9" }}
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d={t.icon} />
                      </svg>
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Skill-Balken */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mb-20"
        >
          <h3 className="mono-label text-cyan text-xs uppercase tracking-[0.3em] mb-6">
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

        {/* Soft Skills */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="mb-20"
        >
          <h3 className="mono-label text-cyan text-xs uppercase tracking-[0.3em] mb-6">
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

        {/* Projekte-Vorschau mit radialer Karten-Stapel-Animation */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          <h3 className="mono-label text-cyan text-xs uppercase tracking-[0.3em] mb-6">
            Projekte
          </h3>
          <div ref={projectsGridRef} className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
            {c.projects.map((p, i) => (
              <ProjectCardRadial
                key={p.id}
                p={p}
                index={i}
                count={c.projects.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
