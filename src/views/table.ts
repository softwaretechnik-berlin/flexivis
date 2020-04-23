import { Handler, Context } from "./common";

import Spreadsheet from "x-data-spreadsheet";
import Papa from "papaparse";

import debounce from "./debounce";

type Sheet = { name: string; rows: Record<string, unknown> };

export default class EditHandler implements Handler {
	async handle(ctx: Context): Promise<void> {
		const spreadsheetDiv = document.createElement("div");
		spreadsheetDiv.style.width = "100%";
		spreadsheetDiv.style.height = "100%";
		ctx.element.append(spreadsheetDiv);

		const options = {
			showToolbar: false,
			view: {
				height: () => spreadsheetDiv.clientHeight,
				width: () => spreadsheetDiv.clientWidth,
			},
		};

		const spreadsheet = new Spreadsheet(spreadsheetDiv, options).loadData(
			ctx.view.resources.map(resource => {
				return { name: resource.value.name };
			})
		);

		const resources = new Map(
			ctx.view.resources.map(resource => {
				const name = resource.value.name;
				const sheet = spreadsheet.datas.find(sheet => sheet.name === name);

				resource.value.observe((error, value) => {
					if (error) {
						ctx.handleError(error);
					} else {
						sheet.setData(this.csvToSheet(name, value));
						spreadsheet.sheet.reload();
					}
				});

				return [name, resource.value];
			})
		);

		spreadsheet.change(
			debounce(() => {
				spreadsheet.getData().forEach((sheet: Sheet) => {
					if (resources.has(sheet.name)) {
						const csv = this.sheetToCsv(sheet);
						resources.get(sheet.name).latest = csv;
					}
				});
			})
		);
	}

	private csvToSheet(name: string, csv: string): Sheet {
		const rows = Object.fromEntries(
			Papa.parse(csv).data.map((row, i) => {
				const cells = Object.fromEntries(
					row.map((cell, j) => [j, { text: cell }])
				);
				return [i, { cells }];
			})
		);
		return { name, rows };
	}

	private sheetToCsv(sheet: Sheet): string {
		const length = (object: Record<string, unknown>): number => {
			const numbers = Object.keys(object)
				.map(i => parseInt(i, 10))
				.filter(n => n >= 0);
			return numbers.length === 0 ? 0 : Math.max(...numbers) + 1;
		};

		const cellsPerRow = Array.from(new Array(length(sheet.rows))).map(
			(_, i) => Object.assign({ cells: [] }, sheet.rows[i]).cells
		);

		const baseRow =
			cellsPerRow.length === 0
				? []
				: Array.from(new Array(Math.max(...cellsPerRow.map(length))));

		return Papa.unparse(
			cellsPerRow.map(cells => baseRow.map((_, j) => (cells[j] || {}).text))
		);
	}
}
