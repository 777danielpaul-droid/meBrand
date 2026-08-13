import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import Starfield from "./components/Starfield.jsx"
import "./index.css"
import { getInitialTheme, applyTheme } from "./lib/theme.js"

// Theme vor dem ersten Paint setzen (kein Flash).
applyTheme(getInitialTheme())

const root = document.getElementById("root")

// Starfield als Geschwister-Element von #root in <body> mounten.
// Wichtig: NICHT innerhalb von #root — sonst fängt #root's Stacking-Context
// das Canvas ein. z-index:1 < #root:z-index:2.
const starfieldRoot = document.createElement("div")
root.parentNode.insertBefore(starfieldRoot, root.nextSibling)

// Mobile: reduzierte Sterne (300 reicht fuer dichteres Gefuehl).
// Desktop: voller Effekt (7777) — bei schwachen GPUs/Geräten kann der Nutzer
// prefers-reduced-motion aktivieren (Starfield checkt das intern und fallt auf
// statisches Rendering zurueck).
const STAR_COUNT = typeof window !== "undefined" && window.innerWidth < 768 ? 300 : 7777

ReactDOM.createRoot(starfieldRoot).render(
  <React.StrictMode>
    <Starfield count={STAR_COUNT} />
  </React.StrictMode>,
)

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
