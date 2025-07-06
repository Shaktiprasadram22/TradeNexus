// Client/src/components/BuySellHoldAnalysis.jsx

import React, { useState } from "react";
import axios from "axios";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Target,
  Volume2,
} from "lucide-react";

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
      // Fetch stock details (volume, support/resistance, price, etc.)
      const response = await axios.get(
        `${SERVER_URL}/api/stocks/${searchQuery.toUpperCase()}/details`
      );
      setStockData(response.data);
    } catch (error) {
      setError(`Stock "${searchQuery}" not found or API error.`);
    } finally {
      setLoading(false);
    }
  };

  // Analyze stock using AI
  const handleAnalyze = async () => {
    if (!stockData) return;

    setAnalyzing(true);
    setError("");

    try {
      // Fetch stock-related news
      const newsResponse = await axios.get(
        `${SERVER_URL}/api/stocks/${stockData.symbol}/news`
      );

      // Combine stock data + news for AI analysis
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
${newsResponse.data
  .map((news) => `- ${news.title}: ${news.content}`)
  .join("\n")}

Provide a BUY/SELL/HOLD recommendation with bullet-point reasons.`,
      };

      const aiResponse = await axios.post(
        `${RAG_SERVER_URL}/rag/stock-analyze`,
        analysisPayload
      );
      setAnalysisResult(aiResponse.data.analysis);
    } catch (error) {
      setError("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  // Get recommendation color and icon
  const getRecommendationStyle = (analysis) => {
    if (analysis.toLowerCase().includes("buy")) {
      return {
        color: "text-green-400",
        bg: "bg-green-900/30",
        border: "border-green-500",
        icon: TrendingUp,
      };
    } else if (analysis.toLowerCase().includes("sell")) {
      return {
        color: "text-red-400",
        bg: "bg-red-900/30",
        border: "border-red-500",
        icon: TrendingDown,
      };
    } else {
      return {
        color: "text-yellow-400",
        bg: "bg-yellow-900/30",
        border: "border-yellow-500",
        icon: Minus,
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-emerald-400 mb-4">
          Buy/Sell/Hold AI Analysis
        </h1>
        <p className="text-blue-100 text-lg">
          Get AI-powered investment recommendations based on technical analysis
          and news sentiment
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4 justify-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter stock symbol (e.g., RELIANCE, TCS, INFY)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Stock Details Display */}
        {stockData && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-300">
                  {stockData.symbol}
                </h2>
                <p className="text-gray-400">{stockData.companyName}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  ₹{stockData.currentPrice}
                </div>
                <div
                  className={`text-sm ${
                    stockData.change >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stockData.change >= 0 ? "+" : ""}
                  {stockData.change} ({stockData.changePercent}%)
                </div>
              </div>
            </div>

            {/* Stock Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-900/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-semibold">Volume</span>
                </div>
                <div className="text-white text-lg">
                  {stockData.volume?.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">
                  Avg: {stockData.avgVolume?.toLocaleString()}
                </div>
              </div>

              <div className="bg-green-900/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-semibold">Support</span>
                </div>
                <div className="text-white text-lg">₹{stockData.support}</div>
                <div className="text-gray-400 text-sm">Strong level</div>
              </div>

              <div className="bg-red-900/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 font-semibold">Resistance</span>
                </div>
                <div className="text-white text-lg">
                  ₹{stockData.resistance}
                </div>
                <div className="text-gray-400 text-sm">Key barrier</div>
              </div>
            </div>

            {/* 52 Week Range */}
            <div className="bg-purple-900/30 rounded-lg p-4 mb-6">
              <h3 className="text-purple-300 font-semibold mb-2">
                52 Week Range
              </h3>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-400">Low: </span>
                  <span className="text-white font-semibold">
                    ₹{stockData.low52w}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">High: </span>
                  <span className="text-white font-semibold">
                    ₹{stockData.high52w}
                  </span>
                </div>
              </div>
            </div>

            {/* Analyze Button */}
            <div className="text-center">
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 disabled:opacity-50 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all transform hover:scale-105"
              >
                {analyzing ? "Analyzing..." : "🤖 Analyze with AI"}
              </button>
            </div>
          </div>
        )}

        {/* AI Analysis Result */}
        {analysisResult && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
              <span>🤖</span> AI Analysis Result
            </h3>

            {(() => {
              const style = getRecommendationStyle(analysisResult);
              const IconComponent = style.icon;

              return (
                <div
                  className={`${style.bg} ${style.border} border rounded-lg p-4`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className={`w-6 h-6 ${style.color}`} />
                    <span className={`text-xl font-bold ${style.color}`}>
                      {analysisResult.split("\n")[0]}
                    </span>
                  </div>

                  <div className="text-gray-200 whitespace-pre-line">
                    {analysisResult.split("\n").slice(1).join("\n")}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuySellHoldAnalysis;
