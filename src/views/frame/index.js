import { Handler } from "../common";

class FrameHandler extends Handler {
  handle(ctx) {
    const iframe = document.createElement("iframe");
    iframe.src = ctx.definition;
    ctx.element.appendChild(iframe);
  }
}

module.exports = () => new FrameHandler();
