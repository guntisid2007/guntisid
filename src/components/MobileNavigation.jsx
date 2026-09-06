import { useEffect, useRef } from "react";

export default function MobileNavigation({ links }) {
  const disclosure = useRef(null);

  useEffect(() => {
    const menu = disclosure.current;
    const closeOnEscape = (event) => {
      if (event.key !== "Escape" || !menu.open) return;
      menu.open = false;
      menu.querySelector("summary").focus();
    };
    const closeOutside = (event) => {
      if (!menu.contains(event.target)) menu.open = false;
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
    };
  }, []);

  function navigate(event, href) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    disclosure.current.open = false;
    if (href.startsWith("#")) {
      // Keep keyboard focus at the destination after hiding the menu link.
      document.getElementById(href.slice(1))?.focus({ preventScroll: true });
    }
  }

  return (
    <details className="mobile-nav" ref={disclosure}>
      <summary>Menu</summary>
      <nav aria-label="Mobile navigation">
        {links.map(({ href, label }) => (
          <a key={href} href={href} onClick={(event) => navigate(event, href)}>{label}</a>
        ))}
      </nav>
    </details>
  );
}
