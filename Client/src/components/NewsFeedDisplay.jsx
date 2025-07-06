import React, { useState, useEffect } from "react";
import axios from "axios";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
      <h2 className="text-4xl font-bold text-center text-emerald-400 mb-8">
        News Section
      </h2>
      <form onSubmit={handleSearch} className="mb-8 flex justify-center gap-4">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg text-gray-900 w-64"
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-full"
        >
          Search
        </button>
      </form>
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <div className="space-y-6">
          {news.map((item, idx) => {
            // Always use a unique key for each news item
            const uniqueKey = item.id ? `${item.id}` : `news_${idx}`;
            return (
              <div key={uniqueKey} className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-300 mb-2">
                  {item.title}
                </h3>
                <p className="text-blue-100 mb-2">{item.content}</p>
                <div className="text-xs text-gray-400 mb-2">{item.date}</div>

                {/* Analysis Result Display */}
                {analyzeResult[uniqueKey] && (
                  <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-3 mb-3">
                    <h4 className="text-sm font-semibold text-blue-300 mb-1">
                      AI Analysis:
                    </h4>
                    <p className="text-blue-100 text-sm">
                      {analyzeResult[uniqueKey]}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full disabled:opacity-50"
                    onClick={() => onAnalyze(item, uniqueKey)}
                    disabled={analyzeResult[uniqueKey] === "Analyzing..."}
                  >
                    {analyzeResult[uniqueKey] === "Analyzing..."
                      ? "Analyzing..."
                      : "Analyze"}
                  </button>
                  <button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full"
                    onClick={() => onAddToWatchlist(item)}
                  >
                    Add to Watchlist
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
