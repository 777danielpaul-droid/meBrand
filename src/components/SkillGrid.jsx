import { cvData } from "../data/cv"
import SkillBar from "./SkillBar"

/**
 * SkillGrid — wiederverwendbare Grid-Anordnung für alle SkillBars.
 * Die Grid-Koordinaten (md:col-start-*, md:row-start-*, md:order-first)
 * stammen aus den Daten (cvData.skills / softSkills), nicht aus JSX.
 *
 * Ein 2-Spalten-Grid mit grid-auto-flow: dense, damit weiche Skills
 * (ohne explizite row-Position) die Lücken in Spalte 2 füllen, die
 * Git (col 2 row 1) hinterlässt.
 *
 * @param {number} baseDelay  — Stagger-Delay-Basis für Animation
 * @param {string} className
 */
export default function SkillGrid({ baseDelay = 0, className = "" }) {
  const items = [...cvData.skills, ...cvData.softSkills]
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 [grid-auto-flow:dense] ${className}`}>
      {items.map((s, i) => (
        <div key={s.name.de} className={`skill-item ${s.grid || ""}`}>
          <SkillBar label={s.name} level={s.level} color={s.color} icon={s.icon} index={i + baseDelay} />
        </div>
      ))}
    </div>
  )
}
