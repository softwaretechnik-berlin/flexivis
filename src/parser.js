import * as layoutParser from "./parsers/layout";
import * as viewParser from "./parsers/view";

export default class LayoutParser {
	constructor(parameters) {
		if (!parameters.has("layout")) {
			parameters.set("layout", "url");
			if (!parameters.has("url")) {
				parameters.set("url", "readme");
			}
		}

		this.layout = parameters.get("layout");
		this.params = parameters;
	}

	parse() {
		const layoutSpec = layoutParser.parse(this.layout);
		return this._parseView(layoutSpec);
	}

	get(name) {
		if (!this.params.has(name)) {
			return {
				type: "error",
				config: [
					{ key: "title", value: `Missing parameter for view ’${name}’.` },
					{ key: "message", value: `The parameter ’${name}’ is not defined.` },
				],
			};
		}

		return viewParser.parse(this.params.get(name));
	}

	_parseView(view) {
		if (typeof view === "string") {
			return this.get(view);
		}

		view.views.forEach(v => {
			v.view = this._parseView(v.view);
		});
		return view;
	}
}
