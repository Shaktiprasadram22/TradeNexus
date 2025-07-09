import React, { useState, useEffect, useRef } from "react";
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

@keyframes tablePulse {
  0% {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
  }
  100% {
    box-shadow: 0 0 20px rgba(0, 255, 255, 1);
  }
}

@keyframes priceFlashGreen {
  0% { background: rgba(76, 175, 80, 0.4); }
  50% { background: rgba(76, 175, 80, 0.2); }
  100% { background: transparent; }
}

@keyframes priceFlashRed {
  0% { background: rgba(255, 92, 92, 0.4); }
  50% { background: rgba(255, 92, 92, 0.2); }
  100% { background: transparent; }
}

.lps-container {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.lps-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--highlight-color);
  text-align: center;
  margin-bottom: 3rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: neonText 2s ease-in-out infinite alternate;
}

.lps-table-wrap {
  overflow-x: auto;
  margin: 20px auto;
  padding: 25px;
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  animation: tablePulse 3s ease-in-out infinite alternate;
}

.lps-table {
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
  background: rgba(46, 46, 92, 0.9);
  border-radius: var(--border-radius);
  color: var(--highlight-color);
  font-size: 0.95rem;
  box-shadow: var(--box-shadow);
  overflow: hidden;
}

.lps-table th,
.lps-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #7b00ff;
}

.lps-table th {
  color: var(--highlight-color);
  font-weight: 700;
  font-size: 1.1rem;
  background: var(--header-bg);
  text-shadow: 0px 0px 6px rgba(0, 255, 255, 0.8);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.lps-table tr {
  transition: all 0.3s ease;
  position: relative;
}

.lps-table tbody tr:hover {
  background: rgba(69, 69, 69, 0.85);
  transform: scale(1.01);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
}

.lps-table td {
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.lps-table tbody tr td:first-child {
  color: var(--highlight-color);
  font-weight: 600;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

/* Price direction styling - GREEN for UP, RED for DOWN */
.lps-price-up {
  color: #4caf50 !important;
  font-weight: 700;
  text-shadow: 0 0 8px rgba(76, 175, 80, 0.8);
  animation: priceFlashGreen 1s ease-out;
}

.lps-price-down {
  color: #ff5c5c !important;
  font-weight: 700;
  text-shadow: 0 0 8px rgba(255, 92, 92, 0.8);
  animation: priceFlashRed 1s ease-out;
}

.lps-price-neutral {
  color: var(--text-color);
  font-weight: 600;
}

.lps-note {
  text-align: center;
  color: var(--text-color);
  margin-top: 2rem;
  font-size: 1rem;
  opacity: 0.8;
  padding: 1rem;
  background: rgba(25, 25, 60, 0.7);
  border-radius: var(--border-radius);
  border: 1px solid rgba(123, 0, 255, 0.3);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.lps-loading,
.lps-error {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: var(--text-color);
  font-size: 1.5rem;
  text-align: center;
}

.lps-loading {
  animation: neonText 2s ease-in-out infinite alternate;
}

.lps-error {
  color: #ff2e63;
  text-shadow: 0 0 10px rgba(255, 46, 99, 0.8);
  background: rgba(255, 46, 99, 0.1);
  border-radius: var(--border-radius);
  padding: 2rem;
  margin: 2rem;
  border: 1px solid rgba(255, 46, 99, 0.3);
}

.lps-loading-icon {
  font-size: 3rem;
  color: var(--highlight-color);
  margin-bottom: 1rem;
  animation: spin 1.2s linear infinite;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

/* Price change indicators */
.lps-table td.price-changed {
  position: relative;
}

.lps-table td.price-changed::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), transparent);
  animation: priceHighlight 1s ease-out;
  pointer-events: none;
}

@keyframes priceHighlight {
  0% { opacity: 0; transform: translateX(-100%); }
  50% { opacity: 1; transform: translateX(0%); }
  100% { opacity: 0; transform: translateX(100%); }
}

/* Volume formatting */
.lps-volume {
  color: var(--text-color);
  font-weight: 500;
}

/* Sector styling */
.lps-sector {
  color: var(--text-color);
  opacity: 0.9;
  font-style: italic;
}

/* Price direction indicators */
.price-indicator {
  display: inline-block;
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.price-indicator.up {
  color: #4caf50;
}

.price-indicator.down {
  color: #ff5c5c;
}

@media (max-width: 768px) {
  .lps-container {
    padding: 1rem;
  }
  
  .lps-title {
    font-size: 2rem;
  }
  
  .lps-table-wrap {
    padding: 1rem;
  }
  
  .lps-table th,
  .lps-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .lps-table {
    min-width: 600px;
  }
}

@media (max-width: 480px) {
  .lps-table th,
  .lps-table td {
    padding: 0.5rem 0.3rem;
    font-size: 0.8rem;
  }
  
  .lps-title {
    font-size: 1.5rem;
  }
}
`;
  document.head.appendChild(style);
}

// Helper to simulate a small random price change
function simulatePriceChange(price) {
  const changePercent = (Math.random() * 2 - 1) * 0.01; // -1% to +1%
  return +(price * (1 + changePercent)).toFixed(2);
}

const LivePriceSimulation = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prevPrices = useRef({});

  const SERVER_URL =
    process.env.REACT_APP_SERVER_URL || "http://localhost:5001";

  // Fetch stocks on mount
  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${SERVER_URL}/api/stocks`);
        setStocks(response.data);
        // Initialize previous prices
        response.data.forEach((stock) => {
          prevPrices.current[stock.symbol] = stock.lastPrice;
        });
      } catch (err) {
        setError("Failed to load stocks. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, [SERVER_URL]);

  // Simulate price changes every 3 seconds
  useEffect(() => {
    if (stocks.length === 0) return;
    const interval = setInterval(() => {
      setStocks((currentStocks) =>
        currentStocks.map((stock) => {
          const prev = stock.lastPrice;
          const newPrice = simulatePriceChange(prev);
          prevPrices.current[stock.symbol] = prev;
          return { ...stock, lastPrice: newPrice };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [stocks.length]);

  // Helper to get price direction for color and indicator
  const getPriceDirection = (symbol, currentPrice) => {
    const prev = prevPrices.current[symbol];
    if (prev === undefined || prev === currentPrice) return "lps-price-neutral";
    if (currentPrice > prev) return "lps-price-up";
    if (currentPrice < prev) return "lps-price-down";
    return "lps-price-neutral";
  };

  // Helper to get price direction indicator
  const getPriceIndicator = (symbol, currentPrice) => {
    const prev = prevPrices.current[symbol];
    if (prev === undefined || prev === currentPrice) return null;
    if (currentPrice > prev)
      return <span className="price-indicator up">▲</span>;
    if (currentPrice < prev)
      return <span className="price-indicator down">▼</span>;
    return null;
  };

  if (loading) {
    return (
      <div className="lps-loading">
        <div className="lps-loading-icon">⟳</div>
        <div>Loading live stock data...</div>
      </div>
    );
  }

  if (error) {
    return <div className="lps-error">{error}</div>;
  }

  return (
    <div className="lps-container">
      <div className="lps-title">Live Price Simulation</div>
      <div className="lps-table-wrap">
        <table className="lps-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Last Price</th>
              <th>Volume</th>
              <th>Sector</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const priceClass = getPriceDirection(
                stock.symbol,
                stock.lastPrice
              );
              const priceIndicator = getPriceIndicator(
                stock.symbol,
                stock.lastPrice
              );

              return (
                <tr key={stock.symbol}>
                  <td>{stock.symbol}</td>
                  <td
                    className={`${priceClass} ${
                      priceClass !== "lps-price-neutral" ? "price-changed" : ""
                    }`}
                  >
                    {priceIndicator}₹{stock.lastPrice?.toFixed(2)}
                  </td>
                  <td className="lps-volume">
                    {stock.volume?.toLocaleString()}
                  </td>
                  <td className="lps-sector">{stock.sector}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="lps-note">
        🔄 Prices update every 3 seconds (simulated live data)
        <br />
        <span style={{ color: "#4caf50" }}>▲ Green</span> = Price Increase |
        <span style={{ color: "#ff5c5c" }}> ▼ Red</span> = Price Decrease
      </div>
    </div>
  );
};

export default LivePriceSimulation;
