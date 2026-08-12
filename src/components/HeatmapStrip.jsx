import { useEffect, useRef } from "react";

/**
 * HeatmapStrip — dekoratives GitHub-Style-Beitrags-Heatmap-Grid.
 *
 * Exaktes Design des originalen HTML-Strips (53 Wochen × 7 Tage),
 * nur ohne Title, Subtitle, Stats, Legend oder Hintergrund-Fläche.
 * Die zufällige Intensität + Wave-Animation + Cell-Puls laufen
 * identisch zum Original-JS.
 */
const INTENSITIES = [1, 0.85, 0.7, 0.55, 0.4];
const BASE = [57, 211, 83];

export default function HeatmapStrip() {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cells = [];

    for (let w = 0; w < 53; w++) {
      for (let d = 0; d < 7; d++) {
        const cell = document.createElement("div");
        const intensity = INTENSITIES[(Math.random() * INTENSITIES.length) | 0];
        cell.className = "hm-cell";
        cell.style.background = `rgba(${BASE[0]}, ${BASE[1]}, ${BASE[2]}, ${intensity})`;
        cell.dataset.w = w;
        cell.dataset.d = d;
        grid.appendChild(cell);
        cells.push(cell);
      }
    }

    // Wave-opacity-animation (wie im Original)
    let waveOffset = 0;
    let raf = 0;
    const animateWave = () => {
      waveOffset += 0.15;
      cells.forEach((cell) => {
        const w = parseInt(cell.dataset.w, 10);
        const d = parseInt(cell.dataset.d, 10);
        const wave = Math.sin((w + d) * 0.3 + waveOffset);
        const baseOpacity = 0.5 + 0.5 * wave;
        cell.style.opacity = `${Math.max(0.3, Math.min(1, baseOpacity))}`;
      });
      raf = requestAnimationFrame(animateWave);
    };
    animateWave();

    // Zufälliger Cell-Puls (wie im Original)
    const pulseInterval = setInterval(() => {
      const idx = (Math.random() * cells.length) | 0;
      const cell = cells[idx];
      cell.style.animation = "cellWave 0.4s ease-out";
      setTimeout(() => { cell.style.animation = ""; }, 400);
    }, 80);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
      <div ref={gridRef} className="hm-grid" aria-label="Contribution activity heatmap" />
    </section>
  );
}
