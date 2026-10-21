import { useEffect } from "react";

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Calls `onShow(animate)` once, the first time `element` is seen. `animate` is
 * false when reduced motion is set or IntersectionObserver is missing, so the
 * caller shows its end state.
 */
export function watchReveal(element, onShow) {
  if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
    onShow(false);
    return () => {};
  }

  // Content already on screen at load plays its entrance right away instead of
  // waiting on a threshold a thin sliver may never cross, so it never sits invisible.
  const rect = element.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    const timer = window.setTimeout(() => onShow(true), 20);
    return () => window.clearTimeout(timer);
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      onShow(true);
    },
    { threshold: 0.12 },
  );
  observer.observe(element);
  return () => observer.disconnect();
}

/**
 * Feeds the card glow in styles.css: one delegated pointer listener sets
 * --gx and --gy on the `data-glow` card under a fine, hovering pointer.
 */
export function usePointerGlow() {
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let last = null;
    const paint = () => {
      frame = 0;
      const card = last.target instanceof Element ? last.target.closest("[data-glow]") : null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--gx", `${last.clientX - rect.left}px`);
      card.style.setProperty("--gy", `${last.clientY - rect.top}px`);
    };
    const onMove = (event) => {
      last = event;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const sync = () => {
      document.removeEventListener("pointermove", onMove);
      if (query.matches) document.addEventListener("pointermove", onMove, { passive: true });
    };
    sync();
    query.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(frame);
      query.removeEventListener("change", sync);
      document.removeEventListener("pointermove", onMove);
    };
  }, []);
}

/**
 * Sets --p (0 to 1 over the document's scroll) and `data-scrolled` (past
 * 24px) on the header, at most once a frame.
 */
export function useHeaderScroll(header) {
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      header.current.style.setProperty("--p", String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
      header.current.toggleAttribute("data-scrolled", window.scrollY > 24);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [header]);
}
