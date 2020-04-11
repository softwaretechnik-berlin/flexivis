import { Handler } from "./common";

export default class MapHandler extends Handler {
	handle(ctx) {
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
