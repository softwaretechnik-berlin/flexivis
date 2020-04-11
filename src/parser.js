import * as layoutParser from "./parsers/layout";
import * as viewParser from "./parsers/view";
import DataSource from "./data-source";

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

const retrieveText = url =>
	fetch(url)
		.catch(error => {
			throw new Error(`Failed to fetch "${url}": ${error}`);
		})
		.then(r => r.text());

class LayoutParser {
	constructor(parameters, retrieve) {
		if (!parameters.has("layout")) {
			parameters.set("layout", "url");
			if (!parameters.has("url")) {
				parameters.set("url", "readme");
			}
		}

		this.params = parameters;
		this.retrieve = retrieve;
		this.dataSourceCache = new Map();
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
			const parsed = viewParser.parse(viewParameter);

			parsed.resources.forEach(resource => {
				const name = resource.value;
				let url;

				if (resource.value.startsWith("$")) {
					if (!this.params.has(name)) {
						throw new Error(`Shared source ’${name}’ is not available.`);
					}

					url = this.params.get(resource.value);
				} else {
					url = resource.value;
				}

				resource.value = this.dataSourceCache.has(name)
					? this.dataSourceCache.get(name)
					: this.dataSourceCache
							.set(name, new DataSource(name, url, this.retrieve(url)))
							.get(name);
			});

			return parsed;
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

export default function parse(parameters, retrieve = retrieveText) {
	return new LayoutParser(parameters, retrieve).parse();
}
