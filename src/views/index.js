const mod = loadHandlerModule => ctx =>
  loadHandlerModule()
    .then(m => new m.default())
    .then(handler => handler.handle(ctx));

const handlers = {
  http: mod(() => import("./frame.js")),
  https: mod(() => import("./frame.js")),
  file: mod(() => import("./frame.js")),
  md: mod(() => import("./markdown.js")),
  "md-inline": mod(() => import("./markdown.js")),
  json: mod(() => import("./json.js")),
  "json-inline": mod(() => import("./json.js")),
  text: mod(() => import("./text.js")),
  "text-inline": mod(() => import("./text.js")),
  vega: mod(() => import("./vega.js")),
  "vega-inline": mod(() => import("./vega.js")),
  mermaid: mod(() => import("./mermaid.js")),
  "mermaid-inline": mod(() => import("./mermaid.js")),
  map: mod(() => import("./map.js")),
  readme: mod(() => import("./readme.js")),
};

export function mount(riot, element, definition) {
  const index = definition.indexOf(":");
  const name = definition.slice(0, index);
  const description = definition.slice(index + 1);

  console.log("riot", riot);

  const handler = handlers[name];
  if (!handler) {
    const e = new Error(`Unknown handler "${name}".`);
    e.title = "Unknown Handler"
    e.knownHandlers = Object.keys(handlers);
    throw e;
  }
  
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
