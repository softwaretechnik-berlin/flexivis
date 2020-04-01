import { sourceRetrieverHandler, SourceHandler } from "../common";
import mermaid from "mermaid";

class MermaidHandler extends SourceHandler {
  constructor(retriever) {
    super(retriever);
  }
  handleWithSource(source, ctx) {
    ctx.element.innerHTML = source;
    mermaid.init(undefined, ctx.element);
  }
}

module.exports = retriever => new MermaidHandler(retriever);
