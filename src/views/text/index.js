import { sourceRetrieverHandler } from "../common";

module.exports = sourceRetrieverHandler((source, ctx) => {
  const div = document.createElement("div");
  div.className = "text";
  div.innerText = source;
  ctx.element.appendChild(div);
});
