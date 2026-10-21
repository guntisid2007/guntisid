import { Fragment } from "react";

/** Splits a heading into word spans for a `data-reveal="words"` entrance. */
export default function Words({ children }) {
  return children.split(" ").map((word, index) => (
    <Fragment key={index}>
      {index > 0 ? " " : null}
      <span className="word" style={{ "--i": index }}>{word}</span>
    </Fragment>
  ));
}
