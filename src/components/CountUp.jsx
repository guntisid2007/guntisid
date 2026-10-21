import { useCallback } from "react";
import { watchReveal } from "./motion";

const ROLL_MS = 1400;

/**
 * The span always holds the final `value`, so screen readers, print, copy, and
 * unseen stats read it whole. Only a plain integer with an optional prefix or
 * suffix counts up, written to the DOM per frame rather than through state.
 */
export default function CountUp({ value }) {
  const count = useCallback(
    (span) => {
      const parts = value.match(/^(\D*)(\d+)(\D*)$/);
      if (!parts) return;
      const [, prefix, digits, suffix] = parts;
      const show = (progress) => {
        span.textContent = progress < 1 ? `${prefix}${Math.round(Number(digits) * progress)}${suffix}` : value;
      };
      let frame = 0;
      const stop = watchReveal(span, (animate) => {
        if (!animate) return;
        // Zero shows at once, but the clock starts at the first frame's own
        // timestamp: a frame can begin before performance.now() is read, which
        // would start the count below zero.
        show(0);
        let start;
        const step = (time) => {
          start ??= time;
          const t = Math.min(1, (time - start) / ROLL_MS);
          show(1 - (1 - t) ** 4);
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      });
      return () => {
        stop();
        cancelAnimationFrame(frame);
      };
    },
    [value],
  );

  return <span ref={count}>{value}</span>;
}
