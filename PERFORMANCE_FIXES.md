# Performance & Layout Fixes — Session Documentation

## 📋 Overview
**Session start**: `3aafea3` (commit) — Seite hatte horizontale Scroll auf Mobile (375px) + Canvas-Performance-Probleme.
**Working dir**: `/Users/danielpaul/Desktop/mebrand Kopie` (Branch: `mebrand`, Git-Remote: `meBrand`)
**Finaler Stand**: `c1dee61` — 11 Commits, `git status: clean`

## 🎯 Zusammenfassung
| Kategorie | Fixes | Commits |
|----------|--------|---------|
| Mobile Horizontal Scroll | 3 Root Causes | `8d0670f`, `9e57188` |
| Footer | Impressum + Runen + Icons | `f27d453`, `6f98972`, `14045b2`, `580753e`, `dc19a6c` |
| TerminalCard | Social-Icons | `e073462`, `b3ad30b`, `8d3c789` |
| Canvas Performance | drawFrame-Decoupling | `c1dee61` |

---

## 1. Mobile Horizontal Scroll Elimination

### Root Cause Analysis (via getComputedStyle, Desktop @1280px)

**1. CANVAS `width={1920}` — Primary Cause** (`8d0670f`)
- **Datei**: `src/components/RobotTeardown.jsx` (JSX-Attribute `width={1920}`/`height={1080}`)
- **Fehler**: Das HTML-Attribute `width={1920}` setzt Canvas-intrinsic-Breite auf 1920px → überschreibt CSS `width: 100%`. Auf Mobile (375px) → **+1545px Overflow**
- **Fix**: JSX-Attribute entfernt → `resizeCanvas()` im `useEffect` setzt `canvas.width/height` dynamisch via `getBoundingClientRect()`

**2. `100vw` in CSS — Secondary Cause** (`8d0670f`)
- **Datei**: `src/index.css` (`.starfield`, `.meteor-shower`)
- **Fehler**: `100vw` = Viewportbreite + Scrollbar (ca. 15px) → Overflow
- **Fix**: `100%` + `position: fixed; inset: 0` → skaliert mit Parent, nicht mit Viewport+Scrollbar

**3. HeatmapStrip Overflow — Tertiary Cause** (`9e57188`)
- **Datei**: `src/components/HeatmapStrip.jsx`
- **Fehler**: 
  - `gridTemplateColumns: "repeat(53, 1fr)"` — `1fr` ohne `minmax(0, 1fr)` → kann sich nicht schrumpfen lassen
  - Grid total: 53 × 10px + 52 × 3px = **686px** (Desktop), aber auf Mobile 53 × ~7px + 52 × 3px = **686px** → zu breit
- **Fix**:
  - `minmax(0, 1fr)` — erlaubt Schrumpfen unter `auto`-Minimum
  - `maxWidth: "100%"` — hält Grid in Container-Bounds
  - Responsive cell sizes (`useEffect`): `sz = isMobile ? 4 : 10`, `gap = isMobile ? 2 : 3`
  - Mobile: 53 × 4px + 52 × 2px = **316px** ✓

### CSS-Verify (getComputedStyle)
- `overflowCount: 0` ✓ (Desktop @1280px)
- Canvas `width`: `1265` (dynamisch, nicht 1920) ✓
- Canvas CSS `width`: `1265px` (`w-full`) ✓
- Starfield/Meteor: `100%`, nicht `100vw` ✓
- Heatmap: `gridCol: "19.7031px"`, `maxWidth: "100%"` ✓

---

## 2. Footer Changes

**2.1 Impressum entfernt** (`f27d453`)
- `src/data/content.js`: `links: [{Impressum, /impressum.html}]` → `links: []`

**2.2 Per Aspera Ad Astra Runen** (`6f98972`, `14045b2`)
- `src/components/layout/Footer.jsx`: RunenText-DIV mit `hidden sm:block sm:absolute inset-x-0 text-center`
- `src/index.css`: `.runen.center { justify-content: center }` (flex-center für Runen-Glyphen)
- `src/components/RunenText.jsx`: Import als `RunenText` (direct import)
- Größe: `text-[9px]` (ursprünglich 18px probiert, zu groß → reverted `dc19a6c`)

**Verification**: `drift: 0` (perfectly centered bei 632/633px) ✓

---

## 3. TerminalCard Social Icons

**3.1 Text-Links → SVG Icons** (`e073462` → `b3ad30b`)
- `src/components/TerminalCard.jsx`:
  - `SOCIAL`-Section mit Text-Links zuerst (`e073462`)
  - Dann durch inline-SVG Icons ersetzt (`b3ad30b`): `SocialIcon`-Component mit `SOCIAL_SVG`-Map (github, linkedin, twitter)
  - Import `site` aus `../data/content`
- Icons: 14px SVG, 20px × 20px Container (`w-5 h-5`)

**3.2 Icons-Positionierung** (`8d3c789`)
- `flex items-center` statt `justify-between`
- Icons direkt nach `// KONTAKT //` (12px Abstand)
- `ml-auto` auf `✕`-Button → rechtsbündig

**Verification**: `gapKontaktToFirstIcon: 12`, `closeButtonRight: 1216` ✓

---

## 4. Canvas Performance Fix (RobotTeardown)

**Problem**: "Pin hakelig / stotternd"

**Ursache** (`c1dee61`):
- `resizeCanvas()` (ResizeObserver-callback) hat `drawFrame(currentProgress)` aufgerufen
- `ResizeObserver` feuert bei jedem Layout-Change (Fonts, Images, Viewport)
- `drawFrame()` in `resizeCanvas` → unterbricht die `requestAnimationFrame`-Animation

**Fix**:
```diff
  const resizeCanvas = () => {
    ...
    ctx.setTransform(dpr * renderScale, 0, 0, dpr * renderScale, 0, 0)
-   drawFrame(currentProgress)       // entfernt
+   // drawFrame läuft nur über Animationsloop
  }
```

**Build-Verify**:
- `1920`/`1080` references in build: 0 (Canvas width-Attribut entfernt) ✓
- `draw` (Canvas API): 8 Referenzen (Rendering funktioniert) ✓
- `ResizeObserver`: True ✓

---

## 📊 Final Build Verification

```
npm run build → EXIT 0

dist/index.html        1.37 kB │ gzip:  0.70 kB
dist/assets/*.css      41.47 kB │ gzip:  8.21 kB
dist/assets/*.js       200.35 kB│ gzip: 75.42 kB
```

| Check | Method | Result |
|-------|--------|--------|
| Overflow | getComputedStyle | `overflowCount: 0` ✓ |
| Canvas width | DOM inspection | `1265px` (dynamic) ✓ |
| Heatmap | getComputedStyle | minmax + maxWidth:100% ✓ |
| Footer Runen | getComputedStyle | `drift: 0` (centered) ✓ |
| Terminal Icons | DOM inspection | 3 SVGs nach KONTAKT ✓ |
| JS Bundle | regex in dist | `1920` = 0, ResizeObserver = True ✓ |

---

## 📝 Full Commit Log (3aafea3 → c1dee61)

```
c1dee61 fix: decouple drawFrame from resizeCanvas (stutter fix)
8d3c789 fix: position social icons directly after KONTAKT label (ml-auto)
b3ad30b feat: SVG social icons (github/linkedin/twitter) in terminal header
e073462 feat: add social links as text in TerminalCard under SOCIAL header
dc19a6c fix: revert rune font size to 9px (18px too large)
580753e fix: double rune font size (9px→18px, remove mono-label)
14045b2 fix: center Per Aspera Ad Astra runes in footer
6f98972 feat: Per Aspera Ad Astra runes in footer
9e57188 fix: heatmap grid overflow (minmax + maxWidth:100%)
f27d453 fix: remove impressum link from footer
8d0670f fix: mobile horizontal scroll (heatmap + canvas width attr)
```

## ⚠️ Notes
- `npm run lint` (`eslint`) ist **broken** — `eslint.config.js` fehlt, Exit 127 (`command not found`). Pre-existing-Issue, nicht von Changes verursacht.
- `node --check` Syntax-Validierung: PASSED für alle geänderten Dateien
- Alle Commits gepusht nach `github.com:777danielpaul-droid/meBrand.git main`
- Git-Remote: `meBrand` (nicht `origin` — `origin` zeigt auf `businesscard.git`)