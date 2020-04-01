import { sourceRetrieverHandler } from "../common";
import mermaid from "mermaid";

module.exports = sourceRetrieverHandler((source, ctx) => {
  ctx.element.innerHTML = source;
  mermaid.init(undefined, ctx.element);
});
