#!/usr/bin/env node

const util = require("util");
const path = require("path");
const fs = require("fs");
const glob = util.promisify(require("glob"));
const exec = util.promisify(require("child_process").exec);

const projectDir = path.join(__dirname, "..");
process.chdir(projectDir);

const run = (cmd, options) =>
	exec(cmd, options).then(out => {
		console.log(out.stdout);
		console.error(out.stderr);
	});

glob("src/parsers/*.pegjs")
	.then(files => {
		return Promise.all(
			files.map(async file => {
				const outputFile = file.replace(/\.[^.]+$/, ".js");
				await run(`npx pegjs -o ${outputFile} --format commonjs ${file}`);
				fs.writeFileSync(
					outputFile,
					"// @ts-nocheck\n\n" + fs.readFileSync(outputFile, "utf-8"),
					"utf-8"
				);
				await run(`npx grammkit -t md ../../${file}`, {
					cwd: `${projectDir}/docs/grammar`,
				});
			})
		);
	})
	.catch(error => {
		throw error;
	});
