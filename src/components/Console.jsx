import { reveal } from "./motion";

const kinds = {
  cmd: (text) => <span className="console-command">{`$ ${text}`}</span>,
  note: (text) => <span className="console-comment">{`# ${text}`}</span>,
  quote: (text) => `> ${text}`,
  stage: (stage, text) => <><span className="console-stage">{stage}</span>{`  ${text}`}</>,
  out: (text) => text,
};

export default function Console({ title, lines }) {
  return (
    <figure className="console" data-reveal ref={reveal}>
      <figcaption className="console-bar">
        <span className="console-dots" aria-hidden="true" />
        <span>{title}</span>
        <span className="console-note">Illustrative</span>
      </figcaption>
      <pre>
        {lines.map(([kind, ...text], index) => (
          <span key={index} className="console-line" style={{ "--i": index }}>
            {kinds[kind](...text)}
            {index === lines.length - 1 ? <span className="console-caret" aria-hidden="true" /> : null}
            {"\n"}
          </span>
        ))}
      </pre>
    </figure>
  );
}
