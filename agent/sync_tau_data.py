import requests
import os
import re
import sys
from pathlib import Path
from datetime import datetime
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
import json

TAU_URL = "http://taubench.com/#leaderboard"
HEADERS = { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}

CURRENT_SCRIPT_PATH = Path(__file__).resolve()
AGENT_DIR = CURRENT_SCRIPT_PATH.parent
PROJECT_ROOT = AGENT_DIR.parent

MODELS_DIR = PROJECT_ROOT / "src" / "content" / "models" 
BENCH_DIR = PROJECT_ROOT / "src" / "content" / "benchmarks"
PUB_DIR = PROJECT_ROOT / "src" / "content" / "publishers"

TAU_META = {
        "name": "τ-bench",
        "fullName": None,
        "publisher": "Sierra",
        "description": "Benchmarking AI agents in collaborative real-world scenarios. τ-bench challenges agents to coordinate, guide, and assist users in achieving shared objectives across complex enterprise domains",
        "link": "http://taubench.com/#leaderboard",
        "tags": ["Agent", "Instruction-Following"],
        "metrics": {"unit": "pass@1(%)", "isBetterHigher": True},
        }

MODEL_TABULAR = {
        "gemini-3-0-pro": "gemini-3-pro",
        "claude-sonnet-4-5": "claude-4-5-sonnet",
        "qwen3-max-thinking-previewnew": "qwen3-max-thinking",
        "qwen3-max-thinking-preview": "qwen3-max-thinking"
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

def fetch_tau_html(url):
    print(f"Fetching Tau information from {url}")
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
        cols = row.find_all('td')
        if not cols: continue

        # Get model name and socre from <td>'s
        model = cols[1].get_text(strip=True)
        score = cols[4].get_text(strip=True).replace('%','')

        results.append({
            "model": model,
            "score": score
            })

    return results

def find_model_vendor(model_name, base_dir):
    base = Path(base_dir)

    matches = list(base.rglob(f"{model_name}.json"))
    if matches:
        path = matches[0]
        publisher = path.parent.name
        return publisher

    return None

def sync_tau_data():
    html_content = fetch_tau_html(TAU_URL)
    results = parse_html(html_content)
    
    today_str = datetime.now().strftime("%Y-%m-%d")
    bench_snapshot = []

    print(f"Processing {len(results)} entries...")

    for item in results:
        modelName = item['model']

        modelSlug = slugify(clean_model_date(modelName))

        # Fix the name contradiction
        if modelSlug in MODEL_TABULAR:
            modelSlug = MODEL_TABULAR[modelSlug]

        pubSlug = find_model_vendor(modelSlug,MODELS_DIR)

        modelRef = f"{pubSlug}/{modelSlug}"

        # Add to snapshot
        bench_snapshot.append({
            "modelRef": modelRef,
            "score": float(item["score"])
            })

    bench_id = "τ-bench"
    bench_file = BENCH_DIR / f"{bench_id}.json"
    existing_bench_data = load_json_safe(bench_file)

    output_data = {
            "name": TAU_META["name"],
            "fullName": TAU_META["fullName"],
            "publisher": TAU_META["publisher"],
            "description": TAU_META["description"],
            "link": TAU_META["link"],
            "tags": TAU_META["tags"],
            "lastUpdated": today_str,
            "metrics": TAU_META["metrics"],
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
    print("τ-bench information sync completed")
    
if __name__ == "__main__":
    sync_tau_data()
