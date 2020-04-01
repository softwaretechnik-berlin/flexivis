import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown.css";

import hljs from "highlight.js";
import MarkdownIt from "markdown-it";

import mermaid from "mermaid";

const md = new MarkdownIt({
  typographer: true,
  linkify: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (e) {}
    } else if (lang === "mermaid") {
      return `<div class="mermaid">${str}</div>`;
    }

    // use external default escaping
    return "";
  },
});

const documentation = "readme:";
const errorHandler = ctx => {
  ctx.element.innerHTML = `Cannot handle '${ctx.name}'`;
};

const resourceHandler = ctx => {
  const iframe = document.createElement("iframe");
  iframe.src = ctx.definition;
  ctx.element.appendChild(iframe);
};

const jsonHandler = retriever => ctx => {
  return Promise.resolve(retriever(ctx)).then(source => {
    const div = document.createElement("div");
    div.classList.add("json");
    ctx.element.appendChild(div);
    ctx.riot.mount(
      div,
      { obj: JSON.parse(source), showDepth: 4 },
      "tree-search"
    );
  });
};

const markdownHandler = retriever => ctx => {
  return Promise.resolve(retriever(ctx)).then(source => {
    const div = document.createElement("div");
    div.classList.add("markdown");
    div.classList.add("markdown-body");
    div.innerHTML = md.render(source);
    ctx.element.appendChild(div);

    // render any mermaid templates that were added by the highlighter
    mermaid.init(undefined, ".mermaid");
  });
};

const htmlHandler = retriever => ctx => {
  return Promise.resolve(retriever(ctx)).then(source => {
    const iframe = document.createElement("iframe");
    iframe.src = `data:text/html;charset=utf-8,${escape(source)}`;
    ctx.element.appendChild(iframe);
  });
};

const readmeHandler = ctx =>
  markdownHandler(() => "")(ctx).then(() => {
    const div = ctx.element.children[0];
    div.classList.add("readme");
    // `require` already renders the markdown file. Therefore we cannot
    // use the existing `markdownHandler` directly. There is a workaround
    // documented in https://github.com/parcel-bundler/parcel/issues/970
    // but for now I'd stick with this approach.
    div.innerHTML = require("./README.md");
  });

const mapHandler = ctx => {
  ctx.riot.mount(ctx.element, { sources: ctx.description }, "layer-map");
};

const mermaidHandler = retriever => ctx => {
  return Promise.resolve(retriever(ctx)).then(source => {
    ctx.element.innerHTML = source;
    mermaid.init(undefined, ctx.element);
  });
};

const vegaHandler = retriever => ctx => {
  return Promise.resolve(retriever(ctx)).then(source => {
    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "100%";
    return import("vega-embed").then(module => {
      module.default(div, JSON.parse(source));
      ctx.element.appendChild(div);
    });
  });
};

const textHandler = retriever => ctx => {
  return Promise.resolve(retriever(ctx)).then(source => {
    const div = document.createElement("div");
    div.className = "text";
    div.innerText = source;
    ctx.element.appendChild(div);
  });
};

const get = url => fetch(url).then(r => r.text());

const handlers = {
  http: resourceHandler,
  https: resourceHandler,
  file: resourceHandler,
  json: jsonHandler(ctx => get(ctx.description)),
  md: markdownHandler(ctx => get(ctx.description)),
  "md-inline": markdownHandler(ctx => ctx.description),
  "html-inline": htmlHandler(ctx => ctx.description),
  map: mapHandler,
  mermaid: mermaidHandler(ctx => get(ctx.description)),
  "mermaid-inline": mermaidHandler(ctx => ctx.description),
  text: textHandler(ctx => get(ctx.description)),
  vega: vegaHandler(ctx => get(ctx.description)),
  readme: readmeHandler,
};

export function mount(riot, element, definition) {
  const match = (definition || documentation).match(/^([^:]+).(.*)/) || [];
  const handler = handlers[match[1]] || errorHandler;
  const result = new Promise(resolve => {
    resolve(
      handler({
        riot,
        element,
        definition,
        name: match[1],
        description: match[2],
      })
    );
  });

  result.catch(e => console.error(e));
}
