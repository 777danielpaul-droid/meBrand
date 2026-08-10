import { useState } from "react"
import Navbar from "./components/layout/Navbar"
import Hero from "./components/layout/Hero"
import ScrollRevealSection from "./components/ScrollRevealSection"
import Footer from "./components/layout/Footer"
import SpaceStage from "./components/SpaceStage"
import CloudVolume from "./components/CloudVolume"
import RobotTeardown from "./components/RobotTeardown"
import TerminalCard from "./components/TerminalCard"
import { ScrollProgress } from "./components/motion/ScrollFX"
import { LangProvider } from "./components/RunenContext"
import ProjectRondellBottom from "./components/ProjectRondellBottom"
import { site } from "./data/content"

export default function App() {
  const [termOpen, setTermOpen] = useState(false)

  return (
    <LangProvider>
      <SpaceStage />
      <CloudVolume />
      <ScrollProgress />
      <Navbar termOpen={termOpen} setTermOpen={setTermOpen} />
      <TerminalCard open={termOpen} onClose={() => setTermOpen(false)} />
      <main className="relative z-10">
        <Hero />
        <RobotTeardown />
        {site.revealSections.map((s) => (
          <ScrollRevealSection key={s.id} section={s} />
        ))}
      </main>
      {/* Einfaches Rondell ganz unten — Projekte-Karussell ohne Scroll-Reveal */}
      <ProjectRondellBottom sections={site.rondellSections} />
      <Footer className="footer-glow" />
    </LangProvider>
  )
}
