import {Handler} from "./common";

export default class MapHandler extends Handler {
	handle(ctx) {
		ctx.riot.mount(ctx.element, {sources: ctx.description}, "layer-map");
	}
}
