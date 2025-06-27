const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/scrape", async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing ?url param");

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
        "--no-zygote",
        "--proxy-server=http://USERNAME:PASSWORD@zproxy.lum-superproxy.io:22225"
      ]
    });

    const page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36");

    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });

    const html = await page.content();
    await browser.close();

    res.set("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    console.error("Scraping error:", err.message);
    res.status(500).send("Failed to scrape page.");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Puppeteer scraper running on port ${PORT}`);
});