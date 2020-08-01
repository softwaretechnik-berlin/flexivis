#!/usr/bin/env node

const fs = require("fs");
const examples = require("./examples.js");
const handlers = examples.handlers;

(() => {
	const readme = fs.readFileSync("README.md", "utf8");
	const toc = renderToc(handlers);

	fs.writeFileSync(
		"README.md",
		updateSection(
			updateSection(readme, "view specifications table of contents", toc),
			"view specifications",
			toc + "\n\n" + renderDescriptions(handlers)
		)
	);
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
	return Object.values(handlers).map(renderDescription).join("\n\n");
}

function renderDescription({ title, prefixes, description, examples }) {
	const renderedExamples = examples.map(renderExample).join("\n");
	return `### ${title}\n\nView specification prefix${
		prefixes.length === 1 ? "" : "es"
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
				)}"><img alt="rendering of the URL shown above" src="${
				example.screenshotPath
		  }"/></a>\n`
		: "";

	return intro + url + screenshot;
}

function updateSection(original, sectionName, section) {
	const lines = original.split("\n");
	const beginMarkerLine =
		lines.findIndex(s => s.includes(`<!-- BEGIN ${sectionName} -->`)) + 1;
	const lastContentLine = lines.findIndex(s =>
		s.includes(`<!-- END ${sectionName} -->`)
	);
	if (beginMarkerLine < 1 || lastContentLine <= beginMarkerLine)
		throw new Error(
			`Can’t find section "${sectionName} (begin marker on line ${beginMarkerLine}, end marker on line ${
				lastContentLine + 1
			})`
		);
	const indentation = lines[beginMarkerLine - 1].match(/^ */)[0];
	const sectionLines = section.split("\n");
	const trailingCharacters = sectionLines.pop();
	if (trailingCharacters !== "") sectionLines.push(trailingCharacters);
	lines.splice(
		beginMarkerLine,
		lastContentLine - beginMarkerLine,
		...sectionLines.map(l => indentation + l)
	);
	return lines.join("\n");
}
