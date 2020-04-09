const { Asset } = require("parcel-bundler");
const md = require("flexivis-md")({ html: true });

class MarkdownAsset extends Asset {
	constructor(name, pkg, options) {
		super(name, pkg, options);
		this.type = "html";
	}

	async parse(markdownString) {
		return md(markdownString);
	}

	async generate() {
		return this.ast;
	}
}

module.exports = MarkdownAsset;
