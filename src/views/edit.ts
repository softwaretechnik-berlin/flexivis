import { Handler, Context } from "./common";
import { CodeJar as codeJar } from "@medv/codejar";
import { withLineNumbers } from "@medv/codejar/linenumbers";
import hljs from "highlight.js";

import debounce from "./debounce";

export default class EditHandler implements Handler {
	async handle(ctx: Context): Promise<void> {
		const dataSource = ctx.view.resources[0].value;
		const initialContent = await dataSource.latest;

		const wrapper = document.createElement("div");
		wrapper.classList.add("edit");
		wrapper.style.position = "relative";

		const textarea = document.createElement("div");
		textarea.classList.add("editor");
		const lang = ctx.view.config.lang;
		if (typeof lang === "string") {
			textarea.classList.add(lang);
		}

		textarea.style.width = "100%";
		textarea.style.height = "100%";

		wrapper.append(textarea);
		ctx.element.append(wrapper);

		const highlight = (editor: HTMLElement): void => {
			// Highlight.js does not trims old tags,
			// let's do it by this hack.
			editor.textContent = editor.textContent.toString();
			try {
				hljs.highlightBlock(editor);
			} catch (_) {}
		};

		const jar = codeJar(textarea, withLineNumbers(highlight), {
			tab: "  ",
		});
		jar.updateCode(initialContent);

		const update = (): void => {
			dataSource.latest = jar.toString();
		};

		wrapper.addEventListener(
			"keydown",
			event => {
				if (event.ctrlKey && event.key === "s") {
					update();
				}
			},
			true
		);
		jar.onUpdate(debounce(update));
	}
}
