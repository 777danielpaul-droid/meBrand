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

ReactDOM.createRoot(starfieldRoot).render(
  <React.StrictMode>
    <Starfield count={7777} />
  </React.StrictMode>,
)

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
