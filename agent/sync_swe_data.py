import requests
import os
import re
import sys
from pathlib import Path
from datetime import datetime
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import json

SWE_URL = "https://www.swebench.com/index.html"
HEADERS = { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}

CURRENT_SCRIPT_PATH = Path(__file__).resolve()
AGENT_DIR = CURRENT_SCRIPT_PATH.parent
PROJECT_ROOT = AGENT_DIR.parent

MODELS_DIR = PROJECT_ROOT / "src" / "content" / "models" 
BENCH_DIR = PROJECT_ROOT / "src" / "content" / "benchmarks"
PUB_DIR = PROJECT_ROOT / "src" / "content" / "publishers"

SWE_META = {
        "name": "SWE-bench (Bash Only)",
        "fullName": "SoftWare Engineering Benchmark",
        "publisher": "Princeton University & University of Chicago",
        "description": "SWE-bench is a benchmark for evaluating large language models on real world software issues collected from GitHub. Given a codebase and an issue, a language model is tasked with generating a patch that resolves the described problem",
        "link": "https://www.swebench.com/",
        "tags": ["Coding", "Agent", "Software Engineer"],
        "metrics": {"unit": "% Resolved", "isBetterHigher": True},
        }

PUBLISHER_TABULAR = {
        "Google DeepMind": "Google",
        "Qwen": "Alibaba",
        "Z.ai": "Zai",
        "Moonshot AI": "Kimi"
        }

MODEL_TABULAR = {
        "claude-4-5-opus-medium": "claude-opus-4-5-thinking",
        "gemini-3-pro-preview": "gemini-3-pro",
        "gpt-5-2-high-reasoning": "gpt-5-2",
        "gpt-5-1-codex-medium-reasoning": "gpt-5-1-codex",
        "gpt-5-1-medium-reasoning": "gpt-5-1",
        "gpt-5-medium-reasoning": "gpt-5-medium",
        "deepseek-v3-2-reasoner": "deepseek-v3-2-reasoning",
        "gpt-5-mini-medium-reasoning": "gpt-5-mini-medium",
        "glm-4-6-t-1": "glm-4-6",
        "kimi-k2-instruct": "kimi-k2-0905",
        "gpt-5-nano-medium-reasoning": "gpt-5-nano-medium",
        "llama-4-maverick-instruct": "llama-4-maverick",
        "llama-4-scout-instruct": "llama-4-scout",
        "devstral": "devstral-2"
        }

def slugify(text):
    if not text: return "unknown" 
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+','-',text)
    return text.strip('-').strip('.')

def clean_model_date(name):
    # Clean the date after the model name
    return re.sub(r'\s*\(\d+(?:-\d+)*\)','',name).strip()

def load_json_safe(path):
    if path.exists():
        try:
            with open(path, "r", encoding='utf-8') as f:
                return json.load(f)
        except: return {}
    return {}

def save_json(path,data):
    path.parent.mkdir(parents=True, exist_ok = True)
    with open(path,"w",encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def fetch_swe_html(url):
    print(f"Fetching SWE information from {url}")
    try:
        with sync_playwright() as p:
            # Launch the chromium
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            # Wait the page for <table>
            page.goto(url, wait_until='domcontentloaded')
            page.wait_for_selector('table',timeout=60000)

            # Get the HTML with <table>
            html_content = page.content()

            # Close chromium
            browser.close()

        return html_content
    except Exception as e:
        print(f"Network Error: {e}")
        sys.exit(1)

def parse_html(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')

    target_table = soup.find('table')
    if not target_table:
        print("Could not find the result table")
        sys.exit(1)

    print("Found target table. Parsing ...")

    results = []

    rows = target_table.find('tbody').find_all('tr')
    for row in rows:
        # There will be an empty <tr>, so exlude it
        if 'no-results' in row.get('class', []):
            continue

        # Directly get publisher name from data-tags
        data_tags = row.get('data-tags', '')
        org = None
        model = None
        for part in data_tags.split(','):
            part = part.strip()
            if part.startswith('Org:'):
                org = part.split(':', 1)[1].strip()
        
        # Unify the publisher name
        if org in PUBLISHER_TABULAR:
            org = PUBLISHER_TABULAR[org]

        cols = row.find_all('td')
        if not cols: continue

        # Get model name and score from <td>s
        model = cols[1].get_text(strip=True)
        score = cols[2].get_text(strip=True)

        results.append({
            "model": model,
            "publisher": org,
            "score": score
            })

    return results

def sync_swe_data():
    html_content = fetch_swe_html(SWE_URL)
    results = parse_html(html_content)
    
    today_str = datetime.now().strftime("%Y-%m-%d")
    bench_snapshot = []

    print(f"Processing {len(results)} entries...")

    for item in results:
        pubName = item['publisher']
        modelName = item['model']

        pubSlug = slugify(pubName)
        modelSlug = slugify(clean_model_date(modelName))
        # Fix the name contradiction
        if modelSlug in MODEL_TABULAR:
            modelSlug = MODEL_TABULAR[modelSlug]

        modelRef = f"{pubSlug}/{modelSlug}"

        # Add to snapshot
        bench_snapshot.append({
            "modelRef": modelRef,
            "score": float(item["score"])
            })

    bench_id = "swe_bash_only"
    bench_file = BENCH_DIR / f"{bench_id}.json"
    existing_bench_data = load_json_safe(bench_file)

    output_data = {
            "name": SWE_META["name"],
            "fullName": SWE_META["fullName"],
            "publisher": SWE_META["publisher"],
            "description": SWE_META["description"],
            "link": SWE_META["link"],
            "tags": SWE_META["tags"],
            "lastUpdated": today_str,
            "metrics": SWE_META["metrics"],
            "trending": existing_bench_data.get("trending", {"view": 0,"initialWeight": 1000}),
            "snapshot": sorted(bench_snapshot, key=lambda x:x["score"], reverse=True)
            }

    def get_core_content(data):
        cp = data.copy()

        return cp.get("snapshot",None)

    if get_core_content(output_data) == get_core_content(existing_bench_data):
        output_data["lastUpdated"] = existing_bench_data.get("lastUpdated", today_str)
    else:
        print(f"Update occurs for {bench_id}")


    save_json(bench_file, output_data)
    print("SWE-bench information sync completed")
    
if __name__ == "__main__":
    sync_swe_data()
