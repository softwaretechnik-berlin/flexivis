import * as riot from "riot";
import { Context, SourceHandler, inlineExpandedViews } from "./common";

export default class SelectHandler extends SourceHandler {
	async handleWithSource(source: string, ctx: Context): Promise<void> {
		const definition = JSON.parse(source);
		inlineExpandedViews(definition.parameters);
		riot.mount(
			ctx.element,
			{ definition, config: ctx.view.config },
			"item-select"
		);
	}
}
