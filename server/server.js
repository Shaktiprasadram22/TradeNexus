require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { LRUCache } = require("lru-cache");

// Import all feature routers
const trendingSectorsRouter = require("./feature1_trendingSectors");
const sectorDrilldownRouter = require("./feature2_sectorDrilldown");
const livePriceAlertsRouter = require("./feature3_livePriceAlerts");
const smartFilteringRouter = require("./feature4_smartFiltering");
const newsRouter = require("./feature5_news"); // <-- News API feature
const stockDetailsRouter = require("./feature6_stock_details");

const app = express();
app.use(cors());
app.use(express.json());

// Configure LRU cache (adjust max and ttl as needed)
const cache = new LRUCache({
  max: 100, // Maximum number of items in cache
  ttl: 1000 * 60 * 5, // 5 minutes TTL (time-to-live) for each cache entry
});

// LRU cache middleware for GET requests on /api routes
function cacheMiddleware(req, res, next) {
  if (req.method !== "GET") return next();

  const key = req.originalUrl;
  if (cache.has(key)) {
    return res.json(cache.get(key));
  }

  // Monkey-patch res.json to store the response in cache
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, body);
    originalJson(body);
  };

  next();
}

// Apply cache middleware to all /api routes
app.use("/api", cacheMiddleware);

// Mount all feature routers on /api
app.use("/api", trendingSectorsRouter);
app.use("/api", sectorDrilldownRouter);
app.use("/api", livePriceAlertsRouter);
app.use("/api", smartFilteringRouter);
app.use("/api", newsRouter);
app.use("/api", stockDetailsRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "TradeNexus API server is running" });
});

// Fallback route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`TradeNexus backend running on port ${PORT}`);
});
