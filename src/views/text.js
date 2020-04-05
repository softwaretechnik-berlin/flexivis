import {SourceHandler} from "./common";

export default class TextHandler extends SourceHandler {
	handleWithSource(source, ctx) {
		const div = document.createElement("div");
		div.className = "text";
		div.textContent = source;
		ctx.element.append(div);
	}
}
