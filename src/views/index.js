import * as riot from "riot";
import didYouMean from "didyoumean";

const mod = loadHandlerModule => async ctx => {
	const Handler = (await loadHandlerModule()).default;
	return new Handler().handle(ctx);
};

const handlers = {
	http: mod(() => import("./frame.js")),
	https: mod(() => import("./frame.js")),
	file: mod(() => import("./frame.js")),
	md: mod(() => import("./markdown.js")),
	"md-inline": mod(() => import("./markdown.js")),
	json: mod(() => import("./json.js")),
	"json-inline": mod(() => import("./json.js")),
	text: mod(() => import("./text.js")),
	"text-inline": mod(() => import("./text.js")),
	vega: mod(() => import("./vega.js")),
	"vega-inline": mod(() => import("./vega.js")),
	mermaid: mod(() => import("./mermaid.js")),
	"mermaid-inline": mod(() => import("./mermaid.js")),
	map: mod(() => import("./map.js")),
	readme: mod(() => import("./readme.js")),
	select: mod(() => import("./select.js")),
	"select-inline": mod(() => import("./select.js")),
};

export const knownHandlers = Object.keys(handlers);

export function mount(element, view) {
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
	});
}
