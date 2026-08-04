import { useState } from "react"
import Navbar from "./components/layout/Navbar"
import Hero from "./components/layout/Hero"
import SecretWeapon from "./components/layout/SecretWeapon"
import Battle from "./components/layout/Battle"
import Footer from "./components/layout/Footer"
import SpaceStage from "./components/SpaceStage"
import CloudVolume from "./components/CloudVolume"
import RobotTeardown from "./components/RobotTeardown"
import TerminalCard from "./components/TerminalCard"
import { ScrollProgress } from "./components/motion/ScrollFX"
import { LangProvider } from "./components/RunenContext"

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
        <SecretWeapon />
        <RobotTeardown />
        <Battle />
      </main>
      <Footer className="footer-glow" />
    </LangProvider>
  )
}
