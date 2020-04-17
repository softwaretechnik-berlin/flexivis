import * as riot from "riot";
import didYouMean from "didyoumean";

import { Context, Handler } from "./common";
import { XViewFrame } from "../parser";

type HandlerModule = { default: new () => Handler };
const mod = (loadHandlerModule: () => Promise<HandlerModule>) => async (
	ctx: Context
): Promise<void> => {
	const Handler = (await loadHandlerModule()).default;
	return new Handler().handle(ctx);
};

const handlers: { [key: string]: (ctx: Context) => Promise<void> } = {
	http: mod(async () => import("./frame")),
	https: mod(async () => import("./frame")),
	file: mod(async () => import("./frame")),
	md: mod(async () => import("./markdown")),
	json: mod(async () => import("./json")),
	text: mod(async () => import("./text")),
	vega: mod(async () => import("./vega")),
	mermaid: mod(async () => import("./mermaid")),
	map: mod(async () => import("./map")),
	readme: mod(async () => import("./readme")),
	select: mod(async () => import("./select")),
	edit: mod(async () => import("./edit")),
};

export const knownHandlers = Object.keys(handlers);

class UnknownViewTypeError extends Error {
	constructor(public title: string, public knownHandlers: string[]) {
		super();
	}
}

export async function mount(
	element: HTMLElement,
	view: XViewFrame,
	handleError: (error: Error) => void
): Promise<void> {
	const handler = handlers[view.type];
	if (!handler) {
		const suggestedHandler = didYouMean(view.type, knownHandlers);
		const suggestion = suggestedHandler
			? ` Did you mean "${
					typeof suggestedHandler === "string"
						? suggestedHandler
						: suggestedHandler.join(", ")
			  }"?`
			: "";
		const error = new UnknownViewTypeError("Unknown View Type", knownHandlers);
		error.name = "UnknownViewType";
		error.message = `Unknown view type "${view.type}".${suggestion}`;
		throw error;
	}

	return handler({
		riot,
		element,
		view,
		handleError,
	});
}
