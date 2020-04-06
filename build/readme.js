#!/usr/bin/env node

const examples = require("./examples.js");
const handlers = examples.handlers;

(() => {
	console.log(renderToc(handlers));
	console.log("");
	console.log(renderDescriptions(handlers));
})();

function renderToc(handlers) {
	return (
		"<ul>\n" +
		Object.values(handlers)
			.map(
				({ title }) =>
					`    <li><a href="#${title
						.toLowerCase()
						.replace(/ /g, "-")}">${title}</a></li>\n`
			)
			.join("") +
		"</ul>\n"
	);
}

function renderDescriptions(handlers) {
	return Object.entries(handlers).map(renderDescription).join("\n\n")
}

function renderDescription([
	name,
	{ title, prefixes, description, examples },
]) {
	const renderedExamples = examples.map(renderExample).join("\n");
	return `### ${title}\n\nView specification prefix${
		prefixes.length === 1 ? "" : "s"
	}: ${prefixes
		.map(p => "`" + p + "`")
		.join(", ")}.\n\n${description}\n\n${renderedExamples}`;
}

function renderExample(example) {
	const intro = example.intro ? example.intro + "\n\n" : "";
	const url = "```\n" + example.canonicalUrl + "\n```\n";
    const screenshot = example.screenshotPath
        ? `\n<a href="${example.canonicalUrl
				.replace(/&/g, "&amp;")
				.replace(
					/"/g,
					"&quot;"
				)}"><img alt="rendering of the URL shown above" src="${example.screenshotPath}" style="border: 1px solid #ccc; max-height: 300px"/></a>\n`
        : '';

    return preScreenshot = intro + url + screenshot;
}
