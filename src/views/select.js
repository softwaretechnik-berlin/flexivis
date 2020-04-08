import { SourceHandler } from "./common";

export default class TextHandler extends SourceHandler {
	handleWithSource(source, ctx) {
		const config = JSON.parse(source);
		ctx.riot.mount(ctx.element, config, "item-select");
	}
}
