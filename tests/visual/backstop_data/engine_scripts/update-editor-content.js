module.exports = async page => {
  await page.waitForSelector(".editor");
  await page.$eval(".editor", editor => {
    editor.textContent = editor.textContent + " World!";
  });

  await page.click(".update-btn");
};
