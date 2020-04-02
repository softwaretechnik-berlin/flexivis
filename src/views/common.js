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
    throw `Cannot handle type '${ctx.name}'`;
  }
}

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
    const source = await this.retriever(ctx);
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
