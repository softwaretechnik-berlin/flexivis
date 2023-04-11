import { type Handler, type Context } from "./common";

export default class FrameHandler implements Handler {
	async handle(ctx: Context): Promise<void> {
		const iframe = document.createElement("iframe");
		iframe.src = `${ctx.view.type}:${ctx.view.resources[0].value.name}`;
		ctx.element.append(iframe);
	}
}
