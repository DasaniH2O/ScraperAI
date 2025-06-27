const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      `--proxy-server=http://zproxy.lum-superproxy.io:22225`
    ]
  });

  const page = await browser.newPage();

  // Bright Data credentials
  await page.authenticate({
    username: 'brd-customer-<your_username>-zone-<your_zone>',
    password: '<your_password>'
  });

  await page.goto('https://geo.brdtest.com/mygeo.json', { waitUntil: "networkidle2" });
  const content = await page.content();
  console.log(content);

  await browser.close();
})();