import { useRef, useLayoutEffect, useState } from "react"
import { motion, useScroll, useTransform, useMotionValue, AnimatePresence } from "framer-motion"
import Reveal from "../motion/Reveal"
import { site } from "../../data/content"
import { T } from "../RunenText"
import { EASE } from "../motion/variants"
import RunenText from "../RunenText"

// ArchiveCard: Karten mit radialer Stapel-Animation beim Scrollen.
function ArchiveCard({ entry, index, count, progress }) {
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const rotate = useMotionValue(0)
  const opacity = useMotionValue(1)

  useLayoutEffect(() => {
    const card = cardRef.current
    const grid = card && card.parentElement
    if (!grid) return

    const apply = () => {
      const stacked = window.matchMedia("(min-width: 768px)").matches
      if (!stacked) return
      const g = grid.getBoundingClientRect()
      const r = card.getBoundingClientRect()
      const center = g.left + g.width / 2 - (r.left + r.width / 2)
      const rel = index - (count - 1) / 2
      const p = progress.get()
      let factor = 1 - p * 2
      if (factor < 0) factor = 0
      if (factor > 1) factor = 1
      x.set(factor * center + rel * 8)
      rotate.set(rel * 6 * (1 - factor))
      opacity.set(0.8 + factor * 0.2)
    }

    apply()
    const off = progress.on("change", apply)
    return off
  }, [progress, x, rotate, opacity, index, count])

  return (
    <motion.article
      ref={cardRef}
      style={{ x, rotate, opacity, zIndex: count - index }}
      className="rounded-xl neon-border glass card p-6 hover:border-gold/40 transition-colors"
    >
      <div className="mono-label text-neon">{entry.code}</div>
      <h3 className="font-display font-semibold text-lg mt-3 text-bone">
        <T>{entry.title.de}</T>
      </h3>
      <p className="mt-3 text-sm text-bone/60 leading-relaxed">
        <T>{entry.text.de}</T>
      </p>
    </motion.article>
  )
}

// InterceptCard: Interaktive Karten mit Chiffre-Entschlüsselung.
function InterceptCard({ msg, delay, z }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useLayoutEffect(() => {
    const card = ref.current
    const grid = card && card.parentElement
    if (!grid) return
    if (!window.matchMedia("(min-width: 640px)").matches) return
    const gcx = grid.clientWidth / 2
    const gcy = grid.clientHeight / 2
    const ccx = card.offsetLeft + card.offsetWidth / 2
    const ccy = card.offsetTop + card.offsetHeight / 2
    x.set(gcx - ccx)
    y.set(gcy - ccy)
  }, [x, y])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      style={{ x, y, zIndex: z }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left rounded-xl neon-border glass card p-6 transition-colors hover:border-cyan/40 focus:outline-none focus:border-cyan/60"
        aria-expanded={open}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="mono-label text-cyan">{msg.code}</span>
          <span className="text-bone/35">
            {open ? "Verbergen" : "Entschlüsseln"}
          </span>
        </div>
        <RunenText text={msg.cipher} className="text-2xl sm:text-3xl min-h-[4rem] sm:min-h-[4.5rem]" />
        <AnimatePresence initial={false}>
          {open && (
            <motion.p
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden text-bone/80 font-display text-lg italic border-t border-white/10 pt-4"
            >
              „{msg.plain.de}“
            </motion.p>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}

const DEAL = {
  "text-1": { delay: 0.2, z: 10 },
  "text-2": { delay: 0.95, z: 15 },
  "text-3": { delay: 0.95, z: 20 },
  "text-4": { delay: 0.95, z: 15 },
}

function Intercepts({ data }) {
  if (!data) return null
  return (
    <div className="mt-16">
      <Reveal className="mb-8" variant="up">
        <p className="mono-label text-cyan mb-3">
          <T>{data.eyebrow.de}</T>
        </p>
        <h3 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">
          <T>{data.title.de}</T>
        </h3>
        <p className="mt-3 text-sm text-bone/50">
          <T>{data.hint.de}</T>
        </p>
      </Reveal>
      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.messages.map((m) => {
          const d = DEAL[m.code] || { delay: 0.4, z: 10 }
          return <InterceptCard key={m.code} msg={m} delay={d.delay} z={d.z} />
        })}
      </div>
    </div>
  )
}

export default function WarRoomArchive() {
  const ref = useRef(null)
  const archiveGridRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const sector2Y = useTransform(scrollYProgress, [0.2, 0.55], ["100%", "0%"])

  return (
    <section ref={ref} id="archiv" className="relative phase-gated">
      <div className="relative h-[280vh]">
        <div className="sticky top-0 h-screen overflow-y-auto sm:overflow-hidden">
          <div className="absolute inset-0 z-10 bg-ink-soft border-y border-white/5 overflow-y-auto sm:overflow-hidden">
            <div className="absolute inset-0 hud-grid opacity-50" aria-hidden="true" />
            <div className="relative min-h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-center py-12">
              <Reveal className="mb-12" variant="up">
                <p className="mono-label text-gold mb-4">
                  <T>{site.archive.eyebrow.de}</T>
                </p>
                <h2 className="font-display font-bold text-4xl sm:text-5xl tracking-tight">
                  <T>{site.archive.title.de}</T>
                </h2>
              </Reveal>

              <div ref={archiveGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {site.archive.entries.map((e, i) => (
                  <ArchiveCard
                    key={e.code}
                    entry={e}
                    index={i}
                    count={site.archive.entries.length}
                    progress={scrollYProgress}
                  />
                ))}
              </div>

              <Intercepts data={site.archive.intercepts} />
            </div>
          </div>

          <motion.div
            style={{ y: sector2Y }}
            className="absolute inset-0 z-20 bg-ink-soft/10 border-t border-white/10 overflow-y-auto overflow-x-hidden archiv-scroll"
          >
            <div className="min-h-full max-w-7xl mx-auto px-5 sm:px-8 flex flex-col justify-center py-12">
              {/* Archiv-Inhalt */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
