import os
from dotenv import load_dotenv
import openai

# Load environment variables from .env
load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_analysis(news_text):
    prompt = f"""You are a financial analyst. Based on the following news snippet, provide a Buy/Sell/Hold recommendation and a brief reason.

NEWS:
{news_text}

Your answer should include:
RECOMMENDATION: [BUY/SELL/HOLD]
REASON: [Your reasoning]
"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=256,
        temperature=0.2,
    )
    return response.choices[0].message.content.strip()

def analyze_news(news_text):
    analysis = generate_analysis(news_text)
    return {
        "relevant_news": [news_text],
        "analysis": analysis
    }

if __name__ == "__main__":
    news_text = input("Paste the news text to analyze: ")
    result = analyze_news(news_text)
    print("\nRelevant news snippet:")
    print("-", result["relevant_news"][0])
    print("\nAI Analysis:")
    print(result["analysis"])
