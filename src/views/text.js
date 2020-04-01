import { SourceHandler } from "./common.js";

class TextHandler extends SourceHandler {
  constructor(retriever) {
    super(retriever);
  }
  handleWithSource(source, ctx) {
    const div = document.createElement("div");
    div.className = "text";
    div.innerText = source;
    ctx.element.appendChild(div);
  }
}

module.exports = retriever => new TextHandler(retriever);
