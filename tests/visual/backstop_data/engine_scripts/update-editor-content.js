module.exports = async page => {
	await page.waitForSelector(".editor");
	await page.$eval(".editor-content", editor => {
		editor.textContent += " World!";
	});

	// Wait for the changes to be propagated
	await new Promise(resolve => {
		setTimeout(resolve, 1000);
	});
};
