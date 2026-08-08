// ZENTRALE MOTION-PRESETS — einheitliches Easing, Reveal-Varianten.
// exportiert werden nur die Presets, die tatsächlich verwendet werden.

// Einheitliches Easing (weich/expo-out) — überall verwendet für konsistente Bewegung.
export const EASE = [0.16, 1, 0.3, 1]

// Title line variant for Hero headline
export const titleLine = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: 0.15 + i * 0.12 },
  }),
}

// Stagger-Container
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.08 } },
}
