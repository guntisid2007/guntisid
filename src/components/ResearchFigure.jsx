import { ArrowUpRight } from "@phosphor-icons/react";

export default function ResearchFigure() {
  const source = `${import.meta.env.BASE_URL}research-voltage.png`;

  return (
    <figure className="research-figure">
      <a href={source} target="_blank" rel="noreferrer" aria-label="Open the original voltage plot">
        <img
          src={source}
          alt="Voltage versus time plot from the alkaline electrolyzer study, showing voltage increasing from approximately 2.5 to 3.0 volts over 721 seconds"
          width="598"
          height="290"
          loading="lazy"
        />
      </a>
      <figcaption>
        <span>Voltage versus time, page 13</span>
        <a href={source} target="_blank" rel="noreferrer">Original figure <ArrowUpRight size={15} /></a>
      </figcaption>
    </figure>
  );
}
