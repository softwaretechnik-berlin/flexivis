module.exports = async page => {
	await page.waitForSelector(".editor");
	await page.$eval(".editor", editor => {
		editor.textContent += " World!";
	});

	await page.click(".update-btn");
};
