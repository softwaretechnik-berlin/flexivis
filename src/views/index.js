const documentation = "readme:";
const errorHandler = ctx => {
  ctx.element.innerHTML = `Cannot handle '${ctx.name}'`;
};

const retrievers = {
  description: ctx => ctx.description,
  resource: ctx => fetch(ctx.description).then(r => r.text()),
};

const mod = (loadHandlerFactory, retriever) => ctx =>
  loadHandlerFactory()
    .then(factory => factory(retriever))
    .then(handler => handler.handle(ctx));

const readmeHandler = ctx =>
  mod(
    () => import("./markdown"),
    () => ""
  )(ctx).then(() => {
    const div = ctx.element.children[0];
    div.classList.add("readme");
    // `require` already renders the markdown file. Therefore we cannot
    // use the existing `markdownHandler` directly. There is a workaround
    // documented in https://github.com/parcel-bundler/parcel/issues/970
    // but for now I'd stick with this approach.
    div.innerHTML = require("../../README.md");
  });

const handlers = {
  http: mod(() => import("./frame")),
  https: mod(() => import("./frame")),
  file: mod(() => import("./frame")),
  md: mod(() => import("./markdown"), retrievers.resource),
  "md-inline": mod(() => import("./markdown"), retrievers.description),
  json: mod(() => import("./json"), retrievers.resource),
  text: mod(() => import("./text"), retrievers.resource),
  vega: mod(() => import("./vega"), retrievers.resource),
  mermaid: mod(() => import("./mermaid"), retrievers.resource),
  "mermaid-inline": mod(() => import("./mermaid"), retrievers.description),
  map: mod(() => import("./map")),
  readme: readmeHandler,
};

export function mount(riot, element, definition) {
  definition = definition || documentation;

  const index = definition.indexOf(":");
  const name = definition.slice(0, index);
  const description = definition.slice(index + 1);

  const handler = handlers[name] || errorHandler;
  const result = new Promise(resolve => {
    resolve(
      handler({
        riot,
        element,
        definition,
        name,
        description,
      })
    );
  });

  result.catch(e => console.error(e));
}
