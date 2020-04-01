export class Handler {
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

  handleWithSource(source, ctx) {
    return super.handle(ctx);
  }
}
