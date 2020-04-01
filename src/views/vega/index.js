import { sourceRetrieverHandler } from "../common";

import vegaEmbed from "vega-embed";

module.exports = sourceRetrieverHandler(async (source, ctx) => {
  const div = document.createElement("div");
  div.style.width = "100%";
  div.style.height = "100%";
  vegaEmbed(div, JSON.parse(source));
  ctx.element.appendChild(div);
});
