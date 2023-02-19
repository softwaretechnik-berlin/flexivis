

import './import-jquery.js'

require('jquery-ui/dist/themes/base/jquery-ui.css')
require('pivottable/dist/pivot.css')

import Papa from "papaparse";
import 'jquery-ui/dist/jquery-ui'


import "pivottable"


import { SourceHandler, Context } from "./common";
import csvParser from "csv-parser";


export default class PivottableHandler extends SourceHandler {
	async handleWithSource(source: string, ctx: Context): Promise<void> {
		const div = document.createElement("div");
		div.id = "pivottable_div"
		ctx.element.append(div);
		console.log("Yo!")
		console.log(ctx.view.config)

		let data
		if ('format' in ctx.view.config ) {
			switch (ctx.view.config['format']) {
				case 'csv':
					data = Papa.parse(source, {header: true,}).data
					break
				case 'tsv':
					data = Papa.parse(source, {header: true,}).data
					break
				case 'ndjson':
					data = source.split("\n").filter(l => l.trim().length > 0).map(l => JSON.parse(l))
			        break
				case 'json':
					data = JSON.parse(source)
					break
				default:
					throw `Unknown format '${ctx.view.config['format']}'`
			}
		} else {
			data = JSON.parse(source)
		}

		console.log(data)
		console.log($("#pivottable_div"))
		$("#pivottable_div").pivotUI(
			data,
			{
				rows: ["color"],
				cols: ["shape"]
			}
		);
	}
}
