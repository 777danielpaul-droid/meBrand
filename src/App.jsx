import { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Navbar from "./components/layout/Navbar"
import Hero from "./components/layout/Hero"
import SecretWeapon from "./components/layout/SecretWeapon"
import Battle from "./components/layout/Battle"
import Footer from "./components/layout/Footer"
import SpaceStage from "./components/SpaceStage"
import CloudVolume from "./components/CloudVolume"
import TerminalCard from "./components/TerminalCard"
import { ScrollProgress } from "./components/motion/ScrollFX"
import { LangProvider } from "./components/RunenContext"

export default function App() {
  const [termOpen, setTermOpen] = useState(false)
  const spriteRef = useRef(null)

  useEffect(() => {
    if (typeof window === "undefined" || !spriteRef.current) return
    spriteRef.current?.addEventListener("loadedmetadata", () => {
      const duration = spriteRef.current?.duration || 4.16
      gsap.registerPlugin(ScrollTrigger)
      const ctx = gsap.context(() => {
        gsap.to(spriteRef.current, {
          currentTime: duration,
          ease: "none",
          scrollTrigger: {
            trigger: ".assembly-sprite-section",
            start: "top 90%",
            end: "bottom 10%",
            scrub: true,
            pin: true,
            invalidateOnRefresh: true,
          },
        })
      })
      return () => ctx.revert()
    })
  }, [])

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
        {/* Assembly Scroll-Driven Animation - nach SecretWeapon für Sichtbarkeit */}
        <div className="assembly-sprite-section relative mx-auto my-8 mt-[120vh] h-[600px] w-full max-w-4xl">
          <video
            ref={spriteRef}
            src="/assets/anim/assembly.mp4"
            autoPlay
            muted
            preload="auto"
            playsInline
            className="assembly-sprite absolute inset-0 h-full w-full object-cover"
            style={{ pointerEvents: "none" }}
          />
        </div>
        <SecretWeapon />
        <Battle />
      </main>
      <Footer className="footer-glow" />
    </LangProvider>
  )
}
