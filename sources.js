import * as hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import "highlight.js/styles/github.css";

import mermaid from "mermaid";

import vegaEmbed from "vega-embed";

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

const defaultHandler = ctx => {
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
    div.innerHTML = md.render(source);
    ctx.element.appendChild(div);

    // render any mermaid templates that were added by the highlighter
    mermaid.init(undefined, ".mermaid");
  });
};

const htmlHandler = ctx => {
  const iframe = document.createElement("iframe");
  iframe.src = `data:text/html;charset=utf-8,${escape(ctx.description)}`;
  ctx.element.appendChild(iframe);
};

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
    const div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    vegaEmbed(div, JSON.parse(source));
    ctx.element.appendChild(div);
  });
};

const textHandler = retriever => ctx => {
  return Promise.resolve(retriever(ctx)).then(source => {
    const div = document.createElement("div");
    div.className = "text";
    div.innerText = source;
    ctx.element.appendChild(div);
  })
};

const get = url => fetch(url).then(r => r.text());

const handlers = {
  http: resourceHandler,
  https: resourceHandler,
  file: resourceHandler,
  json: jsonHandler(ctx => get(ctx.description)),
  md: markdownHandler(ctx => get(ctx.description)),
  "md-inline": markdownHandler(ctx => ctx.description),
  "html-inline": htmlHandler,
  map: mapHandler,
  mermaid: mermaidHandler(ctx => get(ctx.description)),
  "mermaid-inline": mermaidHandler(ctx => ctx.description),
  text: textHandler(ctx => get(ctx.description)),
  vega: vegaHandler(ctx => get(ctx.description)),
};

export function mount(riot, element, definition) {
  const match = definition.match(/^([^:]+).(.*)/) || [];
  const handler = handlers[match[1]] || defaultHandler;
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
