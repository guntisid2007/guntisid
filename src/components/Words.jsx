import { Fragment } from "react";

/** The words animate only inside a heading marked `data-reveal="words"`. */
export default function Words({ children }) {
  return children.split(" ").map((word, index) => (
    <Fragment key={index}>
      {index > 0 ? " " : null}
      <span className="word" style={{ "--i": index }}>{word}</span>
    </Fragment>
  ));
}
