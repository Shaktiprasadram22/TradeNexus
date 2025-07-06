import os
from dotenv import load_dotenv
import openai
import json
import re

# Load environment variables from .env
load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def parse_stock_data(query):
    """
    Extract structured stock data from the query string
    """
    try:
        # Extract stock symbol
        symbol_match = re.search(r'Analyze (\w+) stock:', query)
        symbol = symbol_match.group(1) if symbol_match else "Unknown"
        
        # Extract price data
        price_match = re.search(r'Current Price: ₹([\d,]+(?:\.\d+)?)', query)
        current_price = price_match.group(1) if price_match else "N/A"
        
        # Extract volume data
        volume_match = re.search(r'Volume: ([\d,]+)', query)
        volume = volume_match.group(1) if volume_match else "N/A"
        
        # Extract support/resistance
        support_match = re.search(r'Support Level: ₹([\d,]+(?:\.\d+)?)', query)
        support = support_match.group(1) if support_match else "N/A"
        
        resistance_match = re.search(r'Resistance Level: ₹([\d,]+(?:\.\d+)?)', query)
        resistance = resistance_match.group(1) if resistance_match else "N/A"
        
        return {
            "symbol": symbol,
            "current_price": current_price,
            "volume": volume,
            "support": support,
            "resistance": resistance
        }
    except Exception as e:
        return {"symbol": "Unknown", "error": str(e)}

def generate_stock_analysis(query):
    """
    Generate comprehensive stock analysis using OpenAI
    """
    # Parse stock data for context
    stock_info = parse_stock_data(query)
    
    prompt = f"""You are a professional financial analyst with expertise in technical analysis and market sentiment. 

Based on the provided stock information and news, provide a clear investment recommendation.

{query}

Please provide your analysis in the following format:

RECOMMENDATION: [BUY/SELL/HOLD]

REASONING:
• [Key technical factor]
• [Volume analysis point]
• [News sentiment factor]
• [Support/Resistance analysis]
• [Risk assessment]

CONFIDENCE LEVEL: [High/Medium/Low]

KEY PRICE LEVELS:
• Entry Point: ₹[price]
• Stop Loss: ₹[price]
• Target: ₹[price]

Keep your response concise but comprehensive. Focus on actionable insights."""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a senior financial analyst specializing in Indian stock markets. Provide clear, actionable investment advice based on technical analysis, volume patterns, and news sentiment."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            max_tokens=400,
            temperature=0.3,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Analysis failed: {str(e)}"

def analyze_stock_comprehensive(stock_data_query):
    """
    Main function for comprehensive stock analysis
    Combines technical data + news sentiment + AI analysis
    """
    try:
        # Parse the input to understand what stock we're analyzing
        stock_info = parse_stock_data(stock_data_query)
        
        # Generate AI analysis
        analysis = generate_stock_analysis(stock_data_query)
        
        # Structure the response
        result = {
            "stock_symbol": stock_info.get("symbol", "Unknown"),
            "analysis": analysis,
            "data_points_used": [
                "Current Price & Volume",
                "Support & Resistance Levels", 
                "Recent News Sentiment",
                "Technical Indicators"
            ],
            "analysis_type": "Multi-factor AI Analysis"
        }
        
        return result
        
    except Exception as e:
        return {
            "error": f"Stock analysis failed: {str(e)}",
            "analysis": "Unable to generate analysis. Please try again.",
            "stock_symbol": "Unknown"
        }

def extract_recommendation(analysis_text):
    """
    Extract just the recommendation (BUY/SELL/HOLD) from analysis
    """
    try:
        # Look for recommendation in the analysis
        rec_match = re.search(r'RECOMMENDATION:\s*(\w+)', analysis_text, re.IGNORECASE)
        if rec_match:
            return rec_match.group(1).upper()
        
        # Fallback: look for buy/sell/hold anywhere in text
        text_upper = analysis_text.upper()
        if 'BUY' in text_upper and 'SELL' not in text_upper:
            return 'BUY'
        elif 'SELL' in text_upper:
            return 'SELL'
        elif 'HOLD' in text_upper:
            return 'HOLD'
        else:
            return 'HOLD'  # Default to HOLD if unclear
            
    except Exception:
        return 'HOLD'

def format_analysis_for_frontend(analysis_result):
    """
    Format analysis result for better frontend display
    """
    try:
        analysis_text = analysis_result.get("analysis", "")
        recommendation = extract_recommendation(analysis_text)
        
        # Add emoji based on recommendation
        emoji_map = {
            'BUY': '🟢',
            'SELL': '🔴', 
            'HOLD': '🟡'
        }
        
        formatted_analysis = f"{emoji_map.get(recommendation, '🟡')} {analysis_text}"
        
        return {
            **analysis_result,
            "analysis": formatted_analysis,
            "recommendation": recommendation
        }
        
    except Exception:
        return analysis_result

# Main analysis function to be called from main.py
def analyze_stock(query):
    """
    Main entry point for stock analysis
    Called from FastAPI endpoint
    """
    result = analyze_stock_comprehensive(query)
    formatted_result = format_analysis_for_frontend(result)
    
    return {
        "relevant_data": [query[:200] + "..." if len(query) > 200 else query],
        "analysis": formatted_result.get("analysis", "Analysis unavailable"),
        "stock_symbol": formatted_result.get("stock_symbol", "Unknown"),
        "recommendation": formatted_result.get("recommendation", "HOLD"),
        "confidence": "AI-powered multi-factor analysis"
    }

if __name__ == "__main__":
    # Test the analysis function
    test_query = """Analyze RELIANCE stock:
        
Stock Details:
- Current Price: ₹2,650
- Volume: 2,300,000 (Avg: 1,200,000)
- Support Level: ₹2,500
- Resistance Level: ₹2,750
- 52W High: ₹2,856
- 52W Low: ₹2,220

Recent News:
- Reliance Industries posts record quarterly profit
- Company announces major expansion in green energy sector
- Institutional investors increase stake in Reliance

Provide a BUY/SELL/HOLD recommendation with bullet-point reasons."""

    result = analyze_stock(test_query)
    
    print("\n" + "="*50)
    print("STOCK ANALYSIS RESULT")
    print("="*50)
    print(f"Stock: {result['stock_symbol']}")
    print(f"Recommendation: {result['recommendation']}")
    print("\nAnalysis:")
    print(result['analysis'])
    print("\nConfidence:", result['confidence'])
