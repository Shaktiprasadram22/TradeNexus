import React, { useState } from "react";
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

@keyframes tablePulse {
  0% {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.6);
  }
  100% {
    box-shadow: 0 0 20px rgba(0, 255, 255, 1);
  }
}

.sf-container {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.sf-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--highlight-color);
  text-align: center;
  margin-bottom: 3rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: neonText 2s ease-in-out infinite alternate;
}

.sf-form {
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  border: 1px solid rgba(123, 0, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  padding: 2rem;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: sectionPulse 3s ease-in-out infinite alternate;
  position: relative;
  overflow: hidden;
}

.sf-form::before {
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

.sf-form:hover::before {
  left: 100%;
}

.sf-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .sf-row {
    flex-direction: row;
  }
}

.sf-input,
.sf-select {
  padding: 12px;
  border-radius: var(--border-radius);
  border: 1px solid #7b00ff;
  font-size: 1rem;
  width: 100%;
  color: var(--highlight-color);
  background-color: #1b1b2f;
  outline: none;
  transition: all 0.3s ease;
  font-family: "Orbitron", sans-serif;
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
}

.sf-input::placeholder {
  color: #555a75;
}

.sf-input:focus,
.sf-select:focus {
  border: 1.5px solid var(--highlight-color);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
  transform: scale(1.02);
}

.sf-select option {
  background-color: #1b1b2f;
  color: var(--text-color);
}

.sf-btn {
  background: var(--button-gradient);
  color: #fff;
  font-weight: bold;
  padding: 12px 30px;
  font-size: 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  border: none;
  transition: background-color 0.4s, transform 0.3s, box-shadow 0.3s;
  box-shadow: var(--neon-glow);
  font-family: "Orbitron", sans-serif;
  margin-top: 1rem;
  align-self: flex-end;
}

.sf-btn:hover:not(:disabled) {
  background-color: #005a5a;
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--pulse-glow);
}

.sf-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sf-help {
  color: var(--text-color);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.7;
  font-style: italic;
}

.sf-error {
  text-align: center;
  color: #ff2e63;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  padding: 1rem;
  background: rgba(255, 46, 99, 0.1);
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 46, 99, 0.3);
  box-shadow: 0 0 10px rgba(255, 46, 99, 0.3);
}

.sf-table-wrap {
  overflow-x: auto;
  margin: 20px auto;
  padding: 25px;
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  animation: tablePulse 3s ease-in-out infinite alternate;
}

.sf-table {
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

.sf-table th,
.sf-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid #7b00ff;
}

.sf-table th {
  color: var(--highlight-color);
  font-weight: 700;
  font-size: 1.1rem;
  background: var(--header-bg);
  text-shadow: 0px 0px 6px rgba(0, 255, 255, 0.8);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.sf-table tr {
  transition: all 0.3s ease;
}

.sf-table tbody tr:hover {
  background: rgba(69, 69, 69, 0.85);
  transform: scale(1.01);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
}

.sf-table td {
  color: var(--text-color);
  font-size: 1rem;
  font-weight: 500;
}

.sf-table tbody tr td:first-child {
  color: var(--highlight-color);
  font-weight: 600;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.sf-muted {
  color: var(--text-color);
  text-align: center;
  margin-top: 3rem;
  font-size: 1.2rem;
  padding: 2rem;
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  opacity: 0.8;
}

/* Form field groups */
.sf-field-group {
  width: 100%;
}

.sf-field-group .sf-input,
.sf-field-group .sf-select {
  margin-bottom: 0.5rem;
}

/* Loading state */
.sf-loading {
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
  .sf-container {
    padding: 1rem;
  }
  
  .sf-title {
    font-size: 2rem;
  }
  
  .sf-form {
    padding: 1.5rem;
  }
  
  .sf-table-wrap {
    padding: 1rem;
  }
  
  .sf-table th,
  .sf-table td {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .sf-btn {
    align-self: stretch;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .sf-title {
    font-size: 1.5rem;
  }
  
  .sf-table th,
  .sf-table td {
    padding: 0.5rem 0.3rem;
    font-size: 0.8rem;
  }
}
`;
  document.head.appendChild(style);
}

const SECTOR_LIST = [
  "Technology",
  "PSU Bank",
  "Media & Entertainment",
  "Nifty Financial Services",
  "Consumer Goods",
  "Bank Nifty",
  "Construction",
  "Consumption",
  "Metals",
  "Nifty Oil & Gas",
  "Private Bank",
  "Energy",
  "Automobile",
  "Nifty Healthcare Index",
  "Pharma",
];

const SmartFiltering = () => {
  const [sector, setSector] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minVolume, setMinVolume] = useState("");
  const [near, setNear] = useState(""); // "support" or "resistance"
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const SERVER_URL =
    process.env.REACT_APP_SERVER_URL || "http://localhost:5001";

  const handleFilter = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStocks([]);
    try {
      const params = {};
      if (sector) params.sector = sector;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minVolume) params.minVolume = minVolume;
      if (near) params.near = near;
      const response = await axios.get(`${SERVER_URL}/api/smart-filter`, {
        params,
      });
      setStocks(response.data);
    } catch (err) {
      setError("Failed to filter stocks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sf-container">
      <div className="sf-title">Smart Filtering & Discovery</div>
      <form className="sf-form" onSubmit={handleFilter}>
        <div className="sf-row">
          <div className="sf-field-group">
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="sf-select"
            >
              <option value="">All Sectors</option>
              {SECTOR_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="sf-field-group">
            <input
              type="number"
              placeholder="Min Price (₹)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="sf-input"
            />
          </div>
          <div className="sf-field-group">
            <input
              type="number"
              placeholder="Max Price (₹)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="sf-input"
            />
          </div>
        </div>

        <div className="sf-row">
          <div className="sf-field-group">
            <input
              type="number"
              placeholder="Min Volume (e.g. 100000)"
              value={minVolume}
              onChange={(e) => setMinVolume(e.target.value)}
              className="sf-input"
            />
            <div className="sf-help">
              Only show stocks with volume at least this value
            </div>
          </div>
          <div className="sf-field-group">
            <select
              value={near}
              onChange={(e) => setNear(e.target.value)}
              className="sf-select"
            >
              <option value="">Any Position</option>
              <option value="support">Near Support Level</option>
              <option value="resistance">Near Resistance Level</option>
            </select>
          </div>
        </div>

        <button type="submit" className="sf-btn" disabled={loading}>
          {loading ? "🔍 Filtering..." : "🔍 Filter Stocks"}
        </button>
      </form>

      {error && <div className="sf-error">{error}</div>}

      {loading && <div className="sf-loading">Searching for stocks...</div>}

      {stocks.length > 0 && !loading && (
        <div className="sf-table-wrap">
          <table className="sf-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Price</th>
                <th>Volume</th>
                <th>Sector</th>
                <th>Resistance</th>
                <th>Support</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td>{stock.symbol}</td>
                  <td>₹{stock.lastPrice?.toFixed(2)}</td>
                  <td>{stock.volume?.toLocaleString()}</td>
                  <td>{stock.sector}</td>
                  <td>₹{stock.resistance?.toFixed(2)}</td>
                  <td>₹{stock.support?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && stocks.length === 0 && !error && (
        <div className="sf-muted">
          🔍 No stocks found. Try adjusting your filters to discover more
          opportunities.
        </div>
      )}
    </div>
  );
};

export default SmartFiltering;
