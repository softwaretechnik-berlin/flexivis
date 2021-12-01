const canonicalBaseUrl = "https://flexivis.infrastruktur.link/";
const testBaseUrl = "http://host.docker.internal:1234/";

const fs = require("fs");
const yaml = require("js-yaml");

const examples = yaml.safeLoad(fs.readFileSync("examples.yaml", "utf8"));

examples.all = [];

for (const [id, example] of Object.entries(examples.general))
	enrichExample(id, example);

for (const [handler, spec] of Object.entries(examples.handlers))
	for (const [i, example] of spec.examples.entries())
		enrichExample(`${handler}-${i + 1}`, example);

function enrichExample(id, example) {
	example.id = id;
	example.testUrl = `${testBaseUrl}?${example.query}`;
	example.canonicalUrl = `${canonicalBaseUrl}?${example.query}`;
	example.screenshot = example.screenshot !== false;
	if (example.screenshot)
		example.screenshotPath = `tests/visual/backstop_data/bitmaps_reference/flexivis_${example.id}_0_document_0_main.png`;

	examples.all.push(example);
	return example;
}

module.exports = examples;
