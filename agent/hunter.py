import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from models import Benchmark, Metrics, SnapshotItem, Trending
from test_write import save_benchmark
import requests
from bs4 import BeautifulSoup

load_dotenv()

client = OpenAI(
    api_key=os.getenv("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

def extract_benchmark_data(raw_text: str) -> Benchmark:
    """
    Call DeepSeek to generate a benchmark
    """
    system_prompt = """
    You are a professional information extractor.
    You are going to extract some benchmark (focused on AI realm) information from the provided text.
    You MUST return a valid JSON object that matches the below structure:
    {
        "name": "string",
        "fullName": "string",
        "publisher": "string",
        "description": "short summary",
        "link": "string(url)",
        "tags": ["tag1","tag2"],
        "lastUpdated": "YYYY-MM-DD",
        "metrics": {"unit": "string", "isBetterHigher": true},
        "trending": {"views": 0, "initialWeight": 1000},
        "snapshot":[
            {"model": "string", "score": float, "publisher": "string"}
        ]
    }
    ONLY RETURN THE JSON, NO OTHER TEXT.
    """
    
    print("Loading the paper content...")
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Extract info from this text: {raw_text}"},
        ],
        response_format={'type': 'json_object'},
        stream=False
    )
    
    json_data = json.loads(response.choices[0].message.content)
    
    return Benchmark(**json_data)

def fetch_arxiv_summary(url:str) -> str:
    """Extract information from an arxiv URL"""
    print(f"fetching paper info from: {url}")
    
    if url.endswith(".pdf"):
        url = url.replace(".pdf", "").replace("/pdf/","/abs/")
    
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception("Failed to fetch the webpage")
    
    soup = BeautifulSoup(response.text, "html.parser")

    # Get the title and abstract(Based on arXiv-style html)
    title = soup.find("h1", class_="title mathjax").text.strip()
    abstract = soup.find("blockquote", class_="abstract mathjax").text.strip()
    
    return f"Title: {title}\n\nAbstract:{abstract}"
    
    
# Simulation of one run
if __name__ == "__main__":
    # Simulation of one abstract from some paper
    example_url = "https://arxiv.org/abs/2009.03300"
    paper_abstract = """
    We introduce MATH-Hard, a new benchmark for extremely difficult mathematical reasoning. 
    Published by Stanford University in Dec 2025. 
    The official project page is https://github.com/stanford/math-hard. 
    It focuses on STEM and Logic.
    Our results show that GPT-4.5 achieved 72.5%, while Claude 4 Opus scored 70.1% 
    and DeepSeek-V3 reached 71.8%. Metrics are based on Pass@1 accuracy.
    """
    try:
        content = fetch_arxiv_summary(example_url)

        extract_bench = extract_benchmark_data(content)
        
        save_benchmark(extract_bench)
        print(f"Successfully saved data for benchmark:{extract_bench.name}")
    except Exception as e:
        print(f"error: {e}")