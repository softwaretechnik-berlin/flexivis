import { parse as parseLayout, ViewDef } from "./parsers/layout";
import { parse as parseView, Resource, Config } from "./parsers/view";
import DataSource from "./data-source";

export interface XConfig {
	[key: string]: string | string[] | Config;
}

export interface XResource {
	config: XConfig;
	value: DataSource<string>;
}

export interface XViewFrame {
	type: string;
	config: XConfig;
	resources: XResource[];
}

export interface XViewFrameCollection {
	sep: "/" | "-";
	views: Array<{ view: XView; size: number }>;
}

export interface XViewError {
	error: Error;
}

export type XView = XViewFrame | XViewFrameCollection | XViewError;

class InputParseError extends Error {
	constructor(
		public title: string,
		public prefixSection: string,
		public invalidSection: string,
		public suffixSection: string
	) {
		super();
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

class UndefinedViewError extends Error {
	constructor(public title: string, public availableParameters: string[]) {
		super();
	}
}

const convertSyntaxError = (
	error: Error,
	name: string,
	title: string,
	input: string
): Error => {
	if (error.name === "SyntaxError") {
		// @ts-ignore
		const start = error.location.start.offset;
		// @ts-ignore
		const end = error.location.end.offset;

		const converted = new InputParseError(
			title,
			input.slice(0, Math.max(0, start)),
			input.slice(start, end),
			input.slice(Math.max(0, end))
		);

		converted.name = name;
		converted.message = error.message;

		return converted;
	}

	return error;
};

const retrieveText = async (url: string): Promise<string> => {
	try {
		return await (await fetch(url)).text();
	} catch (error) {
		let message: string;
		if (error instanceof Error) {
			message = error.message;
		} else {
			message = "";
		}

		throw new TypeError(`Failed to fetch "${url}": ${message}`);
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

	parse(): XView {
		const layout = this.params.get("layout");
		try {
			const layoutSpec: ViewDef = parseLayout(layout);
			return this.recursivelyParseViews(layoutSpec);
		} catch (error) {
			throw convertSyntaxError(
				error,
				"InvalidLayout",
				"Invalid ’layout’ Parameter",
				layout
			);
		}
	}

	private get(name: string): XView {
		if (!this.params.has(name)) {
			const error = new UndefinedViewError(
				`Undefined View ’${name}’`,
				Array.from(this.params.keys()).filter(k => k !== "layout")
			);
			error.name = "UndefinedView";
			error.message = `Missing parameter for view ’${name}’.`;
			return { error };
		}

		const viewParameter = this.params.get(name);
		try {
			const parsed = parseView(viewParameter);

			const resources: XResource[] = parsed.resources.map(
				(resource: Resource) => {
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

					const value = this.dataSourceCache.has(name)
						? this.dataSourceCache.get(name)
						: this.dataSourceCache
								.set(name, new DataSource(name, url, this.retrieve(url)))
								.get(name);

					return {
						config: resource.config,
						value,
					};
				}
			);

			return {
				type: parsed.type,
				config: parsed.config,
				resources,
			};
		} catch (error) {
			return {
				error: convertSyntaxError(
					error,
					"InvalidView",
					`Invalid View Parameter ’${name}’`,
					viewParameter
				),
			};
		}
	}

	private recursivelyParseViews(view: ViewDef): XView {
		if (typeof view === "string") {
			return this.get(view);
		}

		const collection: XViewFrameCollection = {
			sep: view.sep,
			views: view.views.map(v => {
				return {
					size: v.size,
					view: this.recursivelyParseViews(v.view),
				};
			}),
		};

		return collection;
	}
}

export default function parse(
	parameters: URLSearchParams,
	retrieve: (url: string) => Promise<string> = retrieveText
): XView {
	return new LayoutParser(parameters, retrieve).parse();
}
