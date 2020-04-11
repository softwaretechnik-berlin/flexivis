import { Handler } from "./common";

export default class FrameHandler extends Handler {
	handle(ctx) {
		const iframe = document.createElement("iframe");
		iframe.src = `${ctx.view.type}:${ctx.view.resources[0].value.name}`;
		ctx.element.append(iframe);
	}
}
