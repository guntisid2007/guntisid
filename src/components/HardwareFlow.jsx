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
    const palette = getComputedStyle(canvas);
    const gold = palette.getPropertyValue("--accent").trim();
    const gray = palette.getPropertyValue("--muted-strong").trim();
    let frame = 0;
    let visible = true;
    let elapsed = 0;
    let previous = 0;
    let width = 0;
    let height = 0;

    const smooth = (v) => { const t = Math.max(0, Math.min(1, v)); return t * t * (3 - 2 * t); };
    const edge = (x) => smooth(x / 85) * smooth((600 - x) / 85);
    const point = (x, lane) => {
      const organized = smooth((x - 125) / 110) * (1 - smooth((x - 365) / 110));
      const drift = Math.sin(x * 0.029 + lane * 1.9) * 20 + Math.cos(x * 0.014 + lane) * 12;
      return [x, 190 + (lane - 3) * (22 + 12 * (1 - organized)) + drift * (1 - organized)];
    };
    const line = (a, b, alpha, color = gold) => {
      context.globalAlpha = alpha;
      context.strokeStyle = color;
      context.beginPath(); context.moveTo(...a); context.lineTo(...b); context.stroke();
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.save();
      context.scale(width / 600, height / 380);
      context.lineWidth = 0.8;
      // Orthogonal contacts share the same seven lanes as the flowing graph.
      context.strokeStyle = gold;
      context.globalAlpha = 0.13;
      context.strokeRect(236, 105, 128, 170);
      context.globalAlpha = 0.085;
      context.strokeRect(252, 121, 96, 138);
      for (let lane = 0; lane < 7; lane += 1) {
        const y = 124 + lane * 22;
        line([214, y], [252, y], 0.12);
        line([348, y], [386, y], 0.12);
        const bend = 268 + (lane % 3) * 12;
        line([252, y], [bend, y], 0.07, gray);
        line([bend, y], [bend, 145 + lane * 15], 0.07, gray);
        line([bend, 145 + lane * 15], [348, 145 + lane * 15], 0.07, gray);
      }
      for (let pin = 0; pin < 5; pin += 1) {
        const x = 256 + pin * 22;
        line([x, 87], [x, 105], 0.11);
        line([x, 275], [x, 293], 0.11);
      }
      // Wrapping happens beyond the faded edges; no visible reset or scene cut.
      const offset = (elapsed * 13) % 192;
      for (let column = -4; column < 14; column += 1) {
        const x = column * 48 + offset;
        for (let lane = 0; lane < 7; lane += 1) {
          const p = point(x, lane);
          const next = point(x + 48, lane);
          const fade = edge(x);
          line(p, next, 0.095 * Math.min(fade, edge(x + 48)));
          const spread = 1 - smooth((x - 155) / 75) * (1 - smooth((x - 370) / 75));
          if (lane < 6 && (column + lane) % 2 === 0) {
            line(p, point(x + 48, lane + 1), 0.06 * fade * spread, gray);
          }
          context.fillStyle = (lane + column) % 4 === 0 ? gray : gold;
          context.globalAlpha = fade * ((lane + column) % 4 === 0 ? 0.22 : 0.12);
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
      if (!desktop.matches || !visible || document.hidden) return;
      draw();
      if (!motion.matches) frame = requestAnimationFrame(tick);
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
