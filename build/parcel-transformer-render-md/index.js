const { Transformer } = require("@parcel/plugin");
const compile = require("flexivis-md")({ html: true });

module.exports = new Transformer({
	async transform({ asset }) {
		const source = await asset.getCode();

		asset.type = "html";
		const html = compile(source);
		asset.setCode(html);

		return [asset];
	},
});
