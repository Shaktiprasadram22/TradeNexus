// Client/src/components/NewsWatchlist.jsx

import React from "react";

const NewsWatchlist = ({
  watchlist,
  onAnalyzeAll,
  onRemove,
  analyzeAllResult,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white p-6">
      <h2 className="text-4xl font-bold text-center text-emerald-400 mb-8">
        News Watchlist
      </h2>
      {watchlist.length === 0 ? (
        <div className="text-center text-gray-400">No news in watchlist.</div>
      ) : (
        <>
          <div className="flex justify-center mb-6">
            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full disabled:opacity-50"
              onClick={onAnalyzeAll}
              disabled={analyzeAllResult === "Analyzing all news..."}
            >
              {analyzeAllResult === "Analyzing all news..."
                ? "Analyzing..."
                : "Analyze All News"}
            </button>
          </div>

          {/* Batch Analysis Result */}
          {analyzeAllResult && analyzeAllResult !== "Analyzing all news..." && (
            <div className="bg-emerald-900/50 border border-emerald-500 rounded-lg p-4 mb-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-emerald-300 mb-2">
                Batch Analysis Result:
              </h3>
              <p className="text-emerald-100">{analyzeAllResult}</p>
            </div>
          )}

          <div className="space-y-6">
            {watchlist.map((item, idx) => (
              <div key={item.id || idx} className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-blue-300 mb-2">
                  {item.title}
                </h3>
                <p className="text-blue-100 mb-2">{item.content}</p>
                <div className="text-xs text-gray-400 mb-2">{item.date}</div>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
                  onClick={() => onRemove(item)}
                >
                  Remove
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
