import { Context, SourceHandler } from "./common";

// @ts-ignore
import vegaEmbed from "vega-embed";

export default class VegaHandler extends SourceHandler {
	async handleWithSource(source: string, ctx: Context): Promise<void> {
		const div = document.createElement("div");
		div.style.width = "100%";
		div.style.height = "100%";
		const base = ctx.view.resources[0].value.url;
		vegaEmbed(div, JSON.parse(source), {
			loader: {
				baseURL: ctx.view.type ? base.replace(/(.*)\/.*/, "$1") : undefined,
			},
		});
		ctx.element.append(div);
	}
}
