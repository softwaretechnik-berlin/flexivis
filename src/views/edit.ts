import { Handler, Context } from "./common";
import { CodeJar } from "@medv/codejar";
import { withLineNumbers } from "@medv/codejar/linenumbers";
import hljs from "highlight.js";

export default class EditHandler implements Handler {
  async handle(ctx: Context): Promise<void> {
    const dataSource = ctx.view.resources[0].value;
		const initialContent = await dataSource.latest;

		const wrapper = document.createElement("div");
		wrapper.style.position = "relative";

    const textarea = document.createElement("div");
    textarea.classList.add("editor");
    textarea.style.width = "100%";
    textarea.style.height = "100%";

    const button = document.createElement("button");
    button.textContent = "Update";
    button.style.top = "0";
    button.style.right = "0";
    button.style.position = "absolute";

		wrapper.append(textarea);
		wrapper.append(button);
    ctx.element.append(wrapper);

    const highlight = (editor: HTMLElement): void => {
      // highlight.js does not trims old tags,
      // let's do it by this hack.
      editor.textContent = editor.textContent;
      try {
        hljs.highlightBlock(editor);
      } catch (_) {}
    };
    const jar = CodeJar(textarea, withLineNumbers(highlight), {
      tab: "  ",
    });
    jar.updateCode(initialContent);

    button.addEventListener("click", () => {
      dataSource.latest = jar.toString();
    });
  }
}
