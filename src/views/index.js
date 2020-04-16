import * as riot from "riot";
import didYouMean from "didyoumean";

const mod = loadHandlerModule => async ctx => {
	const Handler = (await loadHandlerModule()).default;
	return new Handler().handle(ctx);
};

const handlers = {
	http: mod(() => import("./frame")),
	https: mod(() => import("./frame")),
	file: mod(() => import("./frame")),
	md: mod(() => import("./markdown")),
	json: mod(() => import("./json")),
	text: mod(() => import("./text")),
	vega: mod(() => import("./vega")),
	mermaid: mod(() => import("./mermaid")),
	map: mod(() => import("./map")),
	readme: mod(() => import("./readme")),
	select: mod(() => import("./select")),
	edit: mod(() => import("./edit")),
};

export const knownHandlers = Object.keys(handlers);

export function mount(element, view, handleError) {
	const handler = handlers[view.type];
	if (!handler) {
		const suggestedHandler = didYouMean(view.type, knownHandlers);
		const suggestion = suggestedHandler
			? ` Did you mean "${suggestedHandler}"?`
			: "";
		const error = new Error(`Unknown view type "${view.type}".${suggestion}`);
		error.name = "UnknownViewType";
		error.title = "Unknown View Type";
		error.knownHandlers = knownHandlers;
		throw error;
	}

	return handler({
		riot,
		element,
		view,
		handleError,
	});
}
