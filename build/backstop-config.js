#!/usr/bin/env node

const fs = require("node:fs");
const examples = require("./examples.js");

const backstopConfigFile = "tests/visual/backstop.json";
const backstopConfig = JSON.parse(fs.readFileSync(backstopConfigFile, "utf8"));

backstopConfig.scenarios = Object.values(examples.all)
	.filter(ex => ex.screenshot)
	.map(ex => ({
		label: ex.id,
		url: ex.testUrl,
		referenceUrl: ex.canonicalUrl,
		viewports: [
			Object.assign({ height: 798, width: 1440, label: "main" }, ex.viewport),
		],
		delay: ex.delay || 3000,
		onReadyScript: ex.onReadyScript,
	}));

fs.writeFileSync(
	backstopConfigFile,
	JSON.stringify(backstopConfig, null, 2) + "\n",
	"utf8"
);
