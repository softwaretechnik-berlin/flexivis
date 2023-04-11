import * as riot from "riot";
import { FlexivisError } from "../flexivis";
import { type Context, SourceHandler, inlineExpandedViews } from "./common";

type Select = {
	items: Array<{ id: string }>;
	parameters: Record<string, string | Record<string, unknown>>;
	modals?: Record<string, "string">;
};

const isValid = (object: any): object is Select => {
	const asSelect = object as Select;
	return Boolean(
		asSelect.items && asSelect.items.length > 0 && asSelect.parameters
	);
};

export default class SelectHandler extends SourceHandler {
	async handleWithSource(source: string, ctx: Context): Promise<void> {
		const definition = JSON.parse(source);
		if (isValid(definition)) {
			inlineExpandedViews(definition.parameters);
			if (definition.modals) {
				inlineExpandedViews(definition.modals);
			}

			riot.mount(
				ctx.element,
				{ definition, config: ctx.view.config },
				"item-select"
			);
		} else {
			throw new FlexivisError(
				"InvalidSelectViewDefinition",
				"Invalid Select View Definition",
				`The format ’${source}’ is invalid.`
			);
		}
	}
}
