import * as layoutParser from "./parsers/layout";
import * as viewParser from "./parsers/view";

const handleError = (error, name, title, input) => {
	if (error.name === "SyntaxError") {
		error.name = name;
		error.title = title;
		error.prefixSection = input.slice(
			0,
			Math.max(0, error.location.start.offset)
		);
		error.invalidSection = input.slice(
			error.location.start.offset,
			error.location.end.offset
		);
		error.suffixSection = input.slice(Math.max(0, error.location.end.offset));
	}

	return error;
};

class LayoutParser {
	constructor(parameters) {
		if (!parameters.has("layout")) {
			parameters.set("layout", "url");
			if (!parameters.has("url")) {
				parameters.set("url", "readme");
			}
		}

		this.params = parameters;
	}

	parse() {
		const layout = this.params.get("layout");
		try {
			const layoutSpec = layoutParser.parse(layout);
			return this._parseView(layoutSpec);
		} catch (error) {
			throw handleError(
				error,
				"InvalidLayout",
				"Invalid ’layout’ Parameter",
				layout
			);
		}
	}

	get(name) {
		if (!this.params.has(name)) {
			const error = new Error(`Missing parameter for view ’${name}’.`);
			error.name = "UndefinedView";
			error.availableParams = Array.from(this.params.keys()).filter(
				k => k !== "layout"
			);
			error.title = `Undefined View ’${name}’`;
			return { error };
		}

		const viewParameter = this.params.get(name);
		try {
			return viewParser.parse(viewParameter);
		} catch (error) {
			return {
				error: handleError(
					error,
					"InvalidView",
					`Invalid View Parameter ’${name}’`,
					viewParameter
				),
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

export default function parse(parameters) {
	return new LayoutParser(parameters).parse();
}
