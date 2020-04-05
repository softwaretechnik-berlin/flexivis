import {SourceHandler} from "./common.js";

export default class JsonHandler extends SourceHandler {
	constructor(retriever) {
		super(retriever);
	}

	handleWithSource(source, ctx) {
		const div = document.createElement("div");
		div.classList.add("json");
		ctx.element.append(div);
		ctx.riot.mount(div, {obj: JSON.parse(source), showDepth: 4}, "tree-search");
	}
}
