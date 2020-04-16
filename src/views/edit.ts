import { Handler, Context } from "./common";

export default class EditHandler implements Handler {
	async handle(ctx: Context): Promise<void> {
		const dataSource = ctx.view.resources[0].value;
		const content = await dataSource.latest;

		const textarea = document.createElement("textarea");
		textarea.textContent = content;
		textarea.style.width = "100%";
		textarea.style.height = "100%";

		const button = document.createElement("button");
		button.textContent = "Update";
		button.style.right = "0";
		button.style.position = "absolute";
		button.addEventListener("click", () => {
			dataSource.latest = textarea.value;
		});

		ctx.element.append(textarea);
		ctx.element.append(button);
	}
}
