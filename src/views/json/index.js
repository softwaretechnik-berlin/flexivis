import { sourceRetrieverHandler } from "../common";

module.exports = sourceRetrieverHandler((source, ctx) => {
  const div = document.createElement("div");
  div.classList.add("json");
  ctx.element.appendChild(div);
  ctx.riot.mount(div, { obj: JSON.parse(source), showDepth: 4 }, "tree-search");
});
