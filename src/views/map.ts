import { Handler, Context } from "./common";

export default class MapHandler implements Handler {
	async handle(ctx: Context): Promise<void> {
		ctx.riot.mount(
			ctx.element,
			{
				config: ctx.view.config,
				resources: ctx.view.resources,
				handleError: ctx.handleError,
			},
			"layer-map"
		);
	}
}
