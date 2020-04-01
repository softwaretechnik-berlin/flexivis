const documentation = "readme:";
const errorHandler = ctx => {
  ctx.element.innerHTML = `Cannot handle '${ctx.name}'`;
};

const resourceHandler = ctx => {
  const iframe = document.createElement("iframe");
  iframe.src = ctx.definition;
  ctx.element.appendChild(iframe);
};

const jsonHandler = retriever => ctx =>
  import("./json").then(handler => handler(retriever)(ctx));

const markdownHandler = retriever => ctx =>
  import("./markdown").then(handler => handler(retriever)(ctx));

const vegaHandler = retriever => ctx =>
  import("./vega").then(handler => handler(retriever)(ctx));

const mermaidHandler = retriever => ctx =>
  import("./mermaid").then(handler => handler(retriever)(ctx));

const textHandler = retriever => ctx =>
  import("./text").then(handler => handler(retriever)(ctx));

const readmeHandler = ctx =>
  markdownHandler(() => "")(ctx).then(() => {
    const div = ctx.element.children[0];
    div.classList.add("readme");
    // `require` already renders the markdown file. Therefore we cannot
    // use the existing `markdownHandler` directly. There is a workaround
    // documented in https://github.com/parcel-bundler/parcel/issues/970
    // but for now I'd stick with this approach.
    div.innerHTML = require("../../README.md");
  });

const mapHandler = ctx => {
  ctx.riot.mount(ctx.element, { sources: ctx.description }, "layer-map");
};

const get = url => fetch(url).then(r => r.text());

const handlers = {
  http: resourceHandler,
  https: resourceHandler,
  file: resourceHandler,
  json: jsonHandler(ctx => get(ctx.description)),
  md: markdownHandler(ctx => get(ctx.description)),
  "md-inline": markdownHandler(ctx => ctx.description),
  map: mapHandler,
  mermaid: mermaidHandler(ctx => get(ctx.description)),
  "mermaid-inline": mermaidHandler(ctx => ctx.description),
  text: textHandler(ctx => get(ctx.description)),
  vega: vegaHandler(ctx => get(ctx.description)),
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
