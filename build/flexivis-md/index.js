const MarkdownIt = require("markdown-it");
const hljs = require("highlight.js");

module.exports = config => {
	const md = new MarkdownIt(
		"default",
		Object.assign(
			{
				html: false,
				typographer: true,
				highlight(string, language) {
					if (language && hljs.getLanguage(language)) {
						try {
							return hljs.highlight(string, { language }).value;
						} catch {}
					} else if (language === "mermaid") {
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
