import React, { useState, useEffect } from "react";
import axios from "axios";

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

.nfd-container {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.nfd-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--highlight-color);
  text-align: center;
  margin-bottom: 3rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: neonText 2s ease-in-out infinite alternate;
}

.nfd-search-row {
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

.nfd-search-input {
  width: 300px;
  padding: 12px;
  font-size: 1rem;
  color: var(--highlight-color);
  background-color: #1b1b2f;
  border: 1px solid #7b00ff;
  border-radius: var(--border-radius);
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  font-family: "Orbitron", sans-serif;
  outline: none;
}

.nfd-search-input::placeholder {
  color: #555a75;
}

.nfd-search-input:focus {
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
  transform: scale(1.02);
}

.nfd-search-btn {
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

.nfd-search-btn:hover {
  background-color: #005a5a;
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--pulse-glow);
}

.nfd-news-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.nfd-news-card {
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  border: 1px solid rgba(123, 0, 255, 0.3);
  padding: 2rem;
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  transition: transform 0.4s var(--easing-standard),
    box-shadow 0.4s var(--easing-standard);
  animation: sectionPulse 3s ease-in-out infinite alternate;
  position: relative;
  overflow: hidden;
}

.nfd-news-card::before {
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

.nfd-news-card:hover::before {
  left: 100%;
}

.nfd-news-card:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.7);
}

.nfd-news-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--highlight-color);
  margin-bottom: 1rem;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  line-height: 1.4;
}

.nfd-news-content {
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 1rem;
  line-height: 1.6;
  opacity: 0.9;
}

.nfd-news-date {
  color: var(--text-color);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  opacity: 0.7;
  font-style: italic;
}

.nfd-analysis-box {
  background: rgba(62, 207, 142, 0.1);
  border: 1px solid var(--highlight-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.nfd-analysis-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--highlight-color);
  margin-bottom: 0.5rem;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.nfd-analysis-content {
  color: var(--text-color);
  font-size: 0.95rem;
  line-height: 1.5;
}

.nfd-btn-row {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.nfd-btn {
  background: var(--button-gradient);
  color: #fff;
  font-weight: bold;
  padding: 10px 20px;
  font-size: 0.9rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  border: none;
  transition: background-color 0.4s, transform 0.3s, box-shadow 0.3s;
  box-shadow: var(--neon-glow);
  font-family: "Orbitron", sans-serif;
}

.nfd-btn:hover:not(:disabled) {
  background-color: #005a5a;
  transform: translateY(-2px) scale(1.05);
  box-shadow: var(--pulse-glow);
}

.nfd-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nfd-btn.analyze {
  background: linear-gradient(90deg, #3ecf8e, #00bfff);
}

.nfd-btn.analyze:hover:not(:disabled) {
  background: linear-gradient(90deg, #2ea86b, #0099cc);
}

.nfd-btn.watchlist {
  background: linear-gradient(90deg, #00bfff, #7200ca);
}

.nfd-btn.watchlist:hover:not(:disabled) {
  background: linear-gradient(90deg, #0099cc, #5a0099);
}

.nfd-loading {
  text-align: center;
  color: var(--text-color);
  font-size: 1.5rem;
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  animation: neonText 2s ease-in-out infinite alternate;
}

@media (max-width: 768px) {
  .nfd-container {
    padding: 1rem;
  }
  
  .nfd-title {
    font-size: 2rem;
  }
  
  .nfd-news-card {
    padding: 1.5rem;
  }
  
  .nfd-search-input {
    width: 250px;
  }
  
  .nfd-btn-row {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .nfd-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .nfd-title {
    font-size: 1.5rem;
  }
  
  .nfd-news-card {
    padding: 1rem;
  }
  
  .nfd-search-input {
    width: 200px;
  }
}
`;
  document.head.appendChild(style);
}

const NewsFeedDisplay = ({
  onAddToWatchlist = () => {},
  onAnalyze = () => {},
  analyzeResult = {},
}) => {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const SERVER_URL =
    process.env.REACT_APP_SERVER_URL || "http://localhost:5001";

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/api/news`);
      setNews(res.data.slice(0, 20)); // Show 20 news
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (search.trim() === "") {
        fetchNews();
      } else {
        const res = await axios.get(`${SERVER_URL}/api/news/search`, {
          params: { query: search },
        });
        setNews(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nfd-container">
      <div className="nfd-title">News Section</div>
      <form onSubmit={handleSearch} className="nfd-search-row">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="nfd-search-input"
        />
        <button type="submit" className="nfd-search-btn">
          Search
        </button>
      </form>
      {loading ? (
        <div className="nfd-loading">Loading news...</div>
      ) : (
        <div className="nfd-news-list">
          {news.map((item, idx) => {
            // Always use a unique key for each news item
            const uniqueKey = item.id ? `${item.id}` : `news_${idx}`;
            return (
              <div key={uniqueKey} className="nfd-news-card">
                <div className="nfd-news-title">{item.title}</div>
                <div className="nfd-news-content">{item.content}</div>
                <div className="nfd-news-date">{item.date}</div>
                {/* Analysis Result Display */}
                {analyzeResult[uniqueKey] && (
                  <div className="nfd-analysis-box">
                    <div className="nfd-analysis-title">🤖 AI Analysis:</div>
                    <div className="nfd-analysis-content">
                      {analyzeResult[uniqueKey]}
                    </div>
                  </div>
                )}
                <div className="nfd-btn-row">
                  <button
                    className="nfd-btn analyze"
                    onClick={() => onAnalyze(item, uniqueKey)}
                    disabled={analyzeResult[uniqueKey] === "Analyzing..."}
                  >
                    {analyzeResult[uniqueKey] === "Analyzing..."
                      ? "🤖 Analyzing..."
                      : "🤖 Analyze"}
                  </button>
                  <button
                    className="nfd-btn watchlist"
                    onClick={() => onAddToWatchlist(item)}
                  >
                    ⭐ Add to Watchlist
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewsFeedDisplay;
