import { SourceHandler } from "./common";
import mermaid from "mermaid";

export default class MermaidHandler extends SourceHandler {
	handleWithSource(source, ctx) {
		ctx.element.innerHTML = source;
		mermaid.init(undefined, ctx.element);
	}
}
