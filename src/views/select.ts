import { Context, SourceHandler } from "./common";

export default class SelectHandler extends SourceHandler {
	async handleWithSource(source: string, ctx: Context): Promise<void> {
		const definition = JSON.parse(source);
		ctx.riot.mount(
			ctx.element,
			{ definition, config: ctx.view.config },
			"item-select"
		);
	}
}
