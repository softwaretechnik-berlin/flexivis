import { SourceHandler } from "../common";

import vegaEmbed from "vega-embed";

class VegaHandler extends SourceHandler {
  constructor(retriever) {
    super(retriever);
  }
  handleWithSource(source, ctx) {
    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "100%";
    vegaEmbed(div, JSON.parse(source));
    ctx.element.appendChild(div);
  }
}

module.exports = retriever => new VegaHandler(retriever);
