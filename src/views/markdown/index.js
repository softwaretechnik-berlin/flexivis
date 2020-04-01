import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown.css";

import { SourceHandler } from "../common";

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

class MarkdownHandler extends SourceHandler {
  constructor(retriever) {
    super(retriever);
  }
  handleWithSource(source, ctx) {
    const div = document.createElement("div");
    div.classList.add("markdown");
    div.classList.add("markdown-body");
    div.innerHTML = md.render(source);
    ctx.element.appendChild(div);

    // render any mermaid templates that were added by the highlighter
    mermaid.init(undefined, ".mermaid");
  }
}

module.exports = retriever => new MarkdownHandler(retriever);
