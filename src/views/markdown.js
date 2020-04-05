import { SourceHandler } from "./common";

import hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import mermaid from "mermaid";

const md = new MarkdownIt({
	typographer: true,
	linkify: true,
	highlight: (string, lang) => {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(lang, string).value;
			} catch (_) {}
		} else if (lang === "mermaid") {
			return `<div class="mermaid">${string}</div>`;
		}

		// Use external default escaping
		return "";
	},
});

export default class MarkdownHandler extends SourceHandler {
	handleWithSource(source, ctx) {
		const div = document.createElement("div");
		div.classList.add("markdown");
		div.classList.add("markdown-body");
		div.innerHTML = md.render(source);
		ctx.element.append(div);

		// Render any mermaid templates that were added by the highlighter
		mermaid.init(undefined, ".mermaid");
	}
}
