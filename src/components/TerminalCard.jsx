import { useEffect, useRef } from "react"
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion"
import RunenText from "./RunenText"
import { useTerminalCommands } from "./motion/useTerminalCommands"
import { asset } from "../lib/asset"
import { profile } from "../data/content"
import { cvData } from "../data/cv"
import SkillBar from "./SkillBar"

// Runen-Text-Klasse für Terminal-Ausgabe (größer als die Mini-Runen in Cards)
const RUNEN_TEXT_CLASS = "text-xl sm:text-2xl"

// Telefonnummer: client-seitig aus dem umgekehrten String rekonstruiert (Bot-Schutz)
function TerminalPhone({ phoneReverse }) {
  return <span className="text-cyan text-xs">{phoneReverse.split("").reverse().join("")}</span>
}

export default function TerminalCard({ open, onClose }) {
  const shouldReduce = useReducedMotion()
  const {
    lines,
    current,
    setCurrent,
    warPrompt,
    reset,
    submit,
  } = useTerminalCommands()

  const inputRef = useRef(null)
  const logRef = useRef(null)

  // Autofokus beim Öffnen + Escape schließt + Reset beim Schließen.
  useEffect(() => {
    if (!open) {
      reset()
      return
    }
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    const onKey = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey) }
  }, [open, onClose, reset])

  // Autoscroll ans Ende (bei neuer Zeile + live beim Tippen).
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [lines, current, open, warPrompt])

  const handleSubmit = () => {
    const result = submit()
    if (result === "close") onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <MotionConfig
          transition={{
            duration: shouldReduce ? 0 : 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            layout
            initial={{ height: 0, opacity: 0, y: -12 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -12 }}
            className="overflow-hidden"
          >
          <div
            className={
              "mx-5 sm:mx-8 mb-6 mt-20 rounded-xl neon-border glass sheen " +
              "terminal-scanlines text-bone font-mono text-sm " +
              "flex flex-col h-[60vh] max-h-[70vh]"
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-ink/40 mono-label text-cyan text-xs tracking-[0.2em]">
              <span>// KONTAKT //</span>
              <button
                type="submit"
                aria-label="Terminal schließen"
                onClick={onClose}
                className="grid place-items-center w-6 h-6 rounded border border-white/15 text-bone/60 hover:text-bone hover:border-neon/50 transition-all"
              >
                <span className="text-xs leading-none">✕</span>
              </button>
            </div>

            {/* Log */}
            <div
              ref={logRef}
              onClick={() => inputRef.current?.focus()}
              className="flex-1 overflow-y-auto px-4 py-3 relative"
            >
              {lines.length === 0 && (
                <>
                  {/* Profilbild in Passfoto-Größe, linksbündig */}
                  <div className="mb-4">
                    <img
                      src={asset(profile.portrait)}
                      alt={profile.name.de}
                      className="w-24 h-24 object-cover rounded-lg ring-2 ring-cyan/30 border border-cyan/20"
                    />
                  </div>
                  {/* Kontaktdaten als Terminal-Log */}
                  <div className="mt-3 flex flex-col gap-1 text-sm">
                    <div className="flex items-center gap-2 text-cyan/70">
                      <span className="w-2 h-2 rounded-full bg-cyan/40 animate-pulse" />
                      <span className="mono-label text-[10px] uppercase tracking-[0.2em]">EMAIL</span>
                      <span className="text-cyan text-xs">{profile.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-cyan/70">
                      <span className="w-2 h-2 rounded-full bg-cyan/40" />
                      <span className="mono-label text-[10px] uppercase tracking-[0.2em]">GITHUB</span>
                      <a
                        href={profile.contact.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan hover:text-neon transition-colors text-xs"
                      >
                        github.com/777danielpaul-droid
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-cyan/70">
                      <span className="w-2 h-2 rounded-full bg-cyan/40" />
                      <span className="mono-label text-[10px] uppercase tracking-[0.2em]">PHONE</span>
                      <TerminalPhone phoneReverse={profile.contact.phoneReverse} />
                    </div>
                    <div className="flex items-center gap-2 text-cyan/70">
                      <span className="w-2 h-2 rounded-full bg-cyan/40" />
                      <span className="mono-label text-[10px] uppercase tracking-[0.2em]">LOCATION</span>
                      <span className="text-cyan text-xs">{profile.contact.address.de}</span>
                    </div>
                  </div>
                </>
              )}

              {/* Status-Zeile (runic) */}
              {lines.length > 0 && (
                <div className="flex items-center gap-2 text-cyan text-xs mono-label mb-2">
                  <span className="text-bone/40">text</span>
                  <span className="text-bone/50">@</span>
                  <span className="text-bone/40">text</span>
                  <span className="text-bone/60">:~ $</span>
                </div>
              )}

              {lines.map((l, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  {l.startsWith("go to war?") ? (
                    <span className="text-cyan text-lg font-bold tracking-wider animate-pulse">
                      {l}
                    </span>
                  ) : (
                    <RunenText text={l} className={RUNEN_TEXT_CLASS} />
                  )}
                </div>
              ))}

              {/* Aktuelle Eingabe (live als Runen) + Cursor */}
              <div className="flex items-center gap-1.5 mt-1">
                <RunenText text={current} className={RUNEN_TEXT_CLASS} />
                <span
                  className={
                    "inline-block bg-cyan rounded-sm animate-blink " +
                    (warPrompt ? "w-[0.6em] h-5" : "w-2.5 h-5")
                  }
                />
              </div>
            </div>

            {/* Verstecktes Eingabefeld: fängt Tastatur/Cursor ab, Rendering läuft oben als Runen. */}
            <input
              ref={inputRef}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSubmit()
                }
              }}
              onClick={(e) => e.currentTarget.select()}
              className="absolute opacity-0 -z-10 pointer-events-none"
              aria-label="Runen-Eingabe"
              autoComplete="off"
              spellCheck={false}
            />
            {/* Skill-Balken — DUPLIZIERT aus RobotTeardown, NICHT gelöscht bei Teardown */}
            <div className="border-t border-white/5 bg-ink/30 backdrop-blur-sm p-4 sm:p-6">
              <h3 className="mono-label text-cyan text-xs uppercase tracking-[0.3em] text-center mb-4">
                Technische Skills &amp; Sprachen
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {cvData.skills.map((s, i) => (
                  <div key={s.name.de} className="skill-item">
                    <SkillBar
                      label={s.name.de}
                      level={s.level}
                      color={s.color}
                      icon={s.icon}
                      index={i}
                    />
                  </div>
                ))}
                {cvData.softSkills.map((s, i) => {
                  const isLast = i === cvData.softSkills.length - 1;
                  return (
                    <div
                      key={s.name.de}
                      className={`skill-item justify-self-end ${
                        isLast ? "md:col-start-2 md:row-start-4" : "md:col-start-2"
                      }`}
                    >
                      <SkillBar
                        label={s.name.de}
                        level={s.level}
                        color={s.color}
                        icon={s.icon}
                        index={i + cvData.skills.length}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
        </MotionConfig>
      )}
    </AnimatePresence>
  )
}
