// TradeNexus/Client/src/components/SectorDrilldown.jsx

import React, { useState } from "react";
import { RefreshCw, AlertCircle, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleBackToHome}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-colors flex items-center"
          >
            <ArrowUp className="w-4 h-4 mr-2 transform -rotate-90" />
            Back to Home
          </button>
        </div>
        <h2 className="text-4xl font-bold text-center text-emerald-400 mb-8">
          Sector Drilldown
        </h2>
        <div className="mb-8 flex flex-col md:flex-row items-center gap-4 justify-center">
          <input
            type="text"
            placeholder="Enter sector name"
            value={sectorName}
            onChange={(e) => setSectorName(e.target.value)}
            className="px-4 py-2 rounded-lg text-gray-900 w-64"
            autoComplete="off"
          />
          <button
            onClick={() => fetchSectorStocks()}
            disabled={!sectorName || loading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-full transition-colors flex items-center"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Show Stocks
          </button>
        </div>

        {/* SUGGESTION LIST */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {filteredSectors.map((sector) => (
            <button
              key={sector}
              className="bg-white/10 hover:bg-emerald-600 text-white px-4 py-2 rounded-full font-semibold transition-all"
              onClick={() => handleSectorClick(sector)}
              type="button"
            >
              {sector}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex flex-col items-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {stocks.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-blue-300 mb-4 text-center">
              {sectorName} Stocks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg p-4 hover:bg-white/15 transition-colors"
                >
                  <div className="mb-2">
                    <h4 className="text-xl font-semibold text-blue-300">
                      {stock.symbol}
                    </h4>
                  </div>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Last Price:</strong> ₹
                      {stock.lastPrice ? stock.lastPrice.toFixed(2) : "N/A"}
                    </p>
                    <p>
                      <strong>Volume:</strong>{" "}
                      {stock.volume ? stock.volume.toLocaleString() : "N/A"}
                    </p>
                    <p>
                      <strong>Resistance:</strong> ₹
                      {stock.resistance ? stock.resistance.toFixed(2) : "N/A"}
                    </p>
                    <p>
                      <strong>Support:</strong> ₹
                      {stock.support ? stock.support.toFixed(2) : "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center mt-8">
            <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-400" />
            <p className="text-xl">Loading sector stocks...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectorDrilldown;
