import { useEffect } from "react";

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const waiting = new Map();
let observer;

function showSeen(entries) {
  for (const { target, isIntersecting } of entries) {
    const onShow = waiting.get(target);
    if (!isIntersecting || !onShow) continue;
    waiting.delete(target);
    observer.unobserve(target);
    onShow(!prefersReducedMotion());
  }
}

/**
 * Calls `onShow(animate)` once, the first time `element` is seen, and returns a
 * cleanup. `animate` is false when reduced motion is set at that moment or
 * IntersectionObserver is missing, so the caller shows its end state.
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
    onShow(true);
    return () => {};
  }

  observer ??= new IntersectionObserver(showSeen, { threshold: 0.12 });
  waiting.set(element, onShow);
  observer.observe(element);
  return () => {
    waiting.delete(element);
    observer.unobserve(element);
  };
}

/** Ref callback for every `data-reveal` element. */
export function reveal(element) {
  return watchReveal(element, () => element.setAttribute("data-visible", "true"));
}

/** Feeds the `data-glow` card glow in styles.css. */
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
