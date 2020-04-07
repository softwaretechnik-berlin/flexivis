const canonicalBaseUrl = "https://flexivis.infrastruktur.link/";
const testBaseUrl = "http://host.docker.internal:1234/";

const fs = require("fs");
const yaml = require("js-yaml");

const examples = yaml.safeLoad(fs.readFileSync("examples.yaml", "utf8"));

examples.all = [];

Object.entries(examples.general).forEach(([id, example]) =>
	enrichExample(id, example)
);

Object.entries(examples.handlers).forEach(([handler, spec]) =>
	spec.examples.forEach((example, i) =>
		enrichExample(`${handler}-${i + 1}`, example)
	)
);

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
