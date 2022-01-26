import mdFactory from "flexivis-md";
import mermaid from "mermaid";
import { SourceHandler, Context } from "./common";

const md = mdFactory();

export default class MarkdownHandler extends SourceHandler {
	async handleWithSource(source: string, ctx: Context): Promise<void> {
		const div = document.createElement("div");
		div.classList.add("markdown");
		div.classList.add("markdown-body");
		div.innerHTML = md(source);
		ctx.element.append(div);

		// Render any mermaid templates that were added by the highlighter
		mermaid.init(undefined, ".mermaid");
	}
}
