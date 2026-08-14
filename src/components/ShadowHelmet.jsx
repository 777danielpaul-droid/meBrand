import { useEffect, useRef } from "react";
import "./ShadowHelmet.css";

/**
 * ShadowHelmet — Canvas-Animation eines schwebenden, interaktiven Helms.
 *
 * Port des Standalone-HTML/Demos aus shadow-helmet.html, 1:1 ohne
 * Design- oder Funktionsänderungen. Cursor-Tracking, Physik,
 * Blinken, Laser-FX — alles originalgetreu erhalten.
 *
 * Maus-Events werden auf dem Dokumentebene gehört (wie im Original-HTML,
 * wo #wrap die ganze Viewportfläche abdeckte). Dadurch funktioniert
 * die Interaktion auch, wenn andere Hero-Elemente im Stacking davorliegen.
 */
export default function ShadowHelmet() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- State (wie im Original) ---
    let W, H, DPR;
    const mouse = { x: -999, y: -999, px: -999, py: -999 };
    const helm = { x: 0, y: 0, vx: 0, vy: 0, tilt: 0 };
    let time = 0;
    let laserPower = 0;
    let pulse = 0;
    let laserFlicker = 0;

    const lookTarget = { x: 0, y: 0 };
    const lookCurrent = { x: 0, y: 0 };
    let lookTimer = 0;
    let lookNextChange = 2 + Math.random() * 3;

    let blinkState = 0;
    let blinkTimer = 0;
    let blinkDuration = 0.12;
    let blinkNext = 1.5 + Math.random() * 3;
    let blinkProgress = 0;

    const wrap = canvas.parentElement;

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      if (helm.x === 0) {
        helm.x = W / 2;
        helm.y = H / 2;
      }
    }
    resize();
    window.addEventListener("resize", resize);

    // Maus-Events auf Document-Ebene (Original-HTML nutzte #wrap als ganze
    // Viewport). Dadurch funktioniert Tracking auch, wenn hero-Content
    // im Stacking über dem Canvas liegt.
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      helm.px = mouse.x;
      helm.py = mouse.y;
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    function updatePhysics() {
      const dx = mouse.x - helm.x;
      const dy = mouse.y - helm.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const trigger = 200;

      let approaching = false;
      if (helm.px !== -999) {
        const pd = Math.sqrt(
          (helm.px - helm.x) ** 2 + (helm.py - helm.y) ** 2
        );
        approaching = dist < pd;
      }

      let ax = 0,
        ay = 0;
      if (dist < trigger && dist > 0) {
        const f = (trigger - dist) / trigger;
        const nx = dx / dist,
          ny = dy / dist;
        if (approaching) {
          ax += nx * f * 1.4;
          ay += ny * f * 1.4;
        } else {
          ax -= nx * f * 1.0;
          ay -= ny * f * 1.0;
        }
      }
      ax += (W / 2 - helm.x) * 0.0025;
      ay += (H / 2 - helm.y) * 0.0025;

      helm.vx += ax;
      helm.vy += ay;
      helm.vx *= 0.86;
      helm.vy *= 0.86;
      helm.x += helm.vx;
      helm.y += helm.vy;

      const m = 90;
      if (helm.x < m) {
        helm.x = m;
        helm.vx *= -0.4;
      }
      if (helm.x > W - m) {
        helm.x = W - m;
        helm.vx *= -0.4;
      }
      if (helm.y < m) {
        helm.y = m;
        helm.vy *= -0.4;
      }
      if (helm.y > H - m) {
        helm.y = H - m;
        helm.vy *= -0.4;
      }

      helm.tilt += (helm.vx * 0.012 - helm.tilt) * 0.1;

      const targetLaser =
        dist < 160 && dist > 0 && blinkState === 0 ? 1 : 0;
      laserPower += (targetLaser - laserPower) * 0.12;
      laserFlicker = Math.random();
      pulse += 0.08 + laserPower * 0.4;
    }

    function updateEyes(dt) {
      blinkTimer += dt;
      if (blinkState === 0) {
        if (blinkTimer >= blinkNext) {
          blinkState = 1;
          blinkTimer = 0;
          blinkDuration = 0.08 + Math.random() * 0.06;
        }
      } else if (blinkState === 1) {
        blinkProgress += dt / (blinkDuration * 0.4);
        if (blinkProgress >= 1) {
          blinkProgress = 1;
          blinkState = 2;
          blinkTimer = 0;
        }
      } else if (blinkState === 2) {
        if (blinkTimer >= blinkDuration * 0.2) {
          blinkState = 3;
          blinkTimer = 0;
        }
      } else if (blinkState === 3) {
        blinkProgress -= dt / (blinkDuration * 0.4);
        if (blinkProgress <= 0) {
          blinkProgress = 0;
          blinkState = 0;
          blinkTimer = 0;
          blinkNext = 1.5 + Math.random() * 3;
        }
      }

      const cursorNear =
        mouse.x !== -999 &&
        Math.sqrt((mouse.x - helm.x) ** 2 + (mouse.y - helm.y) ** 2) < 250;

      if (cursorNear) {
        lookTarget.x = mouse.x;
        lookTarget.y = mouse.y;
      } else {
        lookTimer += dt;
        if (lookTimer >= lookNextChange) {
          lookTimer = 0;
          lookNextChange = 1.5 + Math.random() * 2.5;
          const angle = Math.random() * Math.PI * 2;
          const r = 80 + Math.random() * 200;
          lookTarget.x = helm.x + Math.cos(angle) * r;
          lookTarget.y = helm.y + Math.sin(angle) * r;
        }
      }

      lookCurrent.x += (lookTarget.x - lookCurrent.x) * 0.06;
      lookCurrent.y += (lookTarget.y - lookCurrent.y) * 0.06;
    }

    function drawHelmet(x, y, s, tilt) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);
      const sc = s;

      // ===== HELM-FÜLLUNG: opak, metallisch, kontrastreich =====
      // Hell genug, dass der Helm ins Auge fällt — aber nicht blendend.
      const C1 = "#0f1014";
      const C2 = "#1d2027";
      const C3 = "#323844";
      const C4 = "#485060";
      const C5 = "#5e6a7d";

      const antWiggle = Math.sin(time * 3) * 0.06;
      const antBaseX = 0;
      const antBaseY = -0.88 * sc;
      const antTipX = antBaseX + Math.sin(antWiggle) * 0.1 * sc;
      const antTipY = antBaseY - 0.42 * sc;

      ctx.beginPath();
      ctx.moveTo(antBaseX, antBaseY);
      ctx.quadraticCurveTo(
        antBaseX + 0.03 * sc,
        antBaseY - 0.2 * sc,
        antTipX,
        antTipY
      );
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#2d313a";
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(antTipX, antTipY, 8, 0, Math.PI * 2);
      const ballGrad = ctx.createRadialGradient(
        antTipX - 2,
        antTipY - 2,
        1,
        antTipX,
        antTipY,
        8
      );
      ballGrad.addColorStop(0, "#81d8d0");
      ballGrad.addColorStop(0.5, "#0abab5");
      ballGrad.addColorStop(1, "#046b68");
      ctx.fillStyle = ballGrad;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#023d3a";
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(antTipX - 2, antTipY - 2, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, sc, 0, Math.PI * 2);
      const sphereGrad = ctx.createRadialGradient(
        -0.25 * sc,
        -0.35 * sc,
        sc * 0.05,
        0,
        0,
        sc
      );
      sphereGrad.addColorStop(0, C5);
      sphereGrad.addColorStop(0.25, C4);
      sphereGrad.addColorStop(0.55, C3);
      sphereGrad.addColorStop(0.85, C2);
      sphereGrad.addColorStop(1, C1);
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      /* Helm-Kontur (dünner Ring) komplett entfernt — sie störte das dunkle Finish */
      // ctx.lineWidth = 1.5;
      // ctx.strokeStyle = "#040507";
      // ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-0.9 * sc, -0.1 * sc);
      ctx.bezierCurveTo(
        -0.55 * sc,
        -0.58 * sc,
        0.55 * sc,
        -0.58 * sc,
        0.9 * sc,
        -0.1 * sc
      );
      ctx.bezierCurveTo(
        0.95 * sc,
        0.08 * sc,
        0.88 * sc,
        0.42 * sc,
        0.65 * sc,
        0.68 * sc
      );
      ctx.bezierCurveTo(
        0.35 * sc,
        0.88 * sc,
        -0.35 * sc,
        0.88 * sc,
        -0.65 * sc,
        0.68 * sc
      );
      ctx.bezierCurveTo(
        -0.88 * sc,
        0.42 * sc,
        -0.95 * sc,
        0.08 * sc,
        -0.9 * sc,
        -0.1 * sc
      );
      ctx.closePath();

      const shieldGrad = ctx.createRadialGradient(
        0,
        -0.05 * sc,
        3,
        0,
        0.2 * sc,
        0.75 * sc
      );
      shieldGrad.addColorStop(0, "rgba(0, 0, 0, 0.9)");
      shieldGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.85)");
      shieldGrad.addColorStop(1, "rgba(0, 0, 0, 0.8)");
      ctx.fillStyle = shieldGrad;
      ctx.fill();
      /* Schild-Kontur komplett entfernt — kein dünner Ring mehr */
      // ctx.lineWidth = 1.2;
      // ctx.strokeStyle = "#06070a";
      // ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-0.78 * sc, -0.12 * sc);
      ctx.bezierCurveTo(
        -0.48 * sc,
        -0.52 * sc,
        0.48 * sc,
        -0.52 * sc,
        0.78 * sc,
        -0.12 * sc
      );
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      /* dünne weiße Randkante am Schild komplett entfernt */
      // ctx.stroke();

      // LED-Augen: hellere Basis + intensivere Cyan-Füllung
      const eyeGlow = Math.sin(pulse) * 0.1 + 1.05;
      const eyeR = 0.19 * sc;
      const stretchY = 1.55;

      const lookDx = (lookCurrent.x - helm.x) * 0.08;
      const lookDy = (lookCurrent.y - helm.y) * 0.08;
      const maxLook = 6;
      const clampedLookX = Math.max(-maxLook, Math.min(maxLook, lookDx));
      const clampedLookY = Math.max(-maxLook, Math.min(maxLook, lookDy));

      const blinkScale = 1 - blinkProgress * 0.95;
      let effectiveBlink = blinkScale;
      if (blinkState === 2) effectiveBlink = 0;

      ctx.save();
      ctx.translate(
        -0.26 * sc + clampedLookX * 0.5,
        -0.06 * sc + clampedLookY * 0.3
      );
      ctx.scale(1, stretchY * effectiveBlink);

      ctx.beginPath();
      ctx.arc(0, 0, eyeR * 1.6, 0, Math.PI * 2);
      const lg1 = ctx.createRadialGradient(0, 0, 0, 0, 0, eyeR * 1.6);
      lg1.addColorStop(0, `rgba(220, 250, 255, ${eyeGlow * 0.95})`);
      lg1.addColorStop(0.5, `rgba(0, 190, 255, ${eyeGlow * 0.55})`);
      lg1.addColorStop(1, `rgba(0, 80, 200, ${eyeGlow * 0.15})`);
      ctx.fillStyle = lg1;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, eyeR, 0, Math.PI * 2);
      const cg1 = ctx.createRadialGradient(0, 0, 0, 0, 0, eyeR);
      cg1.addColorStop(0, `rgba(240, 255, 255, ${eyeGlow})`);
      cg1.addColorStop(0.6, `rgba(110, 220, 255, ${eyeGlow * 0.75})`);
      cg1.addColorStop(1, `rgba(0, 150, 255, ${eyeGlow * 0.35})`);
      ctx.fillStyle = cg1;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(
        0.26 * sc + clampedLookX * 0.5,
        -0.06 * sc + clampedLookY * 0.3
      );
      ctx.scale(1, stretchY * effectiveBlink);

      ctx.beginPath();
      ctx.arc(0, 0, eyeR * 1.6, 0, Math.PI * 2);
      const lg2 = ctx.createRadialGradient(0, 0, 0, 0, 0, eyeR * 1.6);
      lg2.addColorStop(0, `rgba(220, 250, 255, ${eyeGlow * 0.95})`);
      lg2.addColorStop(0.5, `rgba(0, 190, 255, ${eyeGlow * 0.55})`);
      lg2.addColorStop(1, `rgba(0, 80, 200, ${eyeGlow * 0.15})`);
      ctx.fillStyle = lg2;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, eyeR, 0, Math.PI * 2);
      const cg2 = ctx.createRadialGradient(0, 0, 0, 0, 0, eyeR);
      cg2.addColorStop(0, `rgba(240, 255, 255, ${eyeGlow})`);
      cg2.addColorStop(0.6, `rgba(110, 220, 255, ${eyeGlow * 0.75})`);
      cg2.addColorStop(1, `rgba(0, 150, 255, ${eyeGlow * 0.35})`);
      ctx.fillStyle = cg2;
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }

    function drawCrazyLaser(eyeX, eyeY, tx, ty, power) {
      if (power < 0.02) return;
      const dx = tx - eyeX,
        dy = ty - eyeY;
      const baseAngle = Math.atan2(dy, dx);
      const dist = Math.sqrt(dx * dx + dy * dy);

      const flick = 0.7 + laserFlicker * 0.3 + Math.sin(time * 25) * 0.15;
      const p = power * flick;

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      const auraW = 60 + Math.sin(time * 8) * 15;
      ctx.beginPath();
      ctx.moveTo(eyeX, eyeY);
      ctx.lineTo(
        tx + Math.cos(baseAngle) * 600,
        ty + Math.sin(baseAngle) * 600
      );
      ctx.lineWidth = auraW * p;
      ctx.strokeStyle = `rgba(0, 255, 200, ${0.12 * p})`;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(eyeX, eyeY);
      ctx.lineTo(
        tx + Math.cos(baseAngle) * 600,
        ty + Math.sin(baseAngle) * 600
      );
      ctx.lineWidth = 38 * p;
      ctx.strokeStyle = `rgba(0, 220, 255, ${0.25 * p})`;
      ctx.stroke();

      for (let w = 0; w < 2; w++) {
        ctx.beginPath();
        const waveOffset = w === 0 ? 0.08 : -0.08;
        const waveFreq = 0.03;
        const waveAmp = 4 * p;
        for (let i = 0; i <= dist + 200; i += 3) {
          const ax = eyeX + Math.cos(baseAngle + waveOffset) * i;
          const ay = eyeY + Math.sin(baseAngle + waveOffset) * i;
          const wave =
            Math.sin(i * waveFreq - time * 20 + w * Math.PI) *
            waveAmp *
            (i / (dist + 200));
          const wx = ax + Math.cos(baseAngle + Math.PI / 2) * wave;
          const wy = ay + Math.sin(baseAngle + Math.PI / 2) * wave;
          if (i === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.lineWidth = 6 * p;
        ctx.strokeStyle = `rgba(100, 255, 220, ${0.4 * p})`;
        ctx.stroke();
      }

      ctx.beginPath();
      const noiseFreq = 0.05;
      const noiseAmp = 2.5 * p;
      for (let i = 0; i <= dist + 300; i += 2) {
        const ax = eyeX + Math.cos(baseAngle) * i;
        const ay = eyeY + Math.sin(baseAngle) * i;
        const noise =
          (Math.random() - 0.5) * noiseAmp +
          Math.sin(i * noiseFreq + time * 30) * noiseAmp * 0.5;
        const nx = ax + Math.cos(baseAngle + Math.PI / 2) * noise;
        const ny = ay + Math.sin(baseAngle + Math.PI / 2) * noise;
        if (i === 0) ctx.moveTo(nx, ny);
        else ctx.lineTo(nx, ny);
      }
      ctx.lineWidth = 14 * p;
      ctx.strokeStyle = `rgba(150, 255, 240, ${0.7 * p})`;
      ctx.lineCap = "round";
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(eyeX, eyeY);
      ctx.lineTo(
        tx + Math.cos(baseAngle) * 750,
        ty + Math.sin(baseAngle) * 750
      );
      ctx.lineWidth = 6 * p;
      ctx.strokeStyle = `rgba(220, 255, 250, ${0.9 * p})`;
      ctx.stroke();

      ctx.beginPath();
      for (let i = 0; i <= dist + 450; i += 4) {
        const ax = eyeX + Math.cos(baseAngle) * i;
        const ay = eyeY + Math.sin(baseAngle) * i;
        const jitter = (Math.random() - 0.5) * 3 * p;
        if (i === 0) ctx.moveTo(ax + jitter, ay + jitter);
        else ctx.lineTo(ax + jitter, ay + jitter);
      }
      ctx.lineWidth = 2.5 * p;
      ctx.strokeStyle = `rgba(255, 255, 255, ${p})`;
      ctx.stroke();

      for (let b = 0; b < 4; b++) {
        const boltPos = (time * 400 + (b * dist) / 4) % (dist + 150);
        const bx = eyeX + Math.cos(baseAngle) * boltPos;
        const by = eyeY + Math.sin(baseAngle) * boltPos;
        ctx.beginPath();
        ctx.arc(bx, by, 3 + Math.random() * 4 * p, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.6 * p})`;
        ctx.fill();
      }

      const impactSize = 35 + Math.sin(time * 15) * 10;

      ctx.beginPath();
      ctx.arc(tx, ty, impactSize * 1.4 * p, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 255, 200, ${0.15 * p})`;
      ctx.lineWidth = 2 * p;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(tx, ty, impactSize * p, 0, Math.PI * 2);
      const ig = ctx.createRadialGradient(
        tx,
        ty,
        0,
        tx,
        ty,
        impactSize * p
      );
      ig.addColorStop(0, `rgba(255,255,255,${p})`);
      ig.addColorStop(0.1, `rgba(150,255,230,${0.9 * p})`);
      ig.addColorStop(0.3, `rgba(0,220,255,${0.6 * p})`);
      ig.addColorStop(0.6, `rgba(0,120,200,${0.25 * p})`);
      ig.addColorStop(1, "transparent");
      ctx.fillStyle = ig;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(tx, ty, 10 * p, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${0.95 * p})`;
      ctx.fill();

      for (let i = 0; i < 20; i++) {
        const sa = baseAngle + (Math.random() - 0.5) * 2.2;
        const sl = 15 + Math.random() * 40 * p;
        const sparkW = 0.5 + Math.random() * 2.5 * p;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(
          tx + Math.cos(sa) * sl,
          ty + Math.sin(sa) * sl
        );
        ctx.lineWidth = sparkW;
        const hue = 160 + Math.random() * 60;
        ctx.strokeStyle = `hsla(${hue}, 100%, 70%, ${(0.4 + Math.random() * 0.6) * p})`;
        ctx.stroke();
      }

      for (let i = 0; i < 8; i++) {
        const pa = baseAngle + (Math.random() - 0.5) * 1.0;
        const pdist = 20 + Math.random() * 60 * p;
        const ppx = tx + Math.cos(pa) * pdist;
        const ppy = ty + Math.sin(pa) * pdist;
        const psize = 1 + Math.random() * 3 * p;
        ctx.beginPath();
        ctx.arc(ppx, ppy, psize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 255, 240, ${(0.3 + Math.random() * 0.5) * p})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 12 * p, 0, Math.PI * 2);
      const srcGlow = ctx.createRadialGradient(
        eyeX,
        eyeY,
        0,
        eyeX,
        eyeY,
        12 * p
      );
      srcGlow.addColorStop(0, `rgba(255,255,255,${p})`);
      srcGlow.addColorStop(0.5, `rgba(0,255,200,${0.5 * p})`);
      srcGlow.addColorStop(1, "transparent");
      ctx.fillStyle = srcGlow;
      ctx.fill();

      ctx.restore();
    }

    let lastTime = performance.now();
    let raf = 0;

    // Mobile / schwache Geräte: 15fps (reduced motion) / 20fps Standard.
    // Desktop: 20fps statt 30fps — Helm-Physik ist langsam genug.
    const TARGET_FPS = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 15
      : 20;
    const FRAME = 1000 / TARGET_FPS;

    function frame(now) {
      if (now - lastTime < FRAME) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, W, H);
      time += FRAME / 1000;
      updatePhysics();
      updateEyes(dt);

      const s = 115;

      ctx.beginPath();
      ctx.ellipse(helm.x + 8, helm.y + s + 8, s * 0.45, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fill();

      const tilt = helm.tilt;
      const eyeOffset = 0.26 * s;
      const eyeYOff = -0.06 * s;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      const leftEyeX = helm.x + (-eyeOffset * cosT - eyeYOff * sinT);
      const leftEyeY = helm.y + (-eyeOffset * sinT + eyeYOff * cosT);
      const rightEyeX = helm.x + (eyeOffset * cosT - eyeYOff * sinT);
      const rightEyeY = helm.y + (eyeOffset * sinT + eyeYOff * cosT);

      drawHelmet(helm.x, helm.y, s, tilt);

      if (laserPower > 0.02 && mouse.x !== -999) {
        drawCrazyLaser(leftEyeX, leftEyeY, mouse.x, mouse.y, laserPower);
        drawCrazyLaser(rightEyeX, rightEyeY, mouse.x, mouse.y, laserPower);
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    stateRef.current = { canvas, wrap };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="shadow-helmet-wrap">
      <canvas ref={canvasRef} className="shadow-helmet-canvas" />
    </div>
  );
}
