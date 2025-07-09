import React, { useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaChartBar,
  FaBullseye,
  FaChartArea,
} from "react-icons/fa";

// Inject Orbitron font and futuristic neon CSS theme
if (typeof document !== "undefined") {
  const font = document.createElement("link");
  font.href =
    "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600&display=swap";
  font.rel = "stylesheet";
  document.head.appendChild(font);

  const style = document.createElement("style");
  style.textContent = `
    :root {
      --primary-bg: #0b0f18;
      --secondary-bg: #1a1f2d;
      --header-bg: linear-gradient(90deg, #0d0338, #2e0064, #7b00ff);
      --highlight-color: #00f0ff;
      --button-gradient: linear-gradient(90deg, #7200ca, #00f0ff);
      --alert-gradient: linear-gradient(90deg, #ff2e63, #ff00a6);
      --text-color: #e0e0e0;
      --transition-duration: 0.4s;
      --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
      --easing-emphasized: cubic-bezier(0.2, 0.6, 0.2, 1);
      --border-radius: 12px;
      --box-shadow: 0px 0px 12px rgba(0, 255, 255, 0.6);
      --neon-glow: 0px 0px 20px rgba(0, 255, 255, 0.8);
      --pulse-glow: 0px 0px 25px rgba(0, 255, 255, 1),
        0px 0px 35px rgba(255, 0, 255, 1);
    }

    body {
      font-family: "Orbitron", sans-serif;
      color: var(--text-color);
      background: linear-gradient(
        135deg,
        #0b0f18 20%,
        #1f002e 40%,
        #001e32 70%,
        #0d0338 100%
      );
      background-size: 400% 400%;
      animation: gradientShift 8s ease infinite;
      overflow-x: hidden;
      margin: 0;
      padding: 0;
    }

    @keyframes gradientShift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    .bsha-container {
      min-height: 100vh;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .bsha-header {
      background: var(--header-bg);
      color: var(--highlight-color);
      padding: 2rem;
      text-align: center;
      box-shadow: var(--neon-glow);
      border-radius: var(--border-radius);
      text-shadow: 0px 0px 6px rgba(0, 255, 255, 0.8);
      animation: headerGlow 5s ease-in-out infinite alternate;
      margin-bottom: 3rem;
    }

    @keyframes headerGlow {
      from {
        text-shadow: 0px 0px 6px rgba(0, 255, 255, 0.8),
          0px 0px 20px rgba(255, 0, 255, 0.6);
      }
      to {
        text-shadow: 0px 0px 12px rgba(0, 255, 255, 1),
          0px 0px 30px rgba(255, 0, 255, 1);
      }
    }

    .bsha-title {
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--highlight-color);
      margin-bottom: 1rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      animation: neonText 2s ease-in-out infinite alternate;
    }

    @keyframes neonText {
      from {
        text-shadow: 0px 0px 10px rgba(0, 255, 255, 0.7),
          0px 0px 20px rgba(255, 0, 255, 0.5);
      }
      to {
        text-shadow: 0px 0px 15px rgba(0, 255, 255, 1),
          0px 0px 30px rgba(255, 0, 255, 1);
      }
    }

    .bsha-desc {
      color: var(--text-color);
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .bsha-search-section {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 15px;
      margin: 20px auto;
      padding: 20px;
      background: rgba(30, 30, 50, 0.9);
      border-radius: var(--border-radius);
      box-shadow: var(--neon-glow);
      max-width: 600px;
      animation: pulseBackground 4s ease-in-out infinite alternate;
      margin-bottom: 3rem;
    }

    @keyframes pulseBackground {
      0% {
        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }
      100% {
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
      }
    }

    .bsha-search-box {
      position: relative;
      flex: 1;
    }

    .bsha-search-input {
      width: 100%;
      padding: 12px 12px 12px 45px;
      font-size: 1rem;
      color: var(--highlight-color);
      background-color: #1b1b2f;
      border: 1px solid #7b00ff;
      border-radius: var(--border-radius);
      box-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
      transition: box-shadow 0.3s ease, transform 0.3s ease;
      font-family: "Orbitron", sans-serif;
    }

    .bsha-search-input::placeholder {
      color: #555a75;
    }

    .bsha-search-input:focus {
      box-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
      outline: none;
      transform: scale(1.02);
    }

    .bsha-search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--highlight-color);
      font-size: 1.1rem;
    }

    .bsha-search-btn {
      background: var(--button-gradient);
      color: #fff;
      font-weight: bold;
      padding: 12px 25px;
      font-size: 1rem;
      border-radius: var(--border-radius);
      cursor: pointer;
      border: none;
      transition: background-color 0.4s, transform 0.3s, box-shadow 0.3s;
      box-shadow: var(--neon-glow);
      font-family: "Orbitron", sans-serif;
    }

    .bsha-search-btn:hover:not(:disabled) {
      background-color: #005a5a;
      transform: translateY(-3px) scale(1.05);
      box-shadow: var(--pulse-glow);
    }

    .bsha-search-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .bsha-error {
      background: rgba(255, 46, 99, 0.15);
      border: 1px solid var(--alert-gradient);
      border-radius: var(--border-radius);
      color: #ff2e63;
      padding: 1rem;
      margin-bottom: 2rem;
      text-align: center;
      box-shadow: 0 0 10px rgba(255, 46, 99, 0.3);
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .bsha-card {
      margin: 20px auto;
      padding: 25px;
      background: rgba(25, 25, 60, 0.95);
      border-radius: var(--border-radius);
      box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
      transition: transform 0.4s var(--easing-standard),
        box-shadow 0.4s var(--easing-standard);
      animation: sectionPulse 3s ease-in-out infinite alternate;
      max-width: 800px;
    }

    @keyframes sectionPulse {
      0% {
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
      }
      100% {
        box-shadow: 0 0 25px rgba(0, 255, 255, 1);
      }
    }

    .bsha-card:hover {
      transform: scale(1.02);
      box-shadow: 0 0 20px rgba(0, 255, 255, 0.7);
    }

    .bsha-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid var(--highlight-color);
    }

    .bsha-stock-symbol {
      font-size: 2rem;
      font-weight: 700;
      color: var(--highlight-color);
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
      animation: neonText 2s ease-in-out infinite alternate;
    }

    .bsha-company {
      color: var(--text-color);
      font-size: 1rem;
      opacity: 0.8;
      margin-top: 0.5rem;
    }

    .bsha-price {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-color);
      text-align: right;
    }

    .bsha-change {
      font-size: 1rem;
      font-weight: 500;
      text-align: right;
      margin-top: 0.5rem;
    }

    .bsha-change.positive {
      color: #4caf50;
    }

    .bsha-change.negative {
      color: #ff5c5c;
    }

    .bsha-metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .bsha-metric {
      background: rgba(62, 207, 142, 0.1);
      border-radius: var(--border-radius);
      padding: 1.5rem;
      border: 1px solid rgba(62, 207, 142, 0.3);
      box-shadow: 0 0 10px rgba(62, 207, 142, 0.2);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .bsha-metric:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 15px rgba(62, 207, 142, 0.4);
    }

    .bsha-metric-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      color: var(--highlight-color);
      margin-bottom: 0.75rem;
      text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
    }

    .bsha-metric-value {
      color: var(--text-color);
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .bsha-metric-desc {
      color: var(--text-color);
      font-size: 0.9rem;
      opacity: 0.7;
    }

    .bsha-range-card {
      background: rgba(128, 90, 213, 0.15);
      border-radius: var(--border-radius);
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid rgba(128, 90, 213, 0.3);
      box-shadow: 0 0 10px rgba(128, 90, 213, 0.2);
    }

    .bsha-range-title {
      color: var(--highlight-color);
      font-weight: 600;
      margin-bottom: 1rem;
      text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
      font-size: 1.1rem;
    }

    .bsha-range-values {
      display: flex;
      justify-content: space-between;
    }

    .bsha-analyze-btn {
      background: var(--button-gradient);
      color: #fff;
      font-weight: bold;
      padding: 15px 30px;
      font-size: 1.1rem;
      border-radius: var(--border-radius);
      cursor: pointer;
      border: none;
      box-shadow: var(--neon-glow);
      transition: all 0.3s ease;
      font-family: "Orbitron", sans-serif;
      margin-top: 1.5rem;
    }

    .bsha-analyze-btn:hover:not(:disabled) {
      background-color: #005a5a;
      transform: translateY(-3px) scale(1.05);
      box-shadow: var(--pulse-glow);
    }

    .bsha-analyze-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .bsha-analysis-result {
      margin: 20px auto;
      padding: 25px;
      background: rgba(25, 25, 60, 0.95);
      border-radius: var(--border-radius);
      box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
      animation: sectionPulse 3s ease-in-out infinite alternate;
      max-width: 800px;
    }

    .bsha-analysis-header {
      font-weight: 700;
      color: var(--highlight-color);
      margin-bottom: 1.5rem;
      fontSize: "1.3rem";
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .bsha-recommendation {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      text-shadow: 0 0 10px currentColor;
    }

    .bsha-recommendation.buy {
      color: #4caf50;
    }

    .bsha-recommendation.sell {
      color: #ff5c5c;
    }

    .bsha-recommendation.hold {
      color: #ffd700;
    }

    .bsha-reason-list {
      color: var(--text-color);
      white-space: pre-line;
      line-height: 1.6;
      font-size: 1rem;
    }

    @media (max-width: 768px) {
      .bsha-container {
        padding: 1rem;
      }

      .bsha-title {
        font-size: 2rem;
      }

      .bsha-card,
      .bsha-analysis-result {
        padding: 1.5rem;
      }

      .bsha-metrics-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .bsha-card-header {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }

      .bsha-price {
        text-align: center;
      }
    }
  `;
  document.head.appendChild(style);
}

const BuySellHoldAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stockData, setStockData] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const SERVER_URL =
    process.env.REACT_APP_SERVER_URL || "http://localhost:5001";
  const RAG_SERVER_URL =
    process.env.REACT_APP_RAG_SERVER_URL || "http://localhost:8000";

  // Search for stock and fetch details
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");
    setStockData(null);
    setAnalysisResult(null);

    try {
      const response = await axios.get(
        `${SERVER_URL}/api/stocks/${searchQuery.toUpperCase()}/details`
      );
      setStockData(response.data);
    } catch (error) {
      console.error("Search error:", error);
      setError(`Stock "${searchQuery}" not found or API error.`);
    } finally {
      setLoading(false);
    }
  };

  // Analyze stock using AI - FIXED VERSION
  const handleAnalyze = async () => {
    if (!stockData) return;

    setAnalyzing(true);
    setError("");

    try {
      console.log("🔄 Starting analysis for:", stockData.symbol);
      console.log("📊 RAG Server URL:", RAG_SERVER_URL);

      // Fetch news data first
      const newsResponse = await axios.get(
        `${SERVER_URL}/api/stocks/${stockData.symbol}/news`
      );
      console.log("📰 News response structure:", newsResponse.data);

      // Handle different possible news data structures
      let newsArray = [];
      if (Array.isArray(newsResponse.data)) {
        newsArray = newsResponse.data;
      } else if (
        newsResponse.data.news &&
        Array.isArray(newsResponse.data.news)
      ) {
        newsArray = newsResponse.data.news;
      } else if (
        newsResponse.data.articles &&
        Array.isArray(newsResponse.data.articles)
      ) {
        newsArray = newsResponse.data.articles;
      } else {
        console.warn("News data is not in expected format:", newsResponse.data);
        newsArray = [];
      }

      // Prepare analysis payload
      const analysisPayload = {
        query: `Analyze ${stockData.symbol} stock:
Stock Details:
- Current Price: ₹${stockData.currentPrice}
- Volume: ${stockData.volume} (Avg: ${stockData.avgVolume})
- Support Level: ₹${stockData.support}
- Resistance Level: ₹${stockData.resistance}
- 52W High: ₹${stockData.high52w}
- 52W Low: ₹${stockData.low52w}

Recent News:
${
  newsArray.length > 0
    ? newsArray
        .map(
          (news) =>
            `- ${news.title || news.headline}: ${
              news.content || news.summary || news.description
            }`
        )
        .join("\n")
    : "No recent news available"
}

Provide a BUY/SELL/HOLD recommendation with bullet-point reasons.`,
      };

      console.log(
        "📤 Sending analysis request to:",
        `${RAG_SERVER_URL}/rag/stock-analyze`
      );
      console.log("📦 Payload:", analysisPayload);

      // Send to RAG server for AI analysis
      const aiResponse = await axios.post(
        `${RAG_SERVER_URL}/rag/stock-analyze`,
        analysisPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      console.log("✅ Analysis response received:", aiResponse.data);
      setAnalysisResult(aiResponse.data.analysis);
    } catch (error) {
      console.error("❌ Analysis error details:");
      console.error("Full error object:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      console.error("Request URL:", `${RAG_SERVER_URL}/rag/stock-analyze`);

      // Enhanced error handling
      if (error.response?.data?.detail) {
        setError(`Analysis failed: ${error.response.data.detail}`);
      } else if (error.code === "ECONNREFUSED") {
        setError(
          "Cannot connect to AI analysis server. Please ensure the Python RAG server is running on port 8000."
        );
      } else if (error.response?.status === 404) {
        setError(
          "Analysis endpoint not found. Please check if the RAG server is properly configured."
        );
      } else if (error.response?.status === 500) {
        setError(
          "Internal server error during analysis. Please check the server logs."
        );
      } else if (error.message.includes("timeout")) {
        setError("Analysis request timed out. Please try again.");
      } else if (error.message.includes("Network Error")) {
        setError(
          "Network error: Unable to reach the analysis server. Check your connection and server status."
        );
      } else {
        setError(`Analysis failed: ${error.message}`);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  // Get recommendation color and icon
  const getRecommendationStyle = (analysis) => {
    const text = analysis.toLowerCase();
    if (text.includes("buy")) {
      return {
        className: "bsha-recommendation buy",
        icon: <FaArrowUp />,
      };
    } else if (text.includes("sell")) {
      return {
        className: "bsha-recommendation sell",
        icon: <FaArrowDown />,
      };
    } else {
      return {
        className: "bsha-recommendation hold",
        icon: <FaMinus />,
      };
    }
  };

  return (
    <div className="bsha-container">
      <div className="bsha-header">
        <h1 className="bsha-title">Buy/Sell/Hold Analysis</h1>
        <p className="bsha-desc">
          AI-powered stock analysis with technical indicators and news sentiment
        </p>
      </div>

      {/* Search Section */}
      <form onSubmit={handleSearch} className="bsha-search-section">
        <div className="bsha-search-box">
          <FaSearch className="bsha-search-icon" />
          <input
            type="text"
            className="bsha-search-input"
            placeholder="Enter stock symbol (e.g., RELIANCE, TCS, INFY)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bsha-search-btn"
          disabled={loading || !searchQuery.trim()}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Error Display */}
      {error && <div className="bsha-error">{error}</div>}

      {/* Stock Data Display */}
      {stockData && (
        <div className="bsha-card">
          <div className="bsha-card-header">
            <div>
              <div className="bsha-stock-symbol">{stockData.symbol}</div>
              <div className="bsha-company">{stockData.companyName}</div>
            </div>
            <div>
              <div className="bsha-price">₹{stockData.currentPrice}</div>
              <div
                className={`bsha-change ${
                  stockData.change >= 0 ? "positive" : "negative"
                }`}
              >
                {stockData.change >= 0 ? "+" : ""}
                {stockData.change} ({stockData.changePercent}%)
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="bsha-metrics-grid">
            <div className="bsha-metric">
              <div className="bsha-metric-title">
                <FaChartBar />
                Volume
              </div>
              <div className="bsha-metric-value">
                {stockData.volume?.toLocaleString()}
              </div>
              <div className="bsha-metric-desc">
                Avg: {stockData.avgVolume?.toLocaleString()}
              </div>
            </div>

            <div className="bsha-metric">
              <div className="bsha-metric-title">
                <FaBullseye />
                Support
              </div>
              <div className="bsha-metric-value">₹{stockData.support}</div>
              <div className="bsha-metric-desc">Key support level</div>
            </div>

            <div className="bsha-metric">
              <div className="bsha-metric-title">
                <FaChartArea />
                Resistance
              </div>
              <div className="bsha-metric-value">₹{stockData.resistance}</div>
              <div className="bsha-metric-desc">Key resistance level</div>
            </div>
          </div>

          {/* 52-Week Range */}
          <div className="bsha-range-card">
            <div className="bsha-range-title">52-Week Range</div>
            <div className="bsha-range-values">
              <span>Low: ₹{stockData.low52w}</span>
              <span>High: ₹{stockData.high52w}</span>
            </div>
          </div>

          {/* Analyze Button */}
          <button
            className="bsha-analyze-btn"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing ? "Analyzing..." : "Analyze with AI"}
          </button>
        </div>
      )}

      {/* Analysis Result */}
      {analysisResult && (
        <div className="bsha-analysis-result">
          <div className="bsha-analysis-header">
            <FaChartArea />
            AI Analysis Result
          </div>
          <div className={getRecommendationStyle(analysisResult).className}>
            {getRecommendationStyle(analysisResult).icon}
            {analysisResult.includes("BUY")
              ? "BUY"
              : analysisResult.includes("SELL")
              ? "SELL"
              : "HOLD"}
          </div>
          <div className="bsha-reason-list">{analysisResult}</div>
        </div>
      )}
    </div>
  );
};

export default BuySellHoldAnalysis;
