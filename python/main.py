import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from feature4_news_rag import analyze_news
from feature6_stock_analysis import analyze_stock

load_dotenv()

app = FastAPI(
    title="TradeNexus RAG API",
    description="AI-powered news and stock analysis for financial trading",
    version="1.0.0"
)

# Add CORS middleware to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NewsAnalyzeRequest(BaseModel):
    query: str

    class Config:
        schema_extra = {
            "example": {
                "query": "What is the impact of recent tech earnings on the market?"
            }
        }

class StockAnalyzeRequest(BaseModel):
    query: str

    class Config:
        schema_extra = {
            "example": {
                "query": "Analyze RELIANCE stock with current price ₹2,650, volume 2.3M, support ₹2,500, resistance ₹2,750"
            }
        }

@app.post("/rag/news-analyze", response_model=dict)
async def news_analyze(req: NewsAnalyzeRequest):
    """
    Analyze news content using RAG (Retrieval-Augmented Generation).
    
    - **query**: The news content or question to analyze
    """
    try:
        if not req.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        result = analyze_news(req.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"News analysis failed: {str(e)}")

@app.post("/rag/stock-analyze", response_model=dict)
async def stock_analyze(req: StockAnalyzeRequest):
    """
    Comprehensive stock analysis using technical data + news sentiment.
    
    - **query**: Stock data including price, volume, support/resistance, and related news
    """
    try:
        if not req.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        result = analyze_stock(req.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stock analysis failed: {str(e)}")

@app.get("/", response_model=dict)
async def root():
    """Health check endpoint."""
    return {
        "status": "ok", 
        "message": "TradeNexus RAG API running",
        "version": "1.0.0",
        "endpoints": {
            "news_analyze": "/rag/news-analyze",
            "stock_analyze": "/rag/stock-analyze",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/health", response_model=dict)
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "service": "TradeNexus RAG API",
        "version": "1.0.0",
        "features": [
            "News Analysis with RAG",
            "Multi-factor Stock Analysis",
            "OpenAI Integration",
            "Real-time Processing"
        ]
    }

@app.get("/api-info", response_model=dict)
async def api_info():
    """API information and usage guide."""
    return {
        "api_name": "TradeNexus RAG API",
        "version": "1.0.0",
        "endpoints": {
            "/rag/news-analyze": {
                "method": "POST",
                "description": "Analyze individual news articles",
                "input": "News title and content",
                "output": "BUY/SELL/HOLD recommendation with reasoning"
            },
            "/rag/stock-analyze": {
                "method": "POST", 
                "description": "Comprehensive stock analysis",
                "input": "Stock data (price, volume, S&R) + related news",
                "output": "Multi-factor analysis with price targets"
            }
        },
        "data_sources": [
            "Technical indicators",
            "Volume analysis", 
            "Support/Resistance levels",
            "News sentiment",
            "Market trends"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("RAG_PORT", 8000))
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=port, 
        reload=True,
        log_level="info"
    )
