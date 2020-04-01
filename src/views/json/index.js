import { SourceHandler } from "../common";

class JsonHandler extends SourceHandler {
  constructor(retriever) {
    super(retriever);
  }
  handleWithSource(source, ctx) {
    const div = document.createElement("div");
    div.classList.add("json");
    ctx.element.appendChild(div);
    ctx.riot.mount(div, { obj: JSON.parse(source), showDepth: 4 }, "tree-search");
  }
}

module.exports = retriever => new JsonHandler(retriever);
