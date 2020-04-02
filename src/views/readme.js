import "highlight.js/styles/github.css";
import "github-markdown-css/github-markdown.css";

import { Handler } from "./common.js";

export default class ReadmeHandler extends Handler {
    handle(ctx) {
        const div = document.createElement("div");
        div.className = "markdown markdown-body readme";
        // `require` already renders the markdown file. Therefore we cannot use the existing `markdownHandler` directly.
        // There is a workaround documented in https://github.com/parcel-bundler/parcel/issues/970
        // but it doesn't render the README the same way that GitHub does (!), so for now we stick with this approach.
        console.log(typeof require("../../README.md"));
        div.innerHTML = require("../../README.md");
        ctx.element.appendChild(div);
    }
}
