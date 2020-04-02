import { SourceHandler } from "./common.js";

export default class TextHandler extends SourceHandler {
  handleWithSource(source, ctx) {
    const div = document.createElement("div");
    div.className = "text";
    div.innerText = source;
    ctx.element.appendChild(div);
  }
}
