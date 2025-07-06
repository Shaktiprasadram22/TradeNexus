// TradeNexus/Server/feature2_sectorDrilldown.js

const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_BASE =
  process.env.SENTINEL_API_BASE_URL ||
  "https://sentineldatacore.netlify.app/api";

// GET /api/sector-drilldown/:sectorName
router.get("/sector-drilldown/:sectorName", async (req, res) => {
  try {
    const { sectorName } = req.params;
    const response = await axios.get(`${API_BASE}/stocks`);
    const allStocks = response.data || [];
    // Exact match for sector name
    const sectorStocks = allStocks.filter(
      (stock) => stock.sector === sectorName
    );
    if (sectorStocks.length === 0) {
      return res
        .status(404)
        .json({ message: "No stocks found for this sector." });
    }
    res.json(sectorStocks);
  } catch (err) {
    console.error("Error in /api/sector-drilldown/:sectorName:", err.message);
    res.status(500).json({ message: "Failed to fetch sector stocks" });
  }
});

module.exports = router;
