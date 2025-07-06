// TradeNexus/Client/src/components/TrendingSectorsDisplay.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ArrowUp, ArrowDown, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TrendingSectorsDisplay = () => {
  const [trendingSectors, setTrendingSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [sortBy, setSortBy] = useState("volume");
  const [retryCount, setRetryCount] = useState(0);

  const navigate = useNavigate();

  // Get the base URL for your Node.js server from environment variables
  const SERVER_URL =
    process.env.REACT_APP_SERVER_URL || "http://localhost:5001";

  // Test server connection
  const testServerConnection = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/health`, {
        timeout: 5000,
      });
      console.log("Server health check:", response.data);
      return true;
    } catch (error) {
      console.error("Server health check failed:", error.message);
      return false;
    }
  };

  // Function to fetch trending sectors
  const fetchTrendingSectors = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(
        `Fetching trending sectors from: ${SERVER_URL}/api/trending-sectors?sortBy=${sortBy}`
      );

      // First test server connection
      const isServerHealthy = await testServerConnection();
      if (!isServerHealthy) {
        throw new Error(
          "Server is not responding. Please check if the server is running."
        );
      }

      const response = await axios.get(
        `${SERVER_URL}/api/trending-sectors?sortBy=${sortBy}`,
        {
          timeout: 10000, // 10 second timeout
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response format from server");
      }

      setTrendingSectors(response.data);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error("Error fetching trending sectors:", err);

      let errorMessage = "Failed to load trending sectors. ";

      if (
        err.code === "ECONNREFUSED" ||
        err.message.includes("Network Error")
      ) {
        errorMessage +=
          "Cannot connect to server. Please check if the server is running on " +
          SERVER_URL;
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

  // Function to fetch stocks for a specific sector
  const fetchStocksBySector = async (sectorName) => {
    setLoading(true);
    setError(null);
    setSelectedSector(null);

    try {
      console.log(`Fetching stocks for sector: ${sectorName}`);

      const response = await axios.get(
        `${SERVER_URL}/api/sectors/${encodeURIComponent(sectorName)}/stocks`,
        {
          timeout: 10000,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Sector stocks response:", response.data);
      setSelectedSector({ name: sectorName, stocks: response.data });
    } catch (err) {
      console.error(`Error fetching stocks for sector ${sectorName}:`, err);

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

  // Fetch trending sectors when component mounts or sortBy changes
  useEffect(() => {
    fetchTrendingSectors();
  }, [sortBy]);

  // Handle click on a sector card
  const handleSectorClick = (sectorName) => {
    fetchStocksBySector(sectorName);
  };

  // Handle back button from drilldown view
  const handleBackToTrending = () => {
    setSelectedSector(null);
    setError(null);
    fetchTrendingSectors();
  };

  // Handle back button to home
  const handleBackToHome = () => {
    navigate("/");
  };

  // Retry with exponential backoff
  const handleRetry = () => {
    const delay = Math.min(1000 * Math.pow(2, retryCount), 10000); // Max 10 seconds
    setTimeout(() => {
      fetchTrendingSectors();
    }, delay);
  };

  // Loading state
  if (loading && !selectedSector) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-400" />
          <p className="text-xl">Loading trending sectors...</p>
          <p className="text-sm text-gray-400 mt-2">
            Connecting to {SERVER_URL}
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !selectedSector) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <p className="text-xl mb-4 text-center max-w-2xl">{error}</p>
        <div className="flex gap-4">
          <button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry {retryCount > 0 && `(${retryCount})`}
          </button>
          <button
            onClick={handleBackToHome}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
          >
            Back to Home
          </button>
        </div>
        <div className="mt-4 text-sm text-gray-400 text-center">
          <p>Server URL: {SERVER_URL}</p>
          <p>Make sure the server is running and accessible</p>
        </div>
      </div>
    );
  }

  // Drilldown view
  if (selectedSector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToTrending}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-colors flex items-center"
            >
              <ArrowDown className="w-4 h-4 mr-2 transform rotate-90" />
              Back to Trending Sectors
            </button>
            <button
              onClick={handleBackToHome}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-colors flex items-center"
            >
              <ArrowUp className="w-4 h-4 mr-2 transform -rotate-90" />
              Back to Home
            </button>
          </div>

          <h2 className="text-4xl font-bold text-emerald-400 mb-8 text-center">
            {selectedSector.name} Stocks
          </h2>

          {loading ? (
            <div className="text-center text-xl">
              <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-400" />
              Loading stocks for {selectedSector.name}...
            </div>
          ) : error ? (
            <div className="text-center text-red-400 text-xl">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedSector.stocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg p-4 hover:bg-white/15 transition-colors"
                >
                  <div className="mb-2">
                    <h3 className="text-xl font-semibold text-blue-300">
                      {stock.symbol}
                    </h3>
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
          )}
        </div>
      </div>
    );
  }

  // Main trending sectors view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleBackToHome}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-colors flex items-center"
          >
            <ArrowUp className="w-4 h-4 mr-2 transform -rotate-90" />
            Back to Home
          </button>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-8">
          Trending <span className="text-blue-400">Sectors</span> 📈
        </h2>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSortBy("volume")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              sortBy === "volume"
                ? "bg-emerald-500 text-white shadow-lg"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Sort by Volume
          </button>
          <button
            onClick={() => setSortBy("price")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              sortBy === "price"
                ? "bg-emerald-500 text-white shadow-lg"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Sort by Price
          </button>
        </div>

        {trendingSectors.length === 0 && !loading && !error && (
          <p className="text-center text-xl text-gray-400">
            No trending sectors found. 😔
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingSectors.map((sector) => (
            <div
              key={sector.name}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 rounded-lg"
              onClick={() => handleSectorClick(sector.name)}
            >
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-blue-300 group-hover:text-emerald-300 transition-colors mb-2">
                  {sector.name}
                </h3>
                <div className="text-sm space-y-1">
                  <p className="text-blue-100">
                    Avg. Volume:{" "}
                    <span className="font-semibold">
                      {sector.averageVolume
                        ? sector.averageVolume.toLocaleString()
                        : "N/A"}
                    </span>
                  </p>
                  <p className="text-blue-100">
                    Avg. Price:{" "}
                    <span className="font-semibold">
                      ₹
                      {sector.averagePrice
                        ? sector.averagePrice.toFixed(2)
                        : "N/A"}
                    </span>
                  </p>
                  <p className="text-blue-100">
                    Total Stocks:{" "}
                    <span className="font-semibold">{sector.stockCount}</span>
                  </p>
                  <div className="mt-4 flex justify-center">
                    <div className="w-0 group-hover:w-16 h-0.5 bg-gradient-to-r from-blue-400 to-emerald-400 transition-all duration-300"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSectorsDisplay;
