import { parse as parseLayout, ViewDef } from "./parsers/layout";
import { parse as parseView, Resource, Config } from "./parsers/view";
import DataSource from "./data-source";
import { FlexivisError } from "./flexivis";

const inlinedDataPrefix = "inline:";

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

class InputParseError extends FlexivisError {
	constructor(
		name: string,
		title: string,
		message: string,
		public details: {
			prefixSection: string;
			invalidSection: string;
			suffixSection: string;
		}
	) {
		super(name, title, message);
	}
}

class UndefinedViewError extends FlexivisError {
	constructor(
		title: string,
		message: string,
		public details: { availableParameters: string[] }
	) {
		super("UndefinedView", title, message);
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

		return new InputParseError(name, title, error.message, {
			prefixSection: input.slice(0, Math.max(0, start)),
			invalidSection: input.slice(start, end),
			suffixSection: input.slice(Math.max(0, end)),
		});
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

const globalDataSourceCache = new Map<string, DataSource<string>>();

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
		this.dataSourceCache = globalDataSourceCache;
	}

	parse(): XView {
		const layout = this.params.get("layout");
		this.extractDataSources();
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

	private extractDataSources(): void {
		for (const [name, value] of this.params.entries()) {
			if (name.startsWith("$")) {
				let url = value;
				if (url.startsWith(inlinedDataPrefix)) {
					url =
						"data:," + encodeURIComponent(url.slice(inlinedDataPrefix.length));
				}

				this.dataSourceCache.set(
					name,
					new DataSource(name, url, this.retrieve(url))
				);
			}
		}
	}

	private get(name: string): XView {
		if (!this.params.has(name)) {
			const error = new UndefinedViewError(
				`Undefined View ’${name}’`,
				`Missing parameter for view ’${name}’.`,
				{
					availableParameters: Array.from(this.params.keys()).filter(
						k => k !== "layout"
					),
				}
			);
			return { error };
		}

		const viewParameter = this.params.get(name);
		try {
			const parsed = parseView(viewParameter);

			const resources: XResource[] = parsed.resources.map(
				(resource: Resource) => {
					const name = resource.value;

					if (!this.dataSourceCache.has(name)) {
						if (resource.value.startsWith("$")) {
							throw new Error(`Shared source ’${name}’ is not available.`);
						} else {
							const url = resource.value;
							this.dataSourceCache.set(
								name,
								new DataSource(name, url, this.retrieve(url))
							);
						}
					}

					return {
						config: resource.config,
						value: this.dataSourceCache.get(name),
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
