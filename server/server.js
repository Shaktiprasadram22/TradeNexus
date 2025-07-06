// TradeNexus/Server/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");

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

// Mount all feature routers on /api
app.use("/api", trendingSectorsRouter);
app.use("/api", sectorDrilldownRouter);
app.use("/api", livePriceAlertsRouter);
app.use("/api", smartFilteringRouter);
app.use("/api", newsRouter); // <-- Mount news router
app.use("/api", stockDetailsRouter); //

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
