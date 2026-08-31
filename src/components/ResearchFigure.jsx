import { useId, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowCounterClockwise, ArrowUpRight } from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ResearchFigure() {
  const figureRef = useRef(null);
  const revealRef = useRef(null);
  const animationRef = useRef(null);
  const id = useId().replace(/:/g, "");
  const source = `${import.meta.env.BASE_URL}research-voltage.png`;

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const animation = gsap.fromTo(revealRef.current,
        { attr: { width: 0 } },
        {
          attr: { width: 516 },
          duration: 2.4,
          ease: "none",
          scrollTrigger: { trigger: figureRef.current, start: "top 80%", once: true },
        },
      );
      animationRef.current = animation;
      return () => { animationRef.current = null; };
    });
    return () => media.revert();
  }, { scope: figureRef });

  return (
    <figure className="research-figure" ref={figureRef}>
      <svg className="research-plot" viewBox="0 0 598 290" role="img" aria-labelledby={`${id}-title ${id}-description`}>
        <title id={`${id}-title`}>Voltage versus time</title>
        <desc id={`${id}-description`}>The original plot from page 13 of the research paper. Recorded voltage steps from about 2.5 to 3.0 volts over 721 seconds. A straight fitted trend rises alongside it. Gold represents recorded values; ivory represents the fit.</desc>
        <defs>
          <filter id={`${id}-palette`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="
              -1.02 0 0.177 0 0.953
              -0.86 0 0.036 0 0.941
              -0.45 0 -0.353 0 0.910
              0 0 0 1 0
            " />
          </filter>
          <clipPath id={`${id}-axes`}>
            <path clipRule="evenodd" d="M0 0H598V290H0Z M60 29V239H575V29Z" />
            <rect x="80" y="33" width="134" height="26" />
          </clipPath>
          <clipPath id={`${id}-build`}>
            <rect ref={revealRef} x="59" y="28" width="516" height="212" />
          </clipPath>
        </defs>
        {/* The unchanged source image is revealed in place, never resampled into invented data. */}
        <g className="research-plot-grid" aria-hidden="true">
          {[83, 148, 213, 279, 344, 409, 474, 539].map((x) => <line key={`x-${x}`} x1={x} x2={x} y1="29" y2="239" />)}
          {[52, 85, 118, 151, 184, 217].map((y) => <line key={`y-${y}`} x1="60" x2="575" y1={y} y2={y} />)}
        </g>
        <image href={source} width="598" height="290" filter={`url(#${id}-palette)`} clipPath={`url(#${id}-axes)`} />
        <image href={source} width="598" height="290" filter={`url(#${id}-palette)`} clipPath={`url(#${id}-build)`} />
      </svg>
      <div className="research-figure-controls">
        <a href={source} target="_blank" rel="noreferrer">View original figure <ArrowUpRight size={16} aria-hidden="true" /></a>
        <button className="research-replay" type="button" onClick={() => animationRef.current?.restart()} aria-label="Replay graph animation">
          <ArrowCounterClockwise size={16} aria-hidden="true" /> Replay
        </button>
      </div>
      <figcaption>
        Voltage plot from page 13 of my paper, adapted to the site’s colors. Gold shows the recorded values; ivory shows the fitted trend.
      </figcaption>
    </figure>
  );
}
