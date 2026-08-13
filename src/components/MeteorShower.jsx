import { useEffect, useRef } from "react";

/**
 * MeteorShower — dezente, gelegentliche Meteore im dunklen Hintergrund.
 *
 * Perfekt leicht: max. 3 gleichzeitige Meteore, keine Sterne, keine Partikel,
 * kein Scroll-Event. Canvas ist fixed/z-0, pointer-events: none.
 */
const METEOR_COUNT = 3; // gleichzeitig max. aktiv
const METEOR_INTERVAL = 8000; // alle ~8s ein neuer Meteor

export default function MeteorShower() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W, H;
    let meteors = [];
    let raf = 0;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function spawnMeteor() {
      if (reduce) return; // im Reduced-Motion-Modus keine Meteore
      if (meteors.length >= METEOR_COUNT) return;
      const angle = Math.random() * Math.PI * 0.5 + Math.PI * 0.25; // 45°–135°
      const speed = 0.6 + Math.random() * 0.8;
      const len = 18 + Math.random() * 12;
      const x = Math.random() < 0.5 ? -len : W + len;
      const y = Math.random() * H * 0.5; // nur im oberen Drittel
      meteors.push({
        x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, len, age: 0, maxAge: 90 + Math.random() * 60,
      });
    }

    let last = 0;
    let lastSpawn = 0;
    const FRAME = 1000 / 30; // 30fps reicht für einen dezenten Effekt

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (reduce) return;
      if (now - last < FRAME) return;
      last = now;

      // Spawn-Logik (zeitbasiert, nicht frame-basiert)
      if (now - lastSpawn > METEOR_INTERVAL * (0.5 + Math.random())) {
        lastSpawn = now;
        spawnMeteor();
      }

      ctx.clearRect(0, 0, W, H);
      const dt = (now - last) / 16;

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx * dt * 60;
        m.y += m.vy * dt * 60;
        m.age++;

        const life = m.age / m.maxAge;
        if (life >= 1) {
          meteors.splice(i, 1);
          continue;
        }

        const alpha = Math.min(1, life * 3) * (1 - life * 0.6);
        const brightness = 0.8 + 0.2 * Math.sin(m.age * 0.3);
        ctx.strokeStyle = `rgba(192, 38, 211, ${alpha})`;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * brightness})`;
        ctx.lineWidth = 1;
        ctx.lineCap = "round";

        // Lichtstrahl
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * m.len, m.y - m.vy * m.len);
        ctx.stroke();

        // Kopf
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.5 * brightness, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="meteor-shower"
      aria-hidden="true"
    />
  );
}
