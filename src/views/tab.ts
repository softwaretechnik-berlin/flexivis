import * as riot from "riot";
import { Context, SourceHandler, inlineExpandedViews } from "./common";

export default class SelectHandler extends SourceHandler {
	async handleWithSource(source: string, ctx: Context): Promise<void> {
		riot.mount(
			ctx.element,
			{
				tabs: inlineExpandedViews(JSON.parse(source).tabs),
				config: ctx.view.config,
			},
			"multi-tab"
		);
	}
}
