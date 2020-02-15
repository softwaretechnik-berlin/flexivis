import * as hljs from "highlight.js";
import MarkdownIt from "markdown-it";
import "highlight.js/styles/github.css";

import mermaid from "mermaid";

// console.log(mermaid);

const md = new MarkdownIt({
  typographer: true,
  linkify: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (e) {}
    } else if (lang === 'mermaid') {
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

const markdownHandler = retriever => ctx => {
  return Promise.resolve(retriever(ctx)).then(source => {
    const div = document.createElement("div");
    div.classList.add("markdown");
    div.innerHTML = md.render(source);
    ctx.element.appendChild(div);

    // render any mermaid template that was added by the highlighter
    mermaid.init(undefined, '.mermaid');
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

const get = url => fetch(url).then(r => r.text());

const handlers = {
  http: resourceHandler,
  https: resourceHandler,
  file: resourceHandler,
  md: markdownHandler(ctx => get(ctx.description)),
  "md-raw": markdownHandler(ctx => ctx.description),
  html: htmlHandler,
  map: mapHandler,
  mermaid: mermaidHandler(ctx => get(ctx.description)),
  "mermaid-raw": mermaidHandler(ctx => ctx.description),
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
