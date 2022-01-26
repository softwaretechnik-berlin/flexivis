// Uses the puppeteer engine
module.exports = async page => {
	await page.click(".select-modal-btn-0");

	await page.waitForSelector("iframe");
	const elementHandle = await page.$("iframe");
	const frame = await elementHandle.contentFrame();

	await frame.waitForSelector("body");
	await frame.$eval(
		"body",
		() =>
			new Promise((resolve, reject) => {
				window.addEventListener("load", () => resolve());
				setTimeout(
					() => reject(new Error("Waiting for iframe load has timed out")),
					10_000
				);
			})
	);
};
