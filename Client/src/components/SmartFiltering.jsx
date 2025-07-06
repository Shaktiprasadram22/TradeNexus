// TradeNexus/Client/src/components/SmartFiltering.jsx

import React, { useState } from "react";
import axios from "axios";

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
      setError("Failed to filter stocks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
      <h2 className="text-4xl font-bold text-center text-emerald-400 mb-8">
        Smart Filtering & Discovery
      </h2>
      <form
        className="bg-white/10 p-6 rounded-lg mb-8 max-w-2xl mx-auto flex flex-col gap-4"
        onSubmit={handleFilter}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="px-4 py-2 rounded-lg text-gray-900 w-full md:w-1/2"
          >
            <option value="">All Sectors</option>
            {SECTOR_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-4 py-2 rounded-lg text-gray-900 w-full md:w-1/4"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-4 py-2 rounded-lg text-gray-900 w-full md:w-1/4"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <input
              type="number"
              placeholder="Min Volume (e.g. 100000)"
              value={minVolume}
              onChange={(e) => setMinVolume(e.target.value)}
              className="px-4 py-2 rounded-lg text-gray-900 w-full"
            />
            <div className="text-xs text-gray-400 mt-1">
              Only show stocks with volume at least this value
            </div>
          </div>
          <select
            value={near}
            onChange={(e) => setNear(e.target.value)}
            className="px-4 py-2 rounded-lg text-gray-900 w-full md:w-1/2"
          >
            <option value="">Any</option>
            <option value="support">Near Support</option>
            <option value="resistance">Near Resistance</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
          disabled={loading}
        >
          {loading ? "Filtering..." : "Filter Stocks"}
        </button>
      </form>

      {error && <div className="text-center text-red-400 mb-4">{error}</div>}

      {stocks.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/10 rounded-lg text-white">
            <thead>
              <tr>
                <th className="py-2 px-4">Symbol</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Volume</th>
                <th className="py-2 px-4">Sector</th>
                <th className="py-2 px-4">Resistance</th>
                <th className="py-2 px-4">Support</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.symbol}>
                  <td className="py-2 px-4">{stock.symbol}</td>
                  <td className="py-2 px-4">₹{stock.lastPrice?.toFixed(2)}</td>
                  <td className="py-2 px-4">
                    {stock.volume?.toLocaleString()}
                  </td>
                  <td className="py-2 px-4">{stock.sector}</td>
                  <td className="py-2 px-4">₹{stock.resistance?.toFixed(2)}</td>
                  <td className="py-2 px-4">₹{stock.support?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && stocks.length === 0 && (
        <div className="text-center text-gray-400 mt-8">
          No stocks found. Try adjusting your filters.
        </div>
      )}
    </div>
  );
};

export default SmartFiltering;
