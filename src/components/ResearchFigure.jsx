import { useId } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

export default function ResearchFigure() {
  const id = useId().replace(/:/g, "");
  const source = `${import.meta.env.BASE_URL}research-voltage.png`;

  return (
    <figure className="research-figure">
      <p className="research-takeaway"><strong>Key result:</strong> Voltage increased from roughly 2.5 V to 3.0 V during the 721-second run.</p>
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
        </defs>
        <image href={source} width="598" height="290" filter={`url(#${id}-palette)`} />
      </svg>
      <figcaption>
        Voltage plot from page 13 of my paper, adapted to the site’s colors. Gold shows the recorded values; ivory shows the fitted trend.
        <a href={source} target="_blank" rel="noreferrer">View original figure <ArrowUpRight size={15} aria-hidden="true" /></a>
      </figcaption>
    </figure>
  );
}
