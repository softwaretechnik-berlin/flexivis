import vegaEmbed from "vega-embed";
import { type Context, SourceHandler } from "./common";

export default class VegaHandler extends SourceHandler {
	async handleWithSource(source: string, ctx: Context): Promise<void> {
		const div = document.createElement("div");
		div.style.width = "100%";
		div.style.height = "100%";
		const base = ctx.view.resources[0].value.url;
		const embedding = vegaEmbed(div, JSON.parse(source), {
			loader: {
				baseURL: ctx.view.type ? base.replace(/(.*)\/.*/, "$1") : undefined,
			},
		});
		ctx.element.append(div);
		await embedding;
	}
}
