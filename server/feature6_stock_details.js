// Server/feature6_stock_details.js

const express = require("express");
const axios = require("axios");
const router = express.Router();

const SENTINEL_API_BASE =
  process.env.SENTINEL_API_URL || "https://sentineldatacore.netlify.app/api";

async function callSentinelAPI(endpoint) {
  try {
    const url = `${SENTINEL_API_BASE}${endpoint}`;
    console.log(`Calling: ${url}`);

    const response = await axios.get(url, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    throw new Error(`Failed to fetch: ${error.message}`);
  }
}

// Helper function to format stock symbol for SentinelDataCore API
function formatStockSymbol(symbol) {
  const upperSymbol = symbol.toUpperCase();
  // Check if .NS is already present
  if (upperSymbol.endsWith(".NS")) {
    return upperSymbol;
  }
  // Add .NS to the symbol
  return `${upperSymbol}.NS`;
}

// GET /api/stocks/:symbol/details
router.get("/stocks/:symbol/details", async (req, res) => {
  try {
    const inputSymbol = req.params.symbol;
    const formattedSymbol = formatStockSymbol(inputSymbol);

    console.log(`Input: "${inputSymbol}" → Formatted: "${formattedSymbol}"`);

    const stockData = await callSentinelAPI(`/stocks/${formattedSymbol}`);

    res.json({
      ...stockData,
      originalSymbol: inputSymbol.toUpperCase(),
      apiSymbol: formattedSymbol,
      dataSource: "SentinelDataCore",
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch stock details",
      message: error.message,
    });
  }
});

// GET /api/stocks/:symbol/news
router.get("/stocks/:symbol/news", async (req, res) => {
  try {
    const inputSymbol = req.params.symbol;
    const formattedSymbol = formatStockSymbol(inputSymbol);

    console.log(
      `News Input: "${inputSymbol}" → Formatted: "${formattedSymbol}"`
    );

    const newsData = await callSentinelAPI(`/news/related/${formattedSymbol}`);

    res.json({
      ...newsData,
      requestedSymbol: inputSymbol.toUpperCase(),
      apiSymbol: formattedSymbol,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch news",
      message: error.message,
    });
  }
});

// GET /api/stocks/search - Search with .NS formatting
router.get("/stocks/search", async (req, res) => {
  try {
    const query = req.query.q || "";

    if (!query) {
      return res.status(400).json({
        error: "Missing query parameter",
        message: "Please provide a search query using ?q=symbol",
      });
    }

    // Get all stocks and filter
    const allStocks = await callSentinelAPI("/stocks");

    const results = allStocks.filter(
      (stock) =>
        stock.symbol?.toLowerCase().includes(query.toLowerCase()) ||
        stock.name?.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      query,
      results,
      count: results.length,
      dataSource: "SentinelDataCore",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to search stocks",
      message: error.message,
    });
  }
});

module.exports = router;
