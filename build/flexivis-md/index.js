const MarkdownIt = require("markdown-it");
const hljs = require("highlight.js");

module.exports = config => {
	const md = new MarkdownIt(
		"default",
		Object.assign(
			{
				html: false,
				typographer: true,
				highlight: (string, lang) => {
					if (lang && hljs.getLanguage(lang)) {
						try {
							return hljs.highlight(lang, string).value;
						} catch (_) {}
					} else if (lang === "mermaid") {
						return `<div class="mermaid">${string}</div>`;
					}

					// Use external default escaping
					return "";
				},
			},
			config
		)
	).use(require("markdown-it-headinganchor"), {
		anchorClass: "heading-anchor",
		slugify: string => string.replace(/\s+/g, "-").toLowerCase(),
	});

	return source => md.render(source);
};
