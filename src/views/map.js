import {Handler} from "./common.js";

export default class MapHandler extends Handler {
	handle(ctx) {
		ctx.riot.mount(ctx.element, {sources: ctx.description}, "layer-map");
	}
}
