// ZENTRALE MOTION-PRESETS — einheitliches Easing, Reveal-Varianten.
// exportiert werden nur die Presets, die tatsächlich verwendet werden.

// Einheitliches Easing (weich/expo-out) — überall verwendet für konsistente Bewegung.
export const EASE = [0.16, 1, 0.3, 1]

// Stagger-Container
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.08 } },
}
