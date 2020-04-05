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
};

export function mount(riot, element, definition) {
	const index = definition.indexOf(":");
	const name = definition.slice(0, index);
	const description = definition.slice(index + 1);

	const handler = handlers[name];
	if (!handler) {
		const error = new Error(`Unknown handler "${name}".`);
		error.title = "Unknown Handler";
		error.knownHandlers = Object.keys(handlers);
		throw error;
	}

	return handler({
		riot,
		element,
		definition,
		name,
		description,
	});
}
