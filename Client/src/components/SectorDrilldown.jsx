import React, { useState } from "react";
import { FaSyncAlt, FaExclamationCircle, FaArrowUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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

.sd-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.sd-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.sd-btn {
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
}

.sd-btn:hover {
  background-color: #005a5a;
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--pulse-glow);
}

.sd-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  color: var(--highlight-color);
  margin-bottom: 3rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: neonText 2s ease-in-out infinite alternate;
}

.sd-search-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  animation: sectionPulse 3s ease-in-out infinite alternate;
}

.sd-search-input {
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

.sd-search-input::placeholder {
  color: #555a75;
}

.sd-search-input:focus {
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
  transform: scale(1.02);
}

.sd-search-btn {
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sd-search-btn:hover:not(:disabled) {
  background-color: #005a5a;
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--pulse-glow);
}

.sd-search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sd-sector-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
}

.sd-sector-btn {
  background: rgba(46, 46, 92, 0.9);
  color: var(--text-color);
  border: 1px solid rgba(123, 0, 255, 0.3);
  border-radius: var(--border-radius);
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: "Orbitron", sans-serif;
  transition: all 0.3s ease;
  box-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
}

.sd-sector-btn:hover {
  background: var(--button-gradient);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: var(--neon-glow);
}

.sd-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: rgba(255, 46, 99, 0.1);
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 46, 99, 0.3);
  box-shadow: 0 0 10px rgba(255, 46, 99, 0.3);
}

.sd-error-icon {
  font-size: 3rem;
  color: #ff2e63;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(255, 46, 99, 0.8);
}

.sd-error-msg {
  color: #ff2e63;
  font-size: 1.2rem;
  text-align: center;
  font-family: "Orbitron", sans-serif;
}

.sd-stock-title {
  font-size: 2rem;
  color: var(--highlight-color);
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 2px;
  animation: neonText 2s ease-in-out infinite alternate;
}

.sd-stock-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.sd-stock-card {
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  border: 1px solid rgba(123, 0, 255, 0.3);
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.sd-stock-card::before {
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

.sd-stock-card:hover::before {
  left: 100%;
}

.sd-stock-card:hover {
  background: rgba(62, 207, 142, 0.1);
  transform: translateY(-5px);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);
}

.sd-stock-symbol {
  font-size: 1.3rem;
  color: var(--highlight-color);
  font-weight: 600;
  margin-bottom: 1rem;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.sd-stock-info {
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.sd-stock-info strong {
  color: var(--highlight-color);
}

.sd-loading {
  text-align: center;
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
}

.sd-loading-icon {
  font-size: 3rem;
  color: var(--highlight-color);
  margin-bottom: 1rem;
  animation: spin 1.2s linear infinite;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.sd-loading-text {
  font-size: 1.2rem;
  color: var(--text-color);
  font-family: "Orbitron", sans-serif;
}

@media (max-width: 768px) {
  .sd-container {
    padding: 1rem;
  }
  
  .sd-title {
    font-size: 2rem;
  }
  
  .sd-stock-title {
    font-size: 1.5rem;
  }
  
  .sd-stock-card {
    padding: 1rem;
  }
  
  .sd-search-input {
    width: 250px;
  }
  
  .sd-sector-list {
    gap: 0.5rem;
    padding: 1rem;
  }
  
  .sd-sector-btn {
    padding: 8px 15px;
    font-size: 0.8rem;
  }
}
`;
  document.head.appendChild(style);
}

// Hardcoded list of sector names (update as needed)
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

const SectorDrilldown = () => {
  const [sectorName, setSectorName] = useState("");
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const SERVER_URL =
    process.env.REACT_APP_SERVER_URL || "http://localhost:5001";

  // Filter suggestions as user types
  const filteredSectors = sectorName
    ? SECTOR_LIST.filter((sector) =>
        sector.toLowerCase().includes(sectorName.toLowerCase())
      )
    : SECTOR_LIST;

  const fetchSectorStocks = async (name) => {
    setLoading(true);
    setError(null);
    setStocks([]);
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/sector-drilldown/${encodeURIComponent(
          name || sectorName
        )}`,
        {
          timeout: 10000,
        }
      );
      setStocks(response.data);
    } catch (err) {
      let errorMessage = "Failed to load sector stocks. ";
      if (err.response?.status === 404) {
        errorMessage += "No stocks found for this sector.";
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += err.message || "Unknown error occurred.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSectorClick = (sector) => {
    setSectorName(sector);
    fetchSectorStocks(sector);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="sd-container">
      <div className="sd-header">
        <button className="sd-btn" onClick={handleBackToHome}>
          <FaArrowUp style={{ transform: "rotate(-90deg)" }} /> Back to Home
        </button>
      </div>

      <div className="sd-title">Sector Drilldown</div>

      <div className="sd-search-row">
        <input
          type="text"
          placeholder="Enter sector name"
          value={sectorName}
          onChange={(e) => setSectorName(e.target.value)}
          className="sd-search-input"
          autoComplete="off"
        />
        <button
          onClick={() => fetchSectorStocks()}
          disabled={!sectorName || loading}
          className="sd-search-btn"
        >
          {loading ? <FaSyncAlt className="sd-loading-icon" /> : null}
          Show Stocks
        </button>
      </div>

      {/* SUGGESTION LIST */}
      <div className="sd-sector-list">
        {filteredSectors.map((sector) => (
          <button
            key={sector}
            className="sd-sector-btn"
            onClick={() => handleSectorClick(sector)}
            type="button"
          >
            {sector}
          </button>
        ))}
      </div>

      {error && (
        <div className="sd-error">
          <FaExclamationCircle className="sd-error-icon" />
          <div className="sd-error-msg">{error}</div>
        </div>
      )}

      {stocks.length > 0 && (
        <div>
          <div className="sd-stock-title">{sectorName} Stocks</div>
          <div className="sd-stock-grid">
            {stocks.map((stock) => (
              <div key={stock.symbol} className="sd-stock-card">
                <div className="sd-stock-symbol">{stock.symbol}</div>
                <div className="sd-stock-info">
                  <strong>Last Price:</strong> ₹
                  {stock.lastPrice ? stock.lastPrice.toFixed(2) : "N/A"}
                </div>
                <div className="sd-stock-info">
                  <strong>Volume:</strong>{" "}
                  {stock.volume ? stock.volume.toLocaleString() : "N/A"}
                </div>
                <div className="sd-stock-info">
                  <strong>Resistance:</strong> ₹
                  {stock.resistance ? stock.resistance.toFixed(2) : "N/A"}
                </div>
                <div className="sd-stock-info">
                  <strong>Support:</strong> ₹
                  {stock.support ? stock.support.toFixed(2) : "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="sd-loading">
          <FaSyncAlt className="sd-loading-icon" />
          <div className="sd-loading-text">Loading sector stocks...</div>
        </div>
      )}
    </div>
  );
};

export default SectorDrilldown;
