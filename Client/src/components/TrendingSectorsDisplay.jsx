import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaArrowUp,
  FaArrowDown,
  FaSyncAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

.tsd-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.tsd-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
}

.tsd-btn {
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

.tsd-btn:hover {
  background-color: #005a5a;
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--pulse-glow);
}

.tsd-title {
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--highlight-color);
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

.tsd-title .accent {
  color: #ff007a;
}

.tsd-sort-row {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.tsd-sort-btn {
  background: rgba(25, 25, 60, 0.95);
  color: var(--text-color);
  border: 1px solid rgba(123, 0, 255, 0.3);
  border-radius: var(--border-radius);
  padding: 12px 25px;
  font-weight: 600;
  cursor: pointer;
  font-size: 1rem;
  font-family: "Orbitron", sans-serif;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.tsd-sort-btn.active,
.tsd-sort-btn:hover {
  background: var(--button-gradient);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: var(--pulse-glow);
}

.tsd-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.tsd-card {
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
  border: 1px solid rgba(123, 0, 255, 0.3);
  transition: transform 0.4s var(--easing-standard),
    box-shadow 0.4s var(--easing-standard);
  cursor: pointer;
  padding: 2rem;
  text-align: center;
  animation: sectionPulse 3s ease-in-out infinite alternate;
  position: relative;
  overflow: hidden;
}

@keyframes sectionPulse {
  0% {
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  }
  100% {
    box-shadow: 0 0 25px rgba(0, 255, 255, 1);
  }
}

.tsd-card::before {
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

.tsd-card:hover::before {
  left: 100%;
}

.tsd-card:hover {
  transform: scale(1.05);
  box-shadow: var(--pulse-glow);
}

.tsd-sector-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--highlight-color);
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
  animation: neonText 2s ease-in-out infinite alternate;
}

.tsd-card:hover .tsd-sector-title {
  color: #ff007a;
}

.tsd-sector-info {
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.tsd-divider {
  width: 60px;
  height: 4px;
  background: var(--button-gradient);
  margin: 1.5rem auto;
  border-radius: 2px;
  transition: width 0.3s ease;
  box-shadow: var(--neon-glow);
}

.tsd-card:hover .tsd-divider {
  width: 100px;
  box-shadow: var(--pulse-glow);
}

.tsd-empty {
  text-align: center;
  color: var(--text-color);
  font-size: 1.5rem;
  margin-top: 3rem;
  padding: 2rem;
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  box-shadow: 0 0 15px rgba(0, 0, 255, 0.5);
}

.tsd-loading,
.tsd-error {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.tsd-loading-icon {
  font-size: 3rem;
  color: var(--highlight-color);
  margin-bottom: 1rem;
  animation: spin 1.2s linear infinite;
  text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.tsd-error-icon {
  font-size: 3rem;
  color: #ff2e63;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(255, 46, 99, 0.8);
}

.tsd-error-btns {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.tsd-drill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.tsd-drill-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--highlight-color);
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: 2px;
  animation: neonText 2s ease-in-out infinite alternate;
}

.tsd-drill-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.tsd-stock-card {
  background: rgba(25, 25, 60, 0.95);
  border-radius: var(--border-radius);
  border: 1px solid rgba(123, 0, 255, 0.3);
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.tsd-stock-card:hover {
  background: rgba(62, 207, 142, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.6);
}

.tsd-stock-symbol {
  font-size: 1.3rem;
  color: var(--highlight-color);
  font-weight: 600;
  margin-bottom: 1rem;
  text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
}

.tsd-stock-info {
  color: var(--text-color);
  font-size: 1rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.tsd-stock-info strong {
  color: var(--highlight-color);
}

@media (max-width: 768px) {
  .tsd-container {
    padding: 1rem;
  }
  
  .tsd-title {
    font-size: 2rem;
  }
  
  .tsd-drill-title {
    font-size: 1.8rem;
  }
  
  .tsd-card,
  .tsd-stock-card {
    padding: 1.5rem;
  }
  
  .tsd-sort-row {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .tsd-drill-header {
    flex-direction: column;
    text-align: center;
  }
}
`;
  document.head.appendChild(style);
}

const TrendingSectorsDisplay = () => {
  const [trendingSectors, setTrendingSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [sortBy, setSortBy] = useState("volume");
  const [retryCount, setRetryCount] = useState(0);

  const navigate = useNavigate();
  const SERVER_URL =
    process.env.REACT_APP_SERVER_URL || "http://localhost:5001";

  // Test server connection
  const testServerConnection = async () => {
    try {
      await axios.get(`${SERVER_URL}/api/health`, { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  };

  // Fetch trending sectors
  const fetchTrendingSectors = async () => {
    setLoading(true);
    setError(null);

    try {
      const isServerHealthy = await testServerConnection();
      if (!isServerHealthy) {
        throw new Error(
          "Server is not responding. Please check if the server is running."
        );
      }
      const response = await axios.get(
        `${SERVER_URL}/api/trending-sectors?sortBy=${sortBy}`,
        { timeout: 10000 }
      );
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format from server");
      }
      setTrendingSectors(response.data);
      setRetryCount(0);
    } catch (err) {
      let errorMessage = "Failed to load trending sectors. ";
      if (
        err.code === "ECONNREFUSED" ||
        (err.message && err.message.includes("Network Error"))
      ) {
        errorMessage += `Cannot connect to server. Please check if the server is running on ${SERVER_URL}`;
      } else if (err.response?.status === 404) {
        errorMessage +=
          "API endpoint not found. Please check server configuration.";
      } else if (err.response?.status >= 500) {
        errorMessage += "Server error. Please try again later.";
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += err.message || "Unknown error occurred.";
      }
      setError(errorMessage);
      setRetryCount((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stocks for a sector
  const fetchStocksBySector = async (sectorName) => {
    setLoading(true);
    setError(null);
    setSelectedSector(null);

    try {
      const response = await axios.get(
        `${SERVER_URL}/api/sectors/${encodeURIComponent(sectorName)}/stocks`,
        { timeout: 10000 }
      );
      setSelectedSector({ name: sectorName, stocks: response.data });
    } catch (err) {
      let errorMessage = `Failed to load stocks for ${sectorName}. `;
      if (err.response?.status === 404) {
        errorMessage += "Sector not found or no stocks available.";
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += "Please try again later.";
      }
      setError(errorMessage);
      setSelectedSector(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingSectors();
    // eslint-disable-next-line
  }, [sortBy]);

  const handleSectorClick = (sectorName) => fetchStocksBySector(sectorName);
  const handleBackToTrending = () => {
    setSelectedSector(null);
    setError(null);
    fetchTrendingSectors();
  };
  const handleBackToHome = () => navigate("/");
  const handleRetry = () => {
    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
    setTimeout(fetchTrendingSectors, delay);
  };

  // Loading state
  if (loading && !selectedSector) {
    return (
      <div className="tsd-loading">
        <FaSyncAlt className="tsd-loading-icon" />
        <div
          style={{
            fontSize: "1.5rem",
            color: "var(--text-color)",
            marginBottom: "1rem",
          }}
        >
          Loading trending sectors...
        </div>
        <div
          style={{
            color: "var(--text-color)",
            opacity: 0.7,
            fontSize: "1rem",
          }}
        >
          Connecting to {SERVER_URL}
        </div>
      </div>
    );
  }

  // Error state
  if (error && !selectedSector) {
    return (
      <div className="tsd-error">
        <FaExclamationCircle className="tsd-error-icon" />
        <div
          style={{
            fontSize: "1.5rem",
            marginBottom: "1rem",
            color: "var(--text-color)",
          }}
        >
          {error}
        </div>
        <div className="tsd-error-btns">
          <button className="tsd-btn" onClick={handleRetry}>
            <FaSyncAlt /> Retry {retryCount > 0 && `(${retryCount})`}
          </button>
          <button className="tsd-btn" onClick={handleBackToHome}>
            Back to Home
          </button>
        </div>
        <div
          style={{
            color: "var(--text-color)",
            opacity: 0.7,
            marginTop: "1rem",
            fontSize: "0.95rem",
          }}
        >
          Server URL: {SERVER_URL}
          <br />
          Make sure the server is running and accessible
        </div>
      </div>
    );
  }

  // Drilldown view
  if (selectedSector) {
    return (
      <div className="tsd-container">
        <div className="tsd-drill-header">
          <button className="tsd-btn" onClick={handleBackToTrending}>
            <FaArrowDown style={{ transform: "rotate(90deg)" }} /> Back to
            Trending Sectors
          </button>
          <button className="tsd-btn" onClick={handleBackToHome}>
            <FaArrowUp style={{ transform: "rotate(-90deg)" }} /> Back to Home
          </button>
        </div>
        <div className="tsd-drill-title">{selectedSector.name} Stocks</div>
        {loading ? (
          <div
            style={{
              textAlign: "center",
              fontSize: "1.2rem",
              color: "var(--text-color)",
            }}
          >
            <FaSyncAlt className="tsd-loading-icon" />
            Loading stocks for {selectedSector.name}...
          </div>
        ) : error ? (
          <div
            style={{
              color: "#ff2e63",
              textAlign: "center",
              fontSize: "1.1rem",
              padding: "2rem",
              background: "rgba(255, 46, 99, 0.1)",
              borderRadius: "var(--border-radius)",
              border: "1px solid rgba(255, 46, 99, 0.3)",
            }}
          >
            {error}
          </div>
        ) : (
          <div className="tsd-drill-grid">
            {selectedSector.stocks.map((stock) => (
              <div key={stock.symbol} className="tsd-stock-card">
                <div className="tsd-stock-symbol">{stock.symbol}</div>
                <div className="tsd-stock-info">
                  <strong>Last Price:</strong> ₹
                  {stock.lastPrice ? stock.lastPrice.toFixed(2) : "N/A"}
                </div>
                <div className="tsd-stock-info">
                  <strong>Volume:</strong>{" "}
                  {stock.volume ? stock.volume.toLocaleString() : "N/A"}
                </div>
                <div className="tsd-stock-info">
                  <strong>Resistance:</strong> ₹
                  {stock.resistance ? stock.resistance.toFixed(2) : "N/A"}
                </div>
                <div className="tsd-stock-info">
                  <strong>Support:</strong> ₹
                  {stock.support ? stock.support.toFixed(2) : "N/A"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Main trending sectors view
  return (
    <div className="tsd-container">
      <div className="tsd-header">
        <button className="tsd-btn" onClick={handleBackToHome}>
          <FaArrowUp style={{ transform: "rotate(-90deg)" }} /> Back to Home
        </button>
      </div>
      <div className="tsd-title">
        Trending <span className="accent">Sectors</span> 📈
      </div>
      <div className="tsd-sort-row">
        <button
          className={`tsd-sort-btn${sortBy === "volume" ? " active" : ""}`}
          onClick={() => setSortBy("volume")}
        >
          Sort by Volume
        </button>
        <button
          className={`tsd-sort-btn${sortBy === "price" ? " active" : ""}`}
          onClick={() => setSortBy("price")}
        >
          Sort by Price
        </button>
      </div>
      {trendingSectors.length === 0 && !loading && !error && (
        <div className="tsd-empty">No trending sectors found. 😔</div>
      )}
      <div className="tsd-grid">
        {trendingSectors.map((sector) => (
          <div
            key={sector.name}
            className="tsd-card"
            onClick={() => handleSectorClick(sector.name)}
          >
            <div className="tsd-sector-title">{sector.name}</div>
            <div className="tsd-sector-info">
              Avg. Volume:{" "}
              <span
                style={{ color: "var(--highlight-color)", fontWeight: "600" }}
              >
                {sector.averageVolume
                  ? sector.averageVolume.toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="tsd-sector-info">
              Avg. Price:{" "}
              <span
                style={{ color: "var(--highlight-color)", fontWeight: "600" }}
              >
                ₹{sector.averagePrice ? sector.averagePrice.toFixed(2) : "N/A"}
              </span>
            </div>
            <div className="tsd-sector-info">
              Total Stocks:{" "}
              <span
                style={{ color: "var(--highlight-color)", fontWeight: "600" }}
              >
                {sector.stockCount}
              </span>
            </div>
            <div className="tsd-divider"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSectorsDisplay;
