import mermaid from "mermaid";
import { type Context, SourceHandler } from "./common";

export default class MermaidHandler extends SourceHandler {
	async handleWithSource(source: string, ctx: Context): Promise<void> {
		ctx.element.innerHTML = source;
		mermaid.init(undefined, ctx.element);
	}
}
