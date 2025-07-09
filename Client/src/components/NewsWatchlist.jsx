import React from "react";

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

.nwl-container {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.nwl-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--highlight-color);
  text-align: center;
  margin-bottom: 3rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: neonText 2s ease-in-out infinite alternate;
}

.nwl-empty {
  text-align: center;
  color: var(--text-color);
  font-size: 1.5rem;
  margin-top: 3rem;
  padding: 3rem;
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  animation: sectionPulse 3s ease-in-out infinite alternate;
}

.nwl-analyze-row {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  animation: sectionPulse 3s ease-in-out infinite alternate;
}

.nwl-analyze-btn {
  background: var(--button-gradient);
  color: #fff;
  font-weight: bold;
  padding: 15px 30px;
  font-size: 1.1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  border: none;
  transition: background-color 0.4s, transform 0.3s, box-shadow 0.3s;
  box-shadow: var(--neon-glow);
  font-family: "Orbitron", sans-serif;
  letter-spacing: 1px;
}

.nwl-analyze-btn:hover:not(:disabled) {
  background-color: #005a5a;
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--pulse-glow);
}

.nwl-analyze-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nwl-batch-result {
  background: rgba(62, 207, 142, 0.1);
  border: 1px solid var(--highlight-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
  animation: sectionPulse 3s ease-in-out infinite alternate;
}

.nwl-batch-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--highlight-color);
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nwl-batch-title::before {
  content: "🤖";
  font-size: 1.5rem;
}

.nwl-batch-content {
  color: var(--text-color);
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-line;
}

.nwl-news-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.nwl-news-card {
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

.nwl-news-card::before {
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

.nwl-news-card:hover::before {
  left: 100%;
}

.nwl-news-card:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.7);
}

.nwl-news-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--highlight-color);
  margin-bottom: 1rem;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
  line-height: 1.4;
}

.nwl-news-content {
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 1rem;
  line-height: 1.6;
  opacity: 0.9;
}

.nwl-news-date {
  color: var(--text-color);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
  font-style: italic;
}

.nwl-remove-btn {
  background: var(--alert-gradient);
  color: #fff;
  font-weight: bold;
  padding: 10px 20px;
  font-size: 0.9rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  border: none;
  transition: background-color 0.4s, transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 0 10px rgba(255, 46, 99, 0.5);
  font-family: "Orbitron", sans-serif;
}

.nwl-remove-btn:hover {
  background: linear-gradient(90deg, #e22c2c, #ff0080);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 0 15px rgba(255, 46, 99, 0.8);
}

/* Loading state for analyze button */
.nwl-analyze-btn.loading {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    box-shadow: var(--neon-glow);
  }
  50% {
    box-shadow: var(--pulse-glow);
  }
  100% {
    box-shadow: var(--neon-glow);
  }
}

/* Empty state styling */
.nwl-empty::before {
  content: "📰";
  display: block;
  font-size: 4rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .nwl-container {
    padding: 1rem;
  }
  
  .nwl-title {
    font-size: 2rem;
  }
  
  .nwl-news-card {
    padding: 1.5rem;
  }
  
  .nwl-analyze-row {
    padding: 1rem;
  }
  
  .nwl-batch-result {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .nwl-title {
    font-size: 1.5rem;
  }
  
  .nwl-news-card {
    padding: 1rem;
  }
  
  .nwl-analyze-btn {
    width: 100%;
    padding: 12px 20px;
    font-size: 1rem;
  }
}
`;
  document.head.appendChild(style);
}

const NewsWatchlist = ({
  watchlist,
  onAnalyzeAll,
  onRemove,
  analyzeAllResult,
}) => {
  return (
    <div className="nwl-container">
      <div className="nwl-title">News Watchlist</div>
      {watchlist.length === 0 ? (
        <div className="nwl-empty">
          No news in watchlist.
          <br />
          <span
            style={{
              fontSize: "1rem",
              opacity: 0.7,
              marginTop: "1rem",
              display: "block",
            }}
          >
            Add news articles from the News Section to analyze them together.
          </span>
        </div>
      ) : (
        <>
          <div className="nwl-analyze-row">
            <button
              className={`nwl-analyze-btn ${
                analyzeAllResult === "Analyzing all news..." ? "loading" : ""
              }`}
              onClick={onAnalyzeAll}
              disabled={analyzeAllResult === "Analyzing all news..."}
            >
              {analyzeAllResult === "Analyzing all news..."
                ? "🤖 Analyzing..."
                : "🤖 Analyze All News"}
            </button>
          </div>

          {/* Batch Analysis Result */}
          {analyzeAllResult && analyzeAllResult !== "Analyzing all news..." && (
            <div className="nwl-batch-result">
              <div className="nwl-batch-title">AI Batch Analysis Result</div>
              <div className="nwl-batch-content">{analyzeAllResult}</div>
            </div>
          )}

          <div className="nwl-news-list">
            {watchlist.map((item, idx) => (
              <div key={item.id || idx} className="nwl-news-card">
                <div className="nwl-news-title">{item.title}</div>
                <div className="nwl-news-content">{item.content}</div>
                <div className="nwl-news-date">{item.date}</div>
                <button
                  className="nwl-remove-btn"
                  onClick={() => onRemove(item)}
                >
                  🗑️ Remove
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default NewsWatchlist;
