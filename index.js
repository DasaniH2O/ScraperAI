const puppeteer = require("puppeteer");
const express = require("express");
const app = express();

app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).send("Missing URL");

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--proxy-server=http://brd.superproxy.io:33335"]
    });

    const page = await browser.newPage();
    await page.authenticate({
      username: process.env.BRIGHTDATA_USERNAME || "brd-customer-<YOUR_ID>-zone-<YOUR_ZONE>",
      password: process.env.BRIGHTDATA_PASSWORD || "<YOUR_PASSWORD>"
    });

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    const html = await page.content();
    await browser.close();

    res.status(200).send(html);
  } catch (err) {
    console.error("Scraping failed:", err.message);
    res.status(500).send("Error scraping page");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
