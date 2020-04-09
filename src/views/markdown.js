import { SourceHandler } from "./common";

import mdFactory from "flexivis-md";
import mermaid from "mermaid";

const md = mdFactory();

export default class MarkdownHandler extends SourceHandler {
	handleWithSource(source, ctx) {
		const div = document.createElement("div");
		div.classList.add("markdown");
		div.classList.add("markdown-body");
		div.innerHTML = md(source);
		ctx.element.append(div);

		// Render any mermaid templates that were added by the highlighter
		mermaid.init(undefined, ".mermaid");
	}
}
