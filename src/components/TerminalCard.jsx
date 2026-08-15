import { useEffect, useRef } from "react"
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion"
import RunenText from "./RunenText"
import { useTerminalCommands } from "./motion/useTerminalCommands"
import { asset } from "../lib/asset"
import { profile, site } from "../data/content"
import SkillGrid from "./SkillGrid"

// Runen-Text-Klasse für Terminal-Ausgabe (größer als die Mini-Runen in Cards)
const RUNEN_TEXT_CLASS = "text-xl sm:text-2xl"

// Telefonnummer: client-seitig aus dem umgekehrten String rekonstruiert (Bot-Schutz)
function TerminalPhone({ phoneReverse }) {
  return <span className="text-cyan text-xs">{phoneReverse.split("").reverse().join("")}</span>
}

// Social-Icons (SVG, identisch zum Footer) — klein für Terminal-Header
const SOCIAL_SVG = {
  github: <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.83-.258.83-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.469-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.813 5.604-5.489 5.951.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297 24 5.67 18.627.297 12 .297"></path>,
  linkedin: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.451v6.289zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 012.063-2.063 2.062 2.062 0 012.062 2.063 2.063 2.063 0 01-2.062 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.222 9c-.019.033-.038.064.038-.099 0 3.226-.157 5.752-.754 7.604-2.322-1.902-3.96-4.428-4.724-7.404 1.032-.156 2.048-.244 3.048-.244 3.929 0 6.69 2.342 7.222 5.829l.734-.448c.734-5.546.413-10.278-1.542-13.777-1.085-.92-2.32-1.67-3.63-2.223-1.183-.553-2.45-.857-3.73-.857-3.4 0-6.127 2.637-6.673 6.129.083.033.166.065.233.085.564.165 1.048.585 1.278 1.128.38.858.268 1.856-.37 2.598-.638.74-1.667 1.128-2.683 1.128-1.089 0-2.02-.322-2.809-.87-.073-.04-1.616-.972-1.407-3.732.043-.589.157-1.137.337-1.634-2.208 2.072-3.72 5.025-3.72 8.284 0 3.417 1.332 6.502 3.528 8.832-.213.058.445.085-.679.085-1.534 0-2.86-.554-3.939-1.445.368-.534.654-1.008.873-1.427.035-.07.07-.14.105-.212.033-.073.066-.146.098-.22z"></path>,
  twitter: <path d="M18.244 2.25h3.308l-7.227 8.26 0 11.084 0 0-7.105-8.26H3.125l7.7 9.465-7.5 11.314h3.331l6.36-9.73 5.3 9.73h3.308l-7.88-10.14z"></path>,
}

function SocialIcon({ name, href, label }) {
  const path = SOCIAL_SVG[name]
  if (!path) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid place-items-center w-5 h-5 rounded border border-white/15 text-cyan hover:text-neon hover:border-neon/50 transition-all"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {path}
      </svg>
    </a>
  )
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
            {/* Header — KONTAKT-Titel + mittig zentrierte Runenbotschaft über volle Breite */}
            <div className="px-4 py-2 border-b border-white/10 bg-ink/40 mono-label text-cyan text-xs tracking-[0.2em]">
              <div className="flex items-center">
                <span>// KONTAKT //</span>
                {/* Social-Icons direkt nach KONTAKT, linksbündig */}
                <div className="flex items-center gap-2 ml-3">
                  {site.footer.social.map((s, i) => (
                    <SocialIcon key={i} name={s.icon} href={s.href} label={s.label} />
                  ))}
                </div>
                <button
                  type="submit"
                  aria-label="Terminal schließen"
                  onClick={onClose}
                  className="ml-auto grid place-items-center w-6 h-6 rounded border border-white/15 text-bone/60 hover:text-bone hover:border-neon/50 transition-all"
                >
                  <span className="text-xs leading-none">✕</span>
                </button>
              </div>
              {/* Runen-Botschaft mittig über die volle Breite */}
              <div className="mt-1 flex justify-center">
                <RunenText text="Flaschenpost ins All:" className="text-xs sm:text-sm" />
              </div>
            </div>

            {/* Split: Log links + Input-Fenster rechts (bis zur Mitte) */}
            <div className="flex-1 flex overflow-y-auto px-4 py-3 gap-4">
              {/* Log links — nur Ausgaben */}
              <div
                ref={logRef}
                onClick={() => inputRef.current?.focus()}
                className="flex-1 min-w-0"
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
                    {/* Kontaktdaten als Terminal-Log (Label Zeile 1, Wert Zeile 2) */}
                    <div className="mt-3 flex flex-col gap-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="mono-label text-[11px] uppercase tracking-[0.3em] text-cyan/60">EMAIL</span>
                        <span className="text-cyan text-sm font-medium">{profile.contact.email}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="mono-label text-[11px] uppercase tracking-[0.3em] text-cyan/60">GITHUB</span>
                        <a
                          href={profile.contact.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan hover:text-neon transition-colors text-sm font-medium"
                        >
                          github.com/777danielpaul-droid
                        </a>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="mono-label text-[11px] uppercase tracking-[0.3em] text-cyan/60">PHONE</span>
                        <TerminalPhone phoneReverse={profile.contact.phoneReverse} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="mono-label text-[11px] uppercase tracking-[0.3em] text-cyan/60">LOCATION</span>
                        <span className="text-cyan text-sm font-medium">{profile.contact.address.de}</span>
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
            </div>

              {/* Input-Fenster rechts — Runen-Eingabe oben + blinkender Cursor */}
              <div
                onClick={() => inputRef.current?.focus()}
                className="w-64 md:w-1/2 min-w-[14rem] border-l border-white/10 flex flex-col pt-3 px-4 pb-2"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <RunenText text={current} className={RUNEN_TEXT_CLASS} />
                  <span
                    className={
                      "inline-block bg-cyan rounded-sm animate-blink " +
                      (warPrompt ? "w-[0.6em] h-5" : "w-2.5 h-5")
                    }
                  />
                </div>
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
            {/* Skill-Balken — mobil ausgeblendet, nur Profildaten sichtbar */}\
            <div
              className="border-t border-white/5 bg-[rgba(0,0,0,0.35)] backdrop-blur-sm p-4 sm:p-6 hidden md:block"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.35)" }}
            >
              <h3 className="mono-label text-cyan text-xs uppercase tracking-[0.3em] text-center mb-4">
                Technische Skills &amp; Sprachen
              </h3>
              <SkillGrid baseDelay={0} className="mb-4" />
            </div>
          </div>
        </motion.div>
        </MotionConfig>
      )}
    </AnimatePresence>
  )
}
