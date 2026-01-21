import json
import os
import re
import requests
import sys
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

CURRENT_SCRIPT_PATH = Path(__file__).resolve()
AGENT_DIR = CURRENT_SCRIPT_PATH.parent
PROJECT_ROOT = AGENT_DIR.parent

load_dotenv(AGENT_DIR / ".env")

MODELS_DIR = PROJECT_ROOT / "src" / "content" / "models"
BENCH_DIR = PROJECT_ROOT / "src" / "content" / "benchmarks"
PUB_DIR = PROJECT_ROOT / "src" / "content" / "publishers"

AA_LLM_URL = "https://artificialanalysis.ai/api/v2/data/llms/models"
AA_API_KEY = os.environ.get("ARTIFICIAL_ANALYSIS_API_KEY")
HEADERS = { "x-api-key": AA_API_KEY,
           "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
           }

BENCHMARK_METADATA = {
    "artificial_analysis_intelligence_index": {
        "name": "Artificial Analysis Intelligence Index",
        "fullName": None,
        "publisher": "Artificial Analysis",
        "description": "Artificial Analysis Intelligence Index v4.0 incorporates 10 evaluations: GDPval-AA, 𝜏²-Bench Telecom, Terminal-Bench Hard, SciCode, AA-LCR, AA-Omniscience, IFBench, Humanity's Last Exam, GPQA Diamond, CritPt",
        "link": "https://artificialanalysis.ai/#artificial-analysis-intelligence-index",
        "tags": ["General", "LLM"],
        "metrics": {"unit": "Index", "isBetterHigher": True},
        "isFromAA": True,
        "AALink": "https://artificialanalysis.ai/#artificial-analysis-intelligence-index", 
    },
    "artificial_analysis_coding_index": {
        "name": "Artificial Analysis Coding Index",
        "fullName": None,
        "publisher": "Artificial Analysis",
        "description": "Represents the average of coding benchmarks in the Artificial Analysis Intelligence Index (Terminal-Bench Hard, SciCode)",
        "link": "https://artificialanalysis.ai/#artificial-analysis-coding-index",
        "tags": ["Coding", "LLM"],
        "metrics": {"unit": "Index", "isBetterHigher": True},
        "isFromAA": True,
        "AALink": "https://artificialanalysis.ai/#artificial-analysis-coding-index"
    },
    "mmlu_pro": {
        "name": "MMLU-Pro",
        "fullName": "Massive Multitask Language Understanding Pro",
        "publisher": "TIGER AI Lab",
        "description": "An enhanced version of MMLU with 12,000 graduate-level questions across 14 subject areas, featuring ten answer options and deeper reasoning requirements",
        "link": "https://github.com/TIGER-AI-Lab/MMLU-Pro",
        "tags": ["Multitask", "General", "LLM"],
        "metrics": {"unit": "pass@1(%)", "isBetterHigher": True},
        "isFromAA": True,
        "AALink": "https://artificialanalysis.ai/evaluations/mmlu-pro"
    },
    "gpqa": {
        "name": "GPQA Diamond",
        "fullName": "A Graduate-Level Google-Proof Q&A Diamond",
        "publisher": "idavidrein",
        "description": "A more robust and challenging version of the MMLU benchmark",
        "link": "https://github.com/TIGER-AI-Lab/MMLU-Pro",
        "tags": ["Scientific", "LLM"],
        "metrics": {"unit": "pass@1(%)", "isBetterHigher": True},
        "isFromAA": True,
        "AALink": "https://artificialanalysis.ai/evaluations/gpqa-diamond",
    },
    "hle": {
        "name": "HLE",
        "fullName": "Humanity's Last Exam",
        "publisher": "Center for AI Safety & Scale AI",
        "description": "Humanity's Last Exam (HLE) is a multi-modal benchmark at the frontier of human knowledge, designed to be the final closed-ended academic benchmark of its kind with broad subject coverage. Humanity's Last Exam consists of 2,500 questions across dozens of subjects, including mathematics, humanities, and the natural sciences. HLE is developed globally by subject-matter experts and consists of multiple-choice and short-answer questions suitable for automated grading",
        "link": "https://lastexam.ai/",
        "tags": ["General", "Multi-Modal", "Academic", "LLM"],
        "metrics": {"unit": "pass@1(%)", "isBetterHigher": True},
        "isFromAA": True,
        "AALink": "https://artificialanalysis.ai/evaluations/gpqa-diamond",
    },
    "livecodebench": {
        "name": "LiveCodeBench",
        "fullName": None,
        "publisher": "UC Berkeley & MIT & Cornell University",
        "description": "LiveCodeBench collects problems from periodic contests on LeetCode, AtCoder, and Codeforces platforms and uses them for constructing a holistic benchmark for evaluating Code LLMs across variety of code-related scenarios continuously over time",
        "link": "https://livecodebench.github.io/",
        "tags": ["Coding","LLM"],
        "metrics": {"unit": "pass@1(%)", "isBetterHigher": True},
        "isFromAA": True,
        "AALink": "https://artificialanalysis.ai/evaluations/livecodebench"
    },
    "scicode": {
        "name": "SciCode",
        "fullName": None,
        "publisher": "SciCode",
        "description": "A scientist-curated coding benchmark featuring 338 sub-tasks derived from 80 genuine laboratory problems across 16 scientific disciplines",
        "link": "https://scicode-bench.github.io/",
        "tags": ["Reasoning", "Knowledge", "LLM"],
        "metrics": {"unit": "pass@1(%)","isBetterHigher": True},
        "isFromAA": True,
        "AALink": "https://artificialanalysis.ai/evaluations/scicode"
    },
    "math_500": {
        "name": "MATH-500",
        "fullName": None,
        "publisher": "OpenAI",
        "description": "A 500-problem subset from the MATH dataset, featuring competition-level mathematics across six domains including algebra, geometry, and number theory",
        "link": "https://github.com/openai/prm800k",
        "tags": ["Reasoning", "Math"],
        "metrics": {"unit": "pass@1(%)", "isBetterHigher": True},
        "isFromAA": True,
        "AALink": "https://artificialanalysis.ai/evaluations/math-500"
    },
    "aime_25": {
        "name": "AIME 2025",
        "fullName": "2025 American Invitational Mathematics Examination",
        "publisher": "Artificial Analysis",
        "description": "All 30 problems from the 2025 American Invitational Mathematics Examination, testing olympiad-level mathematical reasoning with integer answers from 000-999",
        "link": "https://artificialanalysis.ai/evaluations/aime-2025",
        "tags": ["Olympic", "Math", "Reasoning"],
        "metrics": {"unit": "pass@1(%)", "isBetterHigher": True},
        "isFromAA": True,
        "AALink": "https://artificialanalysis.ai/evaluations/aime-2025"
    },
    "ifbench": {
        "name": "IFBench",
        "fullName": "Generalizing Verifiable Instruction Following",
        "publisher": "Allen Institute for AI (Ai2)",
        "description": "A benchmark evaluating precise instruction-following generalization on 58 diverse, verifiable out-of-domain constraints that test models' ability to follow specific output requirements",
        "link": "https://github.com/allenai/IFBench",
        "tags": ["Instruction-Following"],
        "metrics": {"unit": "pass@1(%)", "isBetterHigher": True},
        "isFromAA": True,
        "AALink": "https://artificialanalysis.ai/evaluations/ifbench"
    },
    "lcr": {
        "name": "LCR",
        "fullName": "Artificial Analysis Long Context Reasoning",
        "publisher": "Artificial Analysis",
        "description": "A challenging benchmark measuring language models' ability to extract, reason about, and synthesize information from long-form documents ranging from 10k to 100k tokens (measured using the cl100k_base tokenizer)",
        "link": "https://artificialanalysis.ai/evaluations/artificial-analysis-long-context-reasoning",
        "tags": ["Long-Context", "Reasoning"],
        "metrics": {"unit": "pass@1(%)", "isBetterHigher": True},
        "isFromAA": True,
        "AALink": "https://artificialanalysis.ai/evaluations/artificial-analysis-long-context-reasoning"
    },
    "terminalbench_hard": {
        "name": "Terminal-Bench Hard",
        "fullName": None,
        "publisher": "Stanford & Laude",
        "description": "An agentic benchmark evaluating AI capabilities in terminal environments through software engineering, system administration, and data processing tasks",
        "link": "https://www.tbench.ai/",
        "tags": ["Agent", "Terminal"],
        "metrics": {"unit": "pass@1(%)", "isBetterHigher": True},
        "isFromAA": True,
        "AALink": "https://artificialanalysis.ai/evaluations/terminalbench-hard"
    },
    "tau2": {
        "name": "𝜏²-Bench Telecom",
        "fullName": None,
        "publisher": "Sierra AI",
        "description": "A dual-control conversational AI benchmark simulating technical support scenarios where both agent and user must coordinate actions to resolve telecom service issues",
        "link": "https://taubench.com/#leaderboard",
        "tags": ["Reasoning", "Knowledge"],
        "metrics": {"unit": "pass@1(%)", "isBetterHigher": True},
        "isFromAA": True,
        "AALink": "https://artificialanalysis.ai/evaluations/tau2-bench"
    },
    
    
}

def slugify(text):
    if not text: return "unknown"
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-').strip('.')

def load_json_safe(path):
    if path.exists():
        try:
            with open(path, "r", encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    return {}

def save_json(path,data):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

def sync_llm_data():
    print("Start syncing llm data from Artificial Analysis...")

    if not AA_API_KEY:
        print("Error: No API KEY is available")
        sys.exit(1)

    try:
        print("Requesting data from Artificial Analysis...")
        response = requests.get(AA_LLM_URL, headers=HEADERS)
        response.raise_for_status()
        llmData = response.json().get("data") 
        print(f"Get {len(llmData)} model data")

    except Exception as e:
        print('Network error:',e)
        sys.exit(1)

    bench_results = {}
    today_str = datetime.now().strftime("%Y-%m-%d")

    for model in llmData:
        model_name = model.get("name")
        raw_model_slug = model.get("slug")

        publisher_name = model.get("model_creator", {}).get("name")
        raw_publisher_slug = model.get("model_creator",{}).get("slug")
        publisher_slug = slugify(raw_publisher_slug)

        model_slug = slugify(raw_model_slug)

        model_ref_id = f"{publisher_slug}/{model_slug}"
        
        # Update / Create Publisher information
        pub_file = PUB_DIR / f"{publisher_slug}.json"
        existing_pub = load_json_safe(pub_file)

        new_pub_data = {
                "name": publisher_name,
                "color": existing_pub.get("color", "#94a3b8"),
                "logo": existing_pub.get("logo","/logos/unknown.svg"),
                "website": model.get("model_creator", {}).get("website", "")
                }

        save_json(pub_file, new_pub_data)

        # Update / Create Model information
        model_dir = MODELS_DIR / publisher_slug
        model_file = model_dir / f"{model_slug}.json"
        existing_model = load_json_safe(model_file)

        new_model_data = {
                "name": model_name,
                "publisher": publisher_slug,
                "releaseDate": model.get("releaseDate", ""),
                "params": str(existing_model.get("params", "")),
                "license": existing_model.get("license",""),
                "website": existing_model.get("website",""),
                "discussionId": existing_model.get("discussionId","")
                }

        save_json(model_file, new_model_data)

        # Update / Create Benchmark information
        eval = model.get("evaluations", {})
        for bench_id, score in eval.items():
            if score is None: continue
            if bench_id == "aime": continue

            if bench_id not in bench_results:
                bench_results[bench_id] = []

            bench_results[bench_id].append({
                "modelRef": model_ref_id,
                "raw_score": float(score)
                })

    print("Updating benchmarks...")
    for bench_id, snapshot in bench_results.items():
        meta = BENCHMARK_METADATA.get(bench_id)
        
        max_score_in_bench = max(item["raw_score"] for item in snapshot)
        should_multiply = max_score_in_bench <= 1.0

        if not meta:
            print(f"Skipping unknown benchmark from API: {bench_id}")
            continue

        # Fixed logic: multiply 100 only when the biggest score <= 1.0 instead of each one
        for item in snapshot:
            final_score = item["raw_score"]
            if should_multiply:
                final_score *= 100

            item["score"] = round(final_score, 2)
            del item["raw_score"]

        bench_file = BENCH_DIR / f"{bench_id}.json"
        existing_bench_data = load_json_safe(bench_file)
        existing_trending = existing_bench_data.get("trending",{"views":0,"initialWeight":1000})

        output_data = {
                "name": meta["name"],
                "fullName": meta.get("fullName"),
                "publisher": meta.get("publisher"),
                "description": meta["description"],
                "link": meta["link"],
                "tags": meta["tags"],
                "lastUpdated": today_str,
                "metrics": meta["metrics"],
                "isFromAA": meta.get("isFromAA", False),
                "AALink": meta.get("AALink"),
                "trending": existing_trending,
                "snapshot": sorted(
                    snapshot,
                    key=lambda x: (x["score"], x["modelRef"]),
                    reverse=meta["metrics"].get("isBetterHigher", True)
                    )
                }

        def get_core_content(data):
            cp = data.copy()

            return cp.get("snapshot",None)

        if get_core_content(output_data) == get_core_content(existing_bench_data):
            output_data["lastUpdated"] = existing_bench_data.get("lastUpdated", today_str)
        else:
            print(f"Update occurs for {bench_id}")

        save_json(bench_file, output_data)

    print("Sync complete")

if __name__ == "__main__":
    sync_llm_data()
