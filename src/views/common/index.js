
export const sourceRetrieverHandler = f => retriever => ctx =>
  Promise.resolve(retriever(ctx)).then(source => f(source, ctx));
