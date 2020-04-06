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
				config: {
					title: `Missing parameter for view ’${name}’.`,
					message: `The parameter ’${name}’ is not defined.`,
				},
			};
		}

		try {
			return viewParser.parse(this.params.get(name));
		} catch (error) {
			return {
				type: "error",
				config: {
					title: `Failed to parse view ${name}`,
					message: error.message,
				}
			};
		}
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
