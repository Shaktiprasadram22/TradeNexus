// Server/feature5_news.js

const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_BASE =
  process.env.SENTINEL_API_BASE_URL ||
  "https://sentineldatacore.netlify.app/api";

// GET /api/news - all news
router.get("/news", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/news`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch news" });
  }
});

// GET /api/news/search?query=...
router.get("/news/search", async (req, res) => {
  try {
    const query = req.query.query?.toLowerCase() || "";
    const response = await axios.get(`${API_BASE}/news`);
    const allNews = response.data;
    const filtered = allNews.filter(
      (item) =>
        item.title?.toLowerCase().includes(query) ||
        item.content?.toLowerCase().includes(query)
    );
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: "Failed to search news" });
  }
});

module.exports = router;
