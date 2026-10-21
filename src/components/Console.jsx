import { reveal } from "./motion";

function Line({ text }) {
  if (text.startsWith("$")) return <span className="console-command">{text}</span>;
  if (text.startsWith("#")) return <span className="console-comment">{text}</span>;
  const stage = text.match(/^(\S+)( {2,}.*)$/);
  if (stage) return <><span className="console-stage">{stage[1]}</span>{stage[2]}</>;
  return text;
}

/** In `lines`, "$" starts a command, "#" a comment, and a first word followed by two spaces names the stage that wrote the line. */
export default function Console({ title, note = "Illustrative", lines }) {
  return (
    <figure className="console" data-reveal ref={reveal}>
      <figcaption className="console-bar">
        <span className="console-dots" aria-hidden="true" />
        <span>{title}</span>
        <span className="console-note">{note}</span>
      </figcaption>
      <pre>
        {lines.map((line, index) => (
          <span key={line} className="console-line" style={{ "--i": index }}>
            <Line text={line} />
            {index === lines.length - 1 ? <span className="console-caret" aria-hidden="true" /> : null}
            {"\n"}
          </span>
        ))}
      </pre>
    </figure>
  );
}
