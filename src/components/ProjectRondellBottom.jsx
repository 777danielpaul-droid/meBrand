import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { T } from "./RunenText";
import Shuttlez from "./Shuttlez";
import RocketBeam from "./RocketBeam";

/**
 * ProjectRondellBottom — Karussell ganz unten mit Shuttlez-Hintergrund.
 * Bereich ist screen-size (min-h-screen) und enthält das transparente
 * Shuttlez-Canvas als Hintergrund-Overlay. Karten wechseln per Klick/Pfeiltasten.
 * Links: statisches RocketBeam-Schiff (Engines-on, kein Interaktion nötig).
 *
 * Der RocketBeam-Button schaltet das Shuttlez-Spiel (Mausklick-Laser) erst frei,
 * wenn die Engines ausgeschaltet werden — spart Performance durch gleichzeitige
 * Canvas-Animationen.
 */
export default function ProjectRondellBottom({ sections, id, className = "" }) {
  const [rocketActive, setRocketActive] = useState(true);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);
  const pauseRef = useRef(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (pauseRef.current) return;
      setCurrent((c) => (c + 1) % sections.length);
    }, 8000);
    return () => clearInterval(intervalRef.current);
  }, [sections.length]);

  const prev = () => setCurrent((c) => (c - 1 + sections.length) % sections.length);
  const next = () => setCurrent((c) => (c + 1) % sections.length);

  // Tastatur-Pfeile
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest("[data-rondell-bottom]")) return;
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, sections.length]);

  const s = sections[current];

  return (
    <section
      id={id}
      className={`relative min-h-screen h-auto bg-ink/10 border-t border-white/5 overflow-visible ${className}`}
      data-rondell-bottom
      onMouseEnter={() => { pauseRef.current = true; }}
      onMouseLeave={() => { pauseRef.current = false; }}
    >
      {/* Shuttlez als transparenter Hintergrund — gleiche Schiffegröße wie Hero */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto">
        <Shuttlez shipScale={1.2} className="hidden md:block" active={!rocketActive} />
      </div>

      {/* Verdunkelter Overlay entfernt — Shuttlez-Hintergrund bleibt durchscheinend */}

      {/* RocketBeam-Schiff links (Desktop: 25% Breite, mobil/tablet versteckt) */}
      <div className="absolute top-0 left-[18%] h-full hidden md:block overflow-visible" style={{ width: "25%" }}>
        <RocketBeam enginesOn={true} onEnginesChange={setRocketActive} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto mr-0 sm:mr-auto sm:ml-[30%] px-5 sm:px-8 py-20 sm:py-24">

        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8"
            style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          >
            <h3
              className="font-display font-bold text-2xl sm:text-3xl mb-3"
              style={{ color: s.accent }}
            >
              <T en={s.title.en}>{s.title.de}</T>
            </h3>
            <p className="text-bone/70 leading-relaxed mb-4 text-sm sm:text-base">
              <T en={s.desc.en}>{s.desc.de}</T>
            </p>
            {s.image && (
              <div className="mb-4 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={s.image}
                  alt={s.title.de}
                  className="w-full h-40 sm:h-48 object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {s.tech.map((t) => (
                <span
                  key={t}
                  className="mono-label text-[10px] px-2 py-0.5 rounded bg-ink/40 text-bone/50"
                >
                  {t}
                </span>
              ))}
            </div>
            {s.url && (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan hover:text-neon text-sm underline decoration-cyan/50 hover:decoration-neon transition-colors link-pulse"
              >
                <T en={s.url.replace("https://", "")}>{s.url.replace("https://", "")}</T>
              </a>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Indikatoren + Pfeile */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            aria-label="Vorherige Karte"
            className="w-8 h-8 rounded-full bg-ink/40 border border-white/10 hover:bg-ink/60 text-bone/60 hover:text-cyan transition-all cursor-pointer flex items-center justify-center"
          >
            ‹
          </button>
          <div className="flex items-center gap-1.5">
            {sections.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === current
                    ? "w-5 bg-cyan/80 shadow-[0_0_6px_theme(colors.cyan)]"
                    : "bg-bone/30"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            aria-label="Nächste Karte"
            className="w-8 h-8 rounded-full bg-ink/40 border border-white/10 hover:bg-ink/60 text-bone/60 hover:text-cyan transition-all cursor-pointer flex items-center justify-center"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
