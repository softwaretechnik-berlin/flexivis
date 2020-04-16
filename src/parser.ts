import {
	parse as parseLayout,
	ViewFrameCollection,
	ViewDef,
} from "./parsers/layout";
import { parse as parseView, Resource } from "./parsers/view";
import DataSource from "./data-source";

const handleError = (
	error: Error,
	name: string,
	title: string,
	input: string
): Error => {
	if (error.name === "SyntaxError") {
		error.name = name;
		// @ts-ignore comment
		error.title = title;
		// @ts-ignore comment
		error.prefixSection = input.slice(
			0,
			// @ts-ignore comment
			Math.max(0, error.location.start.offset)
		);
		// @ts-ignore comment
		error.invalidSection = input.slice(
			// @ts-ignore comment
			error.location.start.offset,
			// @ts-ignore comment
			error.location.end.offset
		);
		// @ts-ignore comment
		error.suffixSection = input.slice(Math.max(0, error.location.end.offset));
	}

	return error;
};

const retrieveText = async (url: string): Promise<string> => {
	try {
		return await (await fetch(url)).text();
	} catch (error) {
		throw new Error(`Failed to fetch "${url}": ${error}`);
	}
};

class LayoutParser {
	private readonly params: URLSearchParams;
	private readonly retrieve: (url: string) => Promise<string>;
	private readonly dataSourceCache: Map<string, DataSource<string>>;
	constructor(
		parameters: URLSearchParams,
		retrieve: (url: string) => Promise<string>
	) {
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
			const layoutSpec: ViewDef = parseLayout(layout);
			return this.recursivelyParseViews(layoutSpec);
		} catch (error) {
			throw handleError(
				error,
				"InvalidLayout",
				"Invalid ’layout’ Parameter",
				layout
			);
		}
	}

	private get(name: string) {
		if (!this.params.has(name)) {
			const error = new Error(`Missing parameter for view ’${name}’.`);
			error.name = "UndefinedView";
			// @ts-ignore comment
			error.availableParams = Array.from(this.params.keys()).filter(
				k => k !== "layout"
			);
			// @ts-ignore comment
			error.title = `Undefined View ’${name}’`;
			return { error };
		}

		const viewParameter = this.params.get(name);
		try {
			const parsed = parseView(viewParameter);

			parsed.resources.forEach((resource: Resource) => {
				const name = resource.value;
				let url: string;

				if (resource.value.startsWith("$")) {
					if (!this.params.has(name)) {
						throw new Error(`Shared source ’${name}’ is not available.`);
					}

					url = this.params.get(resource.value);
				} else {
					url = resource.value;
				}

				// @ts-ignore comment
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

	private recursivelyParseViews(view: ViewDef): ViewDef {
		if (typeof view === "string") {
			// @ts-ignore comment
			return this.get(view);
		}

		// @ts-ignore comment
		view.views.forEach((v: ViewFrameCollection) => {
			// @ts-ignore comment
			v.view = this.recursivelyParseViews(v.view);
		});

		return view;
	}
}

export default function parse(
	parameters: URLSearchParams,
	retrieve: (url: string) => Promise<string> = retrieveText
) {
	return new LayoutParser(parameters, retrieve).parse();
}
