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
