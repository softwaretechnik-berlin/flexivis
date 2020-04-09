import { SourceHandler } from "./common";

export default class SelectHandler extends SourceHandler {
	handleWithSource(source, ctx) {
		const definition = JSON.parse(source);
		ctx.riot.mount(
			ctx.element,
			{ definition, config: ctx.view.config },
			"item-select"
		);
	}
}
