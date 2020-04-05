import {Handler} from "./common.js";

export default class FrameHandler extends Handler {
	handle(ctx) {
		const iframe = document.createElement("iframe");
		iframe.src = ctx.definition;
		ctx.element.append(iframe);
	}
}
