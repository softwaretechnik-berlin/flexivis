import { CodeJar as codeJar } from "codejar";
import { withLineNumbers } from "codejar/linenumbers";
import hljs from "highlight.js";
import { Handler, Context } from "./common";

import debounce from "./debounce";

export default class EditHandler implements Handler {
	async handle(ctx: Context): Promise<void> {
		const dataSource = ctx.view.resources[0].value;

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
			editor.innerHTML = hljs.highlightAuto(editor.textContent).value;
		};

		const jar = codeJar(
			textarea,
			withLineNumbers(highlight, { wrapClass: "editor-content" }),
			{
				tab: "  ",
			}
		);

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

		dataSource.observe((error, value) => {
			if (error) {
				ctx.handleError(error);
			} else if (value !== jar.toString()) {
				jar.updateCode(value);
			}
		});
	}
}
