import { type Context, SourceHandler } from "./common";

export default class TextHandler extends SourceHandler {
	async handleWithSource(source: string, ctx: Context): Promise<void> {
		const div = document.createElement("div");
		div.className = "text";
		div.textContent = source;
		ctx.element.append(div);
	}
}
