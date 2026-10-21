import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, watchReveal } from "./motion";

const ROLL_MS = 1400;

/**
 * A stat such as "29K" that counts up from 0 to its number the first time it
 * is seen, keeping the suffix. Screen readers get only the final value.
 */
export default function CountUp({ value }) {
  const [, digits, suffix] = value.match(/^(\d+)(.*)$/);
  const counter = useRef(null);
  const [progress, setProgress] = useState(() => (prefersReducedMotion() ? 1 : 0));

  useEffect(() => {
    let frame = 0;
    const stop = watchReveal(counter.current, (animate) => {
      if (!animate) {
        setProgress(1);
        return;
      }
      // Timed from the first frame's own timestamp: a frame can begin before
      // performance.now() is read, which would start the count below zero.
      let start;
      const step = (time) => {
        start ??= time;
        const t = Math.min(1, (time - start) / ROLL_MS);
        setProgress(1 - (1 - t) ** 4);
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
    return () => {
      stop();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <span ref={counter} aria-hidden="true">{Math.round(Number(digits) * progress)}{suffix}</span>
      <span className="sr-only">{value}</span>
    </>
  );
}
