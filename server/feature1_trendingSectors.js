// TradeNexus/Server/feature1_trendingSectors.js

const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_BASE =
  process.env.SENTINEL_API_BASE_URL ||
  "https://sentineldatacore.netlify.app/api";

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Feature 1 (Trending Sectors) API is running",
  });
});

// GET /api/stocks
router.get("/stocks", async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE}/stocks`);
    res.json(response.data);
  } catch (err) {
    console.error("Error in /api/stocks:", err.message);
    res.status(500).json({ message: "Failed to fetch stocks" });
  }
});

// GET /api/trending-sectors?sortBy=volume|price
router.get("/trending-sectors", async (req, res) => {
  try {
    const sortBy = req.query.sortBy === "price" ? "price" : "volume";
    const response = await axios.get(`${API_BASE}/stocks`);
    const stocks = response.data;

    // Group by sector and calculate averages
    const sectorMap = {};
    for (const stock of stocks) {
      if (!sectorMap[stock.sector]) {
        sectorMap[stock.sector] = { stocks: [], totalVolume: 0, totalPrice: 0 };
      }
      sectorMap[stock.sector].stocks.push(stock);
      sectorMap[stock.sector].totalVolume += Number(stock.volume) || 0;
      sectorMap[stock.sector].totalPrice += Number(stock.lastPrice) || 0;
    }

    const trendingSectors = Object.entries(sectorMap).map(([name, data]) => ({
      name,
      averageVolume: data.stocks.length
        ? data.totalVolume / data.stocks.length
        : 0,
      averagePrice: data.stocks.length
        ? data.totalPrice / data.stocks.length
        : 0,
      stockCount: data.stocks.length,
    }));

    trendingSectors.sort((a, b) =>
      sortBy === "price"
        ? b.averagePrice - a.averagePrice
        : b.averageVolume - a.averageVolume
    );

    res.json(trendingSectors);
  } catch (err) {
    console.error("Error in /api/trending-sectors:", err.message);
    res.status(500).json({ message: "Failed to fetch trending sectors" });
  }
});

// GET /api/sectors/:sectorName/stocks
router.get("/sectors/:sectorName/stocks", async (req, res) => {
  try {
    const { sectorName } = req.params;
    const response = await axios.get(`${API_BASE}/stocks`);
    const stocks = response.data.filter((stock) => stock.sector === sectorName);
    if (stocks.length === 0) {
      return res
        .status(404)
        .json({ message: "Sector not found or no stocks available." });
    }
    res.json(stocks);
  } catch (err) {
    console.error(
      `Error in /api/sectors/${req.params.sectorName}/stocks:`,
      err.message
    );
    res.status(500).json({ message: "Failed to fetch sector stocks" });
  }
});

module.exports = router;
