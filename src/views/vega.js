import { SourceHandler } from "./common.js";

import vegaEmbed from "vega-embed";

export default class VegaHandler extends SourceHandler {
  handleWithSource(source, ctx) {
    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "100%";
    vegaEmbed(div, JSON.parse(source));
    ctx.element.appendChild(div);
  }
}
