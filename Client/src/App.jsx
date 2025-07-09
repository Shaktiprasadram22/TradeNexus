import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {
  FaChartLine,
  FaLayerGroup,
  FaBolt,
  FaNewspaper,
  FaBrain,
  FaFilter,
  FaRegNewspaper,
} from "react-icons/fa";
import axios from "axios";
import "./App.css";

// Import your feature components
import TrendingSectorsDisplay from "./components/TrendingSectorsDisplay";
import SectorDrilldown from "./components/SectorDrilldown";
import LivePriceSimulation from "./components/LivePriceSimulation";
import SmartFiltering from "./components/SmartFiltering";
import NewsFeedDisplay from "./components/NewsFeedDisplay";
import NewsWatchlist from "./components/NewsWatchlist";
import BuySellHoldAnalysis from "./components/BuySellHoldAnalysis";

// Inject Orbitron font and futuristic neon CSS theme
if (typeof document !== "undefined") {
  const font = document.createElement("link");
  font.href =
    "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600&display=swap";
  font.rel = "stylesheet";
  document.head.appendChild(font);

  const style = document.createElement("style");
  style.innerHTML = `
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

@keyframes sectionPulse {
  0% {
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  }
  100% {
    box-shadow: 0 0 25px rgba(0, 255, 255, 1);
  }
}

/* Header and Navigation */
header {
  background: var(--header-bg);
  color: var(--highlight-color);
  padding: 1.5rem;
  text-align: center;
  box-shadow: var(--neon-glow);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  text-shadow: 0px 0px 6px rgba(0, 255, 255, 0.8);
  animation: headerGlow 5s ease-in-out infinite alternate;
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

header h1 {
  margin: 0;
  font-weight: 600;
  font-size: 2.5rem;
  letter-spacing: 2px;
  text-transform: uppercase;
}

nav a {
  color: var(--highlight-color);
  margin: 0 12px;
  text-decoration: none;
  transition: color 0.3s ease-in-out, transform 0.3s ease;
  position: relative;
}

nav a:hover {
  color: #ff007a;
  transform: translateY(-2px) scale(1.1);
  text-shadow: 0 0 5px #ff007a;
}

nav a::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: #ff007a;
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

nav a:hover::before {
  transform: scaleX(1);
  transform-origin: bottom left;
}

/* Hero Section Specific Styles */
.hero-section {
  text-align: center;
  padding: 60px 20px;
  margin: 20px;
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  animation: sectionPulse 3s ease-in-out infinite alternate;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 600;
  color: var(--highlight-color);
  margin-bottom: 1rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  animation: neonText 2s ease-in-out infinite alternate;
}

.hero-accent {
  color: #ff007a;
}

.hero-underline {
  width: 100px;
  height: 4px;
  background: var(--button-gradient);
  margin: 20px auto;
  border-radius: 2px;
  box-shadow: var(--neon-glow);
}

.hero-desc {
  font-size: 1.2rem;
  color: var(--text-color);
  margin-top: 1rem;
}

/* Features Container */
.features-container {
  margin: 20px;
  padding: 25px;
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  animation: sectionPulse 3s ease-in-out infinite alternate;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.feature-card {
  background: rgba(46, 46, 92, 0.9);
  border-radius: var(--border-radius);
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.4s var(--easing-standard),
    box-shadow 0.4s var(--easing-standard);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  border: 1px solid rgba(123, 0, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75px;
  width: 50px;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: skewX(-45deg);
  transition: left 0.5s ease;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card:hover {
  transform: scale(1.03);
  box-shadow: var(--pulse-glow);
}

.feature-icon {
  font-size: 3rem;
  color: var(--highlight-color);
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--highlight-color);
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.feature-desc {
  color: var(--text-color);
  font-size: 0.95rem;
  line-height: 1.4;
}

/* Call to Action Section */
.cta-section {
  text-align: center;
  padding: 50px 25px;
  margin: 20px;
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  animation: sectionPulse 3s ease-in-out infinite alternate;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--highlight-color);
  margin-bottom: 1rem;
  animation: neonText 2s ease-in-out infinite alternate;
}

.cta-desc {
  font-size: 1.1rem;
  color: var(--text-color);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-button {
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
}

.cta-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--pulse-glow);
}

/* Footer */
footer {
  text-align: center;
  padding: 1.5rem;
  background-color: #0a7373;
  color: white;
  font-weight: bold;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  transition: background-color 0.4s ease-in-out;
  animation: footerPulse 4s ease-in-out infinite alternate;
}

@keyframes footerPulse {
  0% {
    box-shadow: 0px 0px 15px rgba(0, 255, 255, 0.6);
  }
  100% {
    box-shadow: 0px 0px 20px rgba(0, 255, 255, 1);
  }
}

footer:hover {
  background-color: #005a5a;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
}
`;
  document.head.appendChild(style);
}

// Placeholder component for Stock Deep Dive
const StockDeepDive = () => (
  <section
    style={{
      margin: "20px",
      padding: "25px",
      background: "rgba(25, 25, 60, 0.95)",
      borderRadius: "var(--border-radius)",
      boxShadow: "0 0 15px rgba(0, 0, 255, 0.5)",
      textAlign: "center",
    }}
  >
    <h2
      style={{
        color: "var(--highlight-color)",
        fontSize: "2rem",
        letterSpacing: "2px",
        animation: "neonText 2s ease-in-out infinite alternate",
      }}
    >
      Stock Deep Dive
    </h2>
    <p style={{ color: "var(--text-color)" }}>This feature is coming soon!</p>
  </section>
);

const FeatureButtonsPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      name: "Trending Sector Stocks",
      icon: FaChartLine,
      description: "Discover the hottest performing stocks by sector",
      path: "/trending-sectors",
    },
    {
      id: 2,
      name: "Sector Drilldown",
      icon: FaLayerGroup,
      description: "Deep dive into specific market sectors",
      path: "/sector-drilldown",
    },
    {
      id: 3,
      name: "Live Price Simulation",
      icon: FaBolt,
      description: "Real-time market price tracking and simulation",
      path: "/live-prices",
    },
    {
      id: 4,
      name: "News Section with Search",
      icon: FaNewspaper,
      description: "Stay informed with searchable financial news",
      path: "/news",
    },
    {
      id: 5,
      name: "Buy/Sell/Hold AI Analysis",
      icon: FaBrain,
      description: "AI-powered investment recommendations",
      path: "/ai-analysis",
    },
    {
      id: 6,
      name: "Smart Filtering and Discovery",
      icon: FaFilter,
      description: "Advanced tools to find your perfect investments",
      path: "/smart-filter",
    },
    {
      id: 7,
      name: "News Watchlist",
      icon: FaRegNewspaper,
      description: "Your saved news & batch analysis",
      path: "/news-watchlist",
    },
  ];

  const handleFeatureClick = (featurePath) => {
    navigate(featurePath);
  };

  return (
    <div>
      {/* Header */}
      <header>
        <h1>TradeNexus</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/trending-sectors">Trending</a>
          <a href="/news">News</a>
          <a href="/ai-analysis">AI Analysis</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-title">
          Trade<span className="hero-accent">Nexus</span>
        </div>
        <div className="hero-underline"></div>
        <div className="hero-desc">Professional Trading Features</div>
      </section>

      {/* Features Grid */}
      <section className="features-container">
        <div className="features-grid">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className="feature-card"
                onClick={() => handleFeatureClick(feature.path)}
              >
                <div className="feature-icon">
                  <IconComponent />
                </div>
                <div className="feature-title">{feature.name}</div>
                <div className="feature-desc">{feature.description}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-title">Ready to Transform Your Trading?</div>
        <div className="cta-desc">
          Access professional-grade tools and AI-powered insights to make
          smarter investment decisions.
        </div>
        <button className="cta-button">Get Started Today</button>
      </section>

      {/* Footer */}
      <footer>
        <p>&copy; 2025 TradeNexus. Empowering Smart Trading Decisions.</p>
      </footer>
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
