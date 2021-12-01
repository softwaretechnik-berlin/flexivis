import { Context, Handler } from "./common";

export default class ReadmeHandler implements Handler {
	async handle(ctx: Context): Promise<void> {
		const div = document.createElement("div");
		div.className = "markdown markdown-body readme";
		// `require` already renders the markdown file. Therefore we cannot use the existing `markdownHandler` directly.
		// There is a workaround documented in https://github.com/parcel-bundler/parcel/issues/970
		// but it doesn't render the README the same way that GitHub does (!), so for now we stick with this approach.
		fetch(require("../../README.md"))
			.then(async res => res.text())
			.then(html => {
				div.innerHTML = html;
			})
			.catch(error => {
				console.error(error);
				div.innerText = "Failed to load README.";
			});
		ctx.element.append(div);
	}
}
