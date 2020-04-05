import { SourceHandler } from "./common";

export default class JsonHandler extends SourceHandler {
	handleWithSource(source, ctx) {
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
