import * as riot from "riot";
import { Context, SourceHandler } from "./common";

export default class SelectHandler extends SourceHandler {
	async handleWithSource(source: string, ctx: Context): Promise<void> {
		riot.mount(
			ctx.element,
			{ tabs: JSON.parse(source).tabs, config: ctx.view.config },
			"multi-tab"
		);
	}
}
