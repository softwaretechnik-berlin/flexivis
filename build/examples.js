const canonicalBaseUrl = "https://flexivis.infrastruktur.link/";
const localBaseUrl = "http://localhost:1234/";

const fs = require("fs");
const yaml = require("js-yaml");

const examples = yaml.safeLoad(
	fs.readFileSync("examples.yaml", "utf8")
);

examples.all = [];

Object.entries(examples.general).forEach(([id, e]) => enrichExample(id, e));

Object.entries(examples.handlers).forEach(([handler, spec]) =>
    spec.examples.forEach((e, i) => enrichExample(`${handler}-${i+1}`, e))
);

function enrichExample(id, e) {
    e.id = id;
    e.localUrl = `${localBaseUrl}?${e.query}`;
    e.canonicalUrl = `${canonicalBaseUrl}?${e.query}`;
    e.screenshot = e.screenshot !== false;
    if (e.screenshot)
        e.screenshotPath = `tests/visual/backstop_data/bitmaps_reference/flexivis_${e.id}_0_document_0_main.png`
    
    examples.all.push(e);
    return e;
}

module.exports = examples;
