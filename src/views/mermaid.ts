import { Context, SourceHandler } from "./common";
import mermaid from "mermaid";

export default class MermaidHandler extends SourceHandler {
	async handleWithSource(source: string, ctx: Context): Promise<void> {
		ctx.element.innerHTML = source;
		// @ts-ignore
		mermaid.init(undefined, ctx.element);
	}
}
