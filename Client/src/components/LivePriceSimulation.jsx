// TradeNexus/Client/src/components/LivePriceSimulation.jsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

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
      } catch (err) {
        setError("Failed to load stocks.");
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

  // Helper to get price direction for color
  const getPriceDirection = (symbol, currentPrice) => {
    const prev = prevPrices.current[symbol];
    if (prev === undefined) return "";
    if (currentPrice > prev) return "text-green-400";
    if (currentPrice < prev) return "text-red-400";
    return "";
  };

  if (loading) {
    return (
      <div className="text-center text-white py-10">Loading stocks...</div>
    );
  }
  if (error) {
    return <div className="text-center text-red-400 py-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
      <h2 className="text-4xl font-bold text-center text-emerald-400 mb-8">
        Live Price Simulation
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/10 rounded-lg text-white">
          <thead>
            <tr>
              <th className="py-2 px-4">Symbol</th>
              <th className="py-2 px-4">Last Price</th>
              <th className="py-2 px-4">Volume</th>
              <th className="py-2 px-4">Sector</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.symbol}>
                <td className="py-2 px-4">{stock.symbol}</td>
                <td
                  className={`py-2 px-4 font-bold ${getPriceDirection(
                    stock.symbol,
                    stock.lastPrice
                  )}`}
                >
                  ₹{stock.lastPrice?.toFixed(2)}
                </td>
                <td className="py-2 px-4">{stock.volume?.toLocaleString()}</td>
                <td className="py-2 px-4">{stock.sector}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-center text-gray-400 mt-4">
        Prices update every 3 seconds (simulated).
      </p>
    </div>
  );
};

export default LivePriceSimulation;
