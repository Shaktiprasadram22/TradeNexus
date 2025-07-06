import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {
  TrendingUp,
  Layers,
  Activity,
  Newspaper,
  Brain,
  Search,
  Filter,
} from "lucide-react";
import axios from "axios";

// Import your feature components
import TrendingSectorsDisplay from "./components/TrendingSectorsDisplay";
import SectorDrilldown from "./components/SectorDrilldown";
import LivePriceSimulation from "./components/LivePriceSimulation";
import SmartFiltering from "./components/SmartFiltering";
import NewsFeedDisplay from "./components/NewsFeedDisplay";
import NewsWatchlist from "./components/NewsWatchlist";
import BuySellHoldAnalysis from "./components/BuySellHoldAnalysis";

// Placeholder component for Stock Deep Dive
const StockDeepDive = () => (
  <div className="text-white text-center mt-10">
    <h2 className="text-3xl font-bold mb-4">Stock Deep Dive</h2>
    <p>This feature is coming soon!</p>
  </div>
);

const FeatureButtonsPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      name: "Trending Sector Stocks",
      icon: TrendingUp,
      description: "Discover the hottest performing stocks by sector",
      color: "from-blue-500 to-blue-600",
      path: "/trending-sectors",
    },
    {
      id: 2,
      name: "Sector Drilldown",
      icon: Layers,
      description: "Deep dive into specific market sectors",
      color: "from-emerald-500 to-emerald-600",
      path: "/sector-drilldown",
    },
    {
      id: 3,
      name: "Live Price Simulation",
      icon: Activity,
      description: "Real-time market price tracking and simulation",
      color: "from-purple-500 to-purple-600",
      path: "/live-prices",
    },
    {
      id: 4,
      name: "News Section with Search",
      icon: Newspaper,
      description: "Stay informed with searchable financial news",
      color: "from-orange-500 to-orange-600",
      path: "/news",
    },
    {
      id: 5,
      name: "Buy/Sell/Hold AI Analysis",
      icon: Brain,
      description: "AI-powered investment recommendations",
      color: "from-pink-500 to-pink-600",
      path: "/ai-analysis",
    },

    {
      id: 7,
      name: "Smart Filtering and Discovery",
      icon: Filter,
      description: "Advanced tools to find your perfect investments",
      color: "from-indigo-500 to-indigo-600",
      path: "/smart-filter",
    },
    {
      id: 8,
      name: "News Watchlist",
      icon: Newspaper,
      description: "Your saved news & batch analysis",
      color: "from-yellow-500 to-yellow-600",
      path: "/news-watchlist",
    },
  ];

  const handleFeatureClick = (featurePath) => {
    navigate(featurePath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 font-inter text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-emerald-600/20"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Trade<span className="text-emerald-400">Nexus</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl text-blue-100 font-light">
              Professional Trading Features
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 rounded-lg"
                onClick={() => handleFeatureClick(feature.path)}
              >
                <div className="p-6 text-center">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                    {feature.name}
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex justify-center">
                    <div
                      className={`w-0 group-hover:w-12 h-0.5 bg-gradient-to-r ${feature.color} transition-all duration-300`}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-blue-100 mb-6">
              Access professional-grade tools and AI-powered insights to make
              smarter investment decisions.
            </p>
            <button className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Get Started Today
            </button>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

const App = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [analyzeResult, setAnalyzeResult] = useState({});
  const [analyzeAllResult, setAnalyzeAllResult] = useState("");

  const SERVER_URL =
    process.env.REACT_APP_SERVER_URL || "http://localhost:5001";
  const RAG_SERVER_URL =
    process.env.REACT_APP_RAG_SERVER_URL || "http://localhost:8000";

  const handleAddToWatchlist = (newsItem) => {
    const isAlreadyInWatchlist = watchlist.some(
      (item) => item.id === newsItem.id
    );
    if (!isAlreadyInWatchlist) {
      setWatchlist((prev) => [...prev, newsItem]);
      console.log(`Added "${newsItem.title}" to watchlist`);
    } else {
      console.log(`"${newsItem.title}" is already in watchlist`);
    }
  };

  const handleRemoveFromWatchlist = (newsItem) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== newsItem.id));
    console.log(`Removed "${newsItem.title}" from watchlist`);
  };

  // The key fix: pass uniqueKey to the handler
  const handleAnalyze = async (newsItem, uniqueKey) => {
    setAnalyzeResult((prev) => ({ ...prev, [uniqueKey]: "Analyzing..." }));
    try {
      const res = await axios.post(`${RAG_SERVER_URL}/rag/news-analyze`, {
        query: `${newsItem.title}\n${newsItem.content}`,
      });
      setAnalyzeResult((prev) => ({
        ...prev,
        [uniqueKey]: res.data.analysis,
      }));
    } catch (error) {
      setAnalyzeResult((prev) => ({
        ...prev,
        [uniqueKey]: "Analysis failed.",
      }));
    }
  };

  const handleAnalyzeAll = async () => {
    if (watchlist.length === 0) {
      setAnalyzeAllResult("No news items in watchlist to analyze.");
      return;
    }

    setAnalyzeAllResult("Analyzing all news...");

    try {
      const combinedText = watchlist
        .map((item) => `${item.title}: ${item.content}`)
        .join("\n\n");

      const response = await axios.post(`${RAG_SERVER_URL}/rag/news-analyze`, {
        query: `Analyze the following news items and provide an overall investment recommendation: ${combinedText}`,
      });

      setAnalyzeAllResult(response.data.analysis);
    } catch (error) {
      console.error("Batch analysis failed:", error);
      setAnalyzeAllResult("Batch analysis failed. Please try again.");
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FeatureButtonsPage />} />
        <Route path="/trending-sectors" element={<TrendingSectorsDisplay />} />
        <Route path="/sector-drilldown" element={<SectorDrilldown />} />
        <Route path="/live-prices" element={<LivePriceSimulation />} />
        <Route
          path="/news"
          element={
            <NewsFeedDisplay
              onAddToWatchlist={handleAddToWatchlist}
              onAnalyze={handleAnalyze}
              analyzeResult={analyzeResult}
            />
          }
        />
        <Route
          path="/news-watchlist"
          element={
            <NewsWatchlist
              watchlist={watchlist}
              onAnalyzeAll={handleAnalyzeAll}
              onRemove={handleRemoveFromWatchlist}
              analyzeAllResult={analyzeAllResult}
            />
          }
        />
        <Route path="/ai-analysis" element={<BuySellHoldAnalysis />} />
        <Route path="/stock-deep-dive" element={<StockDeepDive />} />
        <Route path="/smart-filter" element={<SmartFiltering />} />
      </Routes>
    </Router>
  );
};

export default App;
