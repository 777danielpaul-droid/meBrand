import { memo } from "react"

/**
 * ShadowHelmetIcon — minimalistischer Helmet-Schatten (ersetzt 🐻).
 * Einfache Form: ovale Schild-Kontur + dicker Antenne + vergrößerte Augen.
 */
const ShadowHelmetIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Antenne — dicker für bessere Sichtbarkeit */}
    <line x1="12" y1="3" x2="12" y2="7" strokeWidth="2" stroke="currentColor" strokeLinecap="round" />
    <circle cx="12" cy="7.5" r="2" fill="currentColor" />

    {/* Schild (oval) — nur OBERE HÄLFTE blau gefüllt */}
    <defs>
      <clipPath id="top-half">
        <rect x="0" y="0" width="24" height="12" />
      </clipPath>
    </defs>
    <ellipse cx="12" cy="13" rx="8" ry="6" fill="currentColor" opacity="0.7" clipPath="url(#top-half)" />
    <ellipse cx="12" cy="13" rx="8" ry="6" fill="none" strokeWidth="2.5" stroke="currentColor" />

    {/* Visor (dunkle Mulde) */}
    <path
      d="M7 13c2 2 5 3 10 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
    />

    {/* Augen — vergrößert + leicht unten + heller Kern */}
    <circle cx="10" cy="13" r="1.5" fill="currentColor" />
    <circle cx="10" cy="13" r="0.5" fill="rgba(255,255,255,0.6)" />
    <circle cx="15" cy="13" r="1.5" fill="currentColor" />
    <circle cx="15" cy="13" r="0.5" fill="rgba(255,255,255,0.6)" />
  </svg>
)

export default memo(ShadowHelmetIcon)
