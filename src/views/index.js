const documentation = "readme:";
const errorHandler = ctx => {
  ctx.element.innerHTML = `Cannot handle '${ctx.name}'`;
};

const mod = loadHandlerFactory => ctx =>
  loadHandlerFactory()
    .then(factory => factory())
    .then(handler => handler.handle(ctx));

const readmeHandler = ctx =>
  mod(
    () => import("./markdown.js"),
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
  http: mod(() => import("./frame.js")),
  https: mod(() => import("./frame.js")),
  file: mod(() => import("./frame.js")),
  md: mod(() => import("./markdown.js")),
  "md-inline": mod(() => import("./markdown.js")),
  json: mod(() => import("./json.js")),
  text: mod(() => import("./text.js")),
  vega: mod(() => import("./vega.js")),
  mermaid: mod(() => import("./mermaid.js")),
  "mermaid-inline": mod(() => import("./mermaid.js")),
  map: mod(() => import("./map.js")),
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
