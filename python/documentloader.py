from dotenv import load_dotenv
import os
import requests

load_dotenv()
API_URL = os.getenv("API_URL", "http://localhost:5001/api")

def fetch_stocks():
    resp = requests.get(f"{API_URL}/stocks")
    resp.raise_for_status()
    return resp.json()

def fetch_news():
    resp = requests.get(f"{API_URL}/news")
    resp.raise_for_status()
    return resp.json()

if __name__ == "__main__":
    print("Fetching stocks...")
    stocks = fetch_stocks()
    print(f"Fetched {len(stocks)} stocks")

    print("Fetching news...")
    news = fetch_news()
    print(f"Fetched {len(news)} news items")
