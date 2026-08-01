import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Starfield from './components/Starfield.jsx'
import './index.css'
import { getInitialTheme, applyTheme } from './lib/theme.js'

// Theme vor dem ersten Paint setzen (kein Flash).
applyTheme(getInitialTheme())

const root = document.getElementById('root')

// Starfield als Geschwister-Element von #root in <body> mounten.
// Wichtig: NICHT innerhalb von #root, da #root ein Stacking-Context
// erzeugt und das Canvas sonst einfängt. z-index:1 < #root:z-index:2.
const starfieldRoot = document.createElement('div')
root.parentNode.insertBefore(starfieldRoot, root.nextSibling)

ReactDOM.createRoot(starfieldRoot).render(
  <React.StrictMode>
    <Starfield count={1000} />
  </React.StrictMode>
)

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
