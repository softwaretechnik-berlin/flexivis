import { Handler, Context } from "./common";
import { render } from "solid-js/dom";
import App from "./ttt-component";

export default class FrameHandler implements Handler {
	async handle(ctx: Context): Promise<void> {
		render(() => App({ answer: 11 }), ctx.element);
	}
}
