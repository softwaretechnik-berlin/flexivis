/**
 * Handles view specifications by rendering them into an element.
 */
export class Handler {
	/**
	 * Renders a view into the given element.
	 *
	 * @param {{name: string, definition: string, definition: string, element, riot}} ctx
	 * @returns {Promise.<*>} a promise that is fulfilled when the view is rendered, or rejected if the view cannot be rendered
	 */
	handle(ctx) {
		throw new Error(`Cannot handle type ’${ctx.name}’`);
	}
}

/**
 * Handles views types that are fully defined by a source string.
 *
 * These handlers can be used in 2 ways:
 * - By default, the view description is taken to be a URL from which the source should be retrieved.
 * - When the handler's base name is suffixed with "-inline", the view description itself is taken to be the source.
 *
 * Implementations need only specify how to render the view given the source string.
 */
export class SourceHandler extends Handler {
	constructor(retriever) {
		super();
		this.retriever = retriever;

		// As ridiculous as it may sound, ES6 class with babel does not autobind `this`.
		// For now, I'll just do the binding myself.
		// https://stackoverflow.com/a/42163458
		this.handle = this.handle.bind(this);
	}

	async handle(ctx) {
		const source = ctx.name.endsWith("-inline")
			? ctx.description
			: await fetch(ctx.description)
					.catch(error => {
						throw new Error(`Failed to fetch "${ctx.description}": ${error}`);
					})
					.then(r => r.text());
		return this.handleWithSource(source, ctx);
	}

	/**
	 * Renders the source into the given element.
	 *
	 * @param {string} source the source text to render
	 * @param {{name: string, definition: string, definition: string, element, riot}} ctx
	 * @returns {Promise.<*>} a promise that is fulfilled when the view is rendered, or rejected if the view cannot be rendered
	 */
	handleWithSource(source, ctx) {
		return super.handle(ctx);
	}
}
