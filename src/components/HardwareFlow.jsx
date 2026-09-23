import { useEffect, useRef } from "react";

// One continuous graph: its lanes resolve into chip contacts at the center.
export default function HardwareFlow() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1200px)");
    const flow = "#fff";
    const chipGold = "#fff";
    const gray = "#fff";
    let frame = 0;
    let visible = true;
    let elapsed = 0;
    let previous = 0;
    let width = 0;
    let height = 0;
    let worldWidth = 600;
    let focalX = 300;

    const smooth = (v) => { const t = Math.max(0, Math.min(1, v)); return t * t * (3 - 2 * t); };
    const edge = (x) => smooth(x / 85) * smooth((worldWidth - x) / 85);
    const headlineFade = (x, y) => {
      const across = smooth((x - focalX + 390) / 80) * (1 - smooth((x - focalX + 145) / 100));
      const through = smooth((y - 100) / 45) * (1 - smooth((y - 235) / 45));
      return 1 - 0.35 * across * through;
    };
    const point = (x, lane) => {
      const centered = x - focalX;
      const organized = smooth((centered + 175) / 110) * (1 - smooth((centered - 65) / 110));
      const drift = Math.sin(x * 0.029 + lane * 1.9) * 20 + Math.cos(x * 0.014 + lane) * 12;
      return [x, 190 + (lane - 3) * (22 + 12 * (1 - organized)) + drift * (1 - organized)];
    };
    const line = (a, b, alpha, color = flow) => {
      context.globalAlpha = alpha;
      context.strokeStyle = color;
      context.beginPath(); context.moveTo(...a); context.lineTo(...b); context.stroke();
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.save();
      const scale = height / 380;
      worldWidth = width / scale;
      focalX = worldWidth * 0.54;
      const center = focalX;
      context.scale(scale, scale);
      context.lineWidth = 0.8;
      // Orthogonal contacts share the same seven lanes as the flowing graph.
      context.strokeStyle = chipGold;
      context.globalAlpha = 0.25;
      context.strokeRect(center - 64, 105, 128, 170);
      context.globalAlpha = 0.17;
      context.strokeRect(center - 48, 121, 96, 138);
      context.globalAlpha = 0.12;
      context.strokeRect(center - 32, 139, 64, 102);
      for (let lane = 0; lane < 7; lane += 1) {
        const y = 124 + lane * 22;
        line([center - 86, y], [center - 48, y], 0.2, chipGold);
        line([center + 48, y], [center + 86, y], 0.2, chipGold);
        const bend = center - 32 + (lane % 3) * 12;
        line([center - 48, y], [bend, y], 0.13, gray);
        line([bend, y], [bend, 145 + lane * 15], 0.13, gray);
        line([bend, 145 + lane * 15], [center + 48, 145 + lane * 15], 0.13, gray);
        line([center - 64, y], [center - 48, y], 0.18, chipGold);
        line([center + 48, y], [center + 64, y], 0.18, chipGold);
      }
      for (let pin = 0; pin < 5; pin += 1) {
        const x = center - 44 + pin * 22;
        line([x, 87], [x, 105], 0.19, chipGold);
        line([x, 275], [x, 293], 0.19, chipGold);
        line([x, 121], [x, 139], 0.11, gray);
        line([x, 241], [x, 259], 0.11, gray);
      }
      for (let pad = 0; pad < 4; pad += 1) {
        const x = center - 27 + pad * 18;
        context.strokeStyle = chipGold;
        context.globalAlpha = 0.18;
        context.strokeRect(x - 2, 153, 4, 4);
        context.strokeRect(x - 2, 223, 4, 4);
        line([x, 157], [x, 174 + (pad % 2) * 8], 0.12, gray);
        line([x, 206 - (pad % 2) * 8], [x, 223], 0.12, gray);
      }
      line([center - 27, 174], [center + 27, 174], 0.12, gray);
      line([center - 27, 206], [center + 27, 206], 0.12, gray);
      // Wrapping happens beyond the faded edges; no visible reset or scene cut.
      const offset = (elapsed * 13) % 192;
      for (let column = -4; column < Math.ceil(worldWidth / 48) + 4; column += 1) {
        const x = column * 48 + offset;
        for (let lane = 0; lane < 7; lane += 1) {
          const p = point(x, lane);
          const next = point(x + 48, lane);
          const fade = edge(x);
          const quiet = headlineFade(x + 24, (p[1] + next[1]) / 2);
          line(p, next, 0.15 * Math.min(fade, edge(x + 48)) * quiet);
          const spread = 1 - smooth((x - center + 145) / 75) * (1 - smooth((x - center - 70) / 75));
          if (lane < 6 && (column + lane) % 2 === 0) {
            line(p, point(x + 48, lane + 1), 0.085 * fade * spread * quiet, gray);
          }
          context.fillStyle = (lane + column) % 4 === 0 ? gray : flow;
          context.globalAlpha = fade * headlineFade(...p) * ((lane + column) % 4 === 0 ? 0.29 : 0.21);
          context.beginPath(); context.arc(...p, 1.5, 0, Math.PI * 2); context.fill();
        }
      }
      context.restore();
      context.globalAlpha = 1;
    };
    const tick = (now) => {
      if (previous && now - previous < 32) { frame = requestAnimationFrame(tick); return; }
      if (previous) elapsed += Math.min((now - previous) / 1000, 0.1);
      previous = now;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (!visible || document.hidden) return;
      draw();
      if (!motion.matches && desktop.matches) frame = requestAnimationFrame(tick);
    };
    const resize = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      sync();
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    resize.observe(canvas); observer.observe(canvas);
    motion.addEventListener("change", sync);
    desktop.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect();
      motion.removeEventListener("change", sync); desktop.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <canvas ref={ref} className="hardware-flow" aria-hidden="true" />;
}
