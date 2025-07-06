// TradeNexus/Server/feature4_smartFiltering.js

const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_BASE =
  process.env.SENTINEL_API_BASE_URL ||
  "https://sentineldatacore.netlify.app/api";

// Helper: is price near a level (within percent)
function isNearLevel(price, level, percent = 2) {
  if (!price || !level) return false;
  return Math.abs(price - level) / level <= percent / 100;
}

// GET /api/smart-filter?sector=...&minPrice=...&maxPrice=...&minVolume=...&near=support|resistance
router.get("/smart-filter", async (req, res) => {
  try {
    const { sector, minPrice, maxPrice, minVolume, near } = req.query;
    const response = await axios.get(`${API_BASE}/stocks`);
    let stocks = response.data;

    // Filter by sector
    if (sector) {
      stocks = stocks.filter((s) => s.sector === sector);
    }
    // Filter by price range
    if (minPrice) {
      stocks = stocks.filter((s) => Number(s.lastPrice) >= Number(minPrice));
    }
    if (maxPrice) {
      stocks = stocks.filter((s) => Number(s.lastPrice) <= Number(maxPrice));
    }
    // Filter by volume
    if (minVolume) {
      stocks = stocks.filter((s) => Number(s.volume) >= Number(minVolume));
    }
    // Filter by near support/resistance
    if (near === "support") {
      stocks = stocks.filter((s) => isNearLevel(s.lastPrice, s.support, 2));
    } else if (near === "resistance") {
      stocks = stocks.filter((s) => isNearLevel(s.lastPrice, s.resistance, 2));
    }

    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: "Failed to filter stocks" });
  }
});

module.exports = router;
