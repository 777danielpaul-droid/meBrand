import { useEffect, useRef } from "react";

/**
 * HeatmapStrip — dekoratives GitHub-Style-Beitrags-Heatmap-Grid.
 *
 * 7 Tage × 53 Wochen, 10×10px Zellen mit 3px Gap.
 * Wave-Opacity-Animation + zufälliger Cell-Puls (wie im Original).
 * Ohne Title, Legend oder Stats — nur das reine Grid.
 */
const INTENSITIES = [1, 0.85, 0.7, 0.55, 0.4];
const BASE = [57, 211, 83];

export default function HeatmapStrip() {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cells = [],
      isMobile = window.matchMedia("(max-width: 639px)").matches;
    const sz = isMobile ? 4 : 10,
      gap = isMobile ? 2 : 3;

    for (let w = 0; w < 53; w++) {
      for (let d = 0; d < 7; d++) {
        const cell = document.createElement("div");
        const intensity = INTENSITIES[(Math.random() * INTENSITIES.length) | 0];
        cell.style.width = sz + "px";
        cell.style.height = sz + "px";
        cell.style.borderRadius = "2px";
        cell.style.background = `rgba(${BASE[0]}, ${BASE[1]}, ${BASE[2]}, ${intensity})`;
        cell.style.transition = "transform 0.2s ease-out, opacity 0.2s ease-out";
        cell.dataset.w = w;
        cell.dataset.d = d;
        grid.appendChild(cell);
        cells.push(cell);
      }
    }
    grid.style.gap = gap + "px";

    // Wave-Opacity-Animation
    let waveOffset = 0;
    let animId;
    const animateWave = () => {
      waveOffset += 0.15;
      cells.forEach((cell) => {
        const w = parseInt(cell.dataset.w, 10);
        const d = parseInt(cell.dataset.d, 10);
        const wave = Math.sin((w + d) * 0.3 + waveOffset);
        const baseOpacity = 0.5 + 0.5 * wave;
        cell.style.opacity = `${Math.max(0.3, Math.min(1, baseOpacity))}`;
      });
      animId = requestAnimationFrame(animateWave);
    };
    animateWave();

    // Zufälliger Cell-Puls (Sparkle)
    let activeTimeout = null;
    const sparkleInterval = setInterval(() => {
      if (activeTimeout) clearTimeout(activeTimeout);
      const idx = (Math.random() * cells.length) | 0;
      const cell = cells[idx];
      cell.style.animation = "cellWave 0.4s ease-out";
      activeTimeout = setTimeout(() => { cell.style.animation = ""; }, 400);
    }, 80);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(sparkleInterval);
      if (activeTimeout) clearTimeout(activeTimeout);
      grid.innerHTML = "";
    };
  }, []);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-6 sm:py-8">
      <div
        ref={gridRef}
        className="hm-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(53, 1fr)",
          gap: "3px",
          justifyContent: "center",
        }}
        aria-label="Contribution activity heatmap"
      />
      <style>{`
        @keyframes cellWave {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
