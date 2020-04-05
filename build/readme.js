#!/usr/bin/env node

const yaml = require("js-yaml");
const fs = require("fs");

const baseUrl = "https://flexivis.infrastruktur.link/";
// Const baseUrl = "http://localhost:1234/";
const takeScreenshots = true;

const screenshotsPath = "docs/images/";
let sharedBrowser = null;

const handlers = yaml.safeLoad(
	fs.readFileSync("src/views/handlers.yaml", "utf8")
);

(async () => {
	const berlinWalk = saveScreenshot(
		"https://flexivis.infrastruktur.link?layout=(explanation30-map)/source&explanation=md:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.md&map=map:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json&source=json:https://raw.githubusercontent.com/programmiersportgruppe/flexivis/master/docs/samples/berlin-walk.json",
		"berlin-walk.png"
	);
	const descriptions = await renderDescriptions(handlers);
	await berlinWalk;
	const browser = await sharedBrowser;
	if (!browser) {
		browser.close();
	}

	console.log(renderToc(handlers));
	console.log("");
	console.log(descriptions);
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
	return Promise.all(Object.entries(handlers).map(renderDescription)).then(ds =>
		ds.join("\n\n")
	);
}

async function renderDescription([
	name,
	{ title, prefixes, description, examples },
]) {
	const renderedExamples = await Promise.all(
		examples.map((example, i) => renderExample(name, i + 1, example))
	);
	return `### ${title}\n\nView specification prefix${
		prefixes.length === 1 ? "" : "s"
	}: ${prefixes
		.map(p => "`" + p + "`")
		.join(", ")}.\n\n${description}\n\n${renderedExamples.join("\n")}`;
}

function renderExample(handler, number, example) {
	const query = example.query || `url=${example}`;
	const rawUrl = `${baseUrl}?${query}`;

	const intro = example.intro ? example.intro + "\n\n" : "";
	const url = "```\n" + rawUrl + "\n```\n";
	const preScreenshot = intro + url;

	if (example.screenshot === false) return preScreenshot;

	const filename = `example-${handler}-${number}.png`;
	return saveScreenshot(rawUrl, filename, example.viewport).then(
		path =>
			`${preScreenshot}\n<a href="${rawUrl
				.replace(/&/g, "&amp;")
				.replace(
					/"/g,
					"&quot;"
				)}"><img alt="rendering of the URL shown above" src="${path}" style="border: 1px solid #ccc; max-height: 300px"/></a>\n`
	);
}

async function saveScreenshot(url, filename, viewport) {
	const path = screenshotsPath + filename;

	if (!takeScreenshots) return path;

	sharedBrowser = sharedBrowser || require("puppeteer").launch();
	const browser = await sharedBrowser;
	const page = await browser.newPage();

	page.on("pageerror", err => {
		console.error("");
		console.error("URL:", url);
		console.error("filename:", filename);
		console.error("Page error:", err);
		process.exit(1);
	});

	await page.setViewport(viewport || { width: 1440, height: 798 });

	console.log("Loading", url);
	await Promise.all([page.waitForNavigation(), page.goto(url)]);

	await new Promise(resolve => setTimeout(resolve, 30000));

	await page.screenshot({ path });
	console.log("Saved screenshot to", path);

	await page.close();
	console.log("Page closed");

	return path;
}
