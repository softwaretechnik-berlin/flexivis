import { Handler } from "./common.js";

class MapHandler extends Handler {
  handle(ctx) {
    ctx.riot.mount(ctx.element, { sources: ctx.description }, "layer-map");
  }
}

module.exports = () => new MapHandler();
