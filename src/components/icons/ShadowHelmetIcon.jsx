import { memo } from "react"

/**
 * ShadowHelmetIcon — minimalistischer Helmet-Schatten (ersetzt 🐻).
 * Einfache Form: ovale Schild-Kontur + Antenne + Auge.
 */
const ShadowHelmetIcon = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Antenne */}
    <line x1="12" y1="3" x2="12" y2="7" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" />
    <circle cx="12" cy="7.5" r="1.5" fill="currentColor" />

    {/* Schild (oval) — gefüllt für kräftige blaue Präsenz */}
    <ellipse cx="12" cy="13" rx="8" ry="6" fill="currentColor" opacity="0.7" />
    <ellipse cx="12" cy="13" rx="8" ry="6" fill="none" strokeWidth="1.5" stroke="currentColor" />

    {/* Visor (dunkle Mulde) */}
    <path
      d="M7 13c2 2 5 3 10 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.3"
    />

    {/* Auge */}
    <circle cx="10" cy="11.5" r="1" fill="currentColor" />
    <circle cx="15" cy="11.5" r="1" fill="currentColor" />
  </svg>
)

export default memo(ShadowHelmetIcon)
