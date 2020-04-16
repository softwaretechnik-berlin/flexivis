import { SourceHandler, Context } from "./common";

export default class JsonHandler extends SourceHandler {
	async handleWithSource(source: string, ctx: Context): Promise<void> {
		const div = document.createElement("div");
		div.classList.add("json");
		ctx.element.append(div);
		ctx.riot.mount(
			div,
			{ obj: JSON.parse(source), showDepth: 4 },
			"tree-search"
		);
	}
}
