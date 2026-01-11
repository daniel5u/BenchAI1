import json
import os

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

def process_benchmarks():
    # Read the raw data
    with open("aa_data.json", "r", encoding="utf-8") as f:
        model_list = json.load(f)
        
        # We also have to store all the models
        processed_models_set = set()
        processed_publisher_set = set()
        
        # Create a dict for every model's score
        # Format: {"bench_name_1": [{model_data_1},{model_data_2},...], "bench_name_2": [..], ...}
        bench_results = {}
    
        for model in model_list:
            model_name = model.get("name")
            model_slug = model.get("slug")
            
            publisher = model.get("model_creator", {}).get("name")
            publisher_slug = model.get("model_creator", {}).get("slug")
            
            evals = model.get("evaluations", {})
            
            model_ref_id = f"{publisher_slug}/{model_slug}"
            
            if model_ref_id not in processed_models_set:
                model_pubPre_dir = f"../src/content/models/{publisher_slug}"
                os.makedirs(model_pubPre_dir, exist_ok=True)
                
                model_file_path = f"{model_pubPre_dir}/{model_slug}.json"
            
                model_meta = {
                    "name": model_name,
                    "publisher": publisher_slug,
                    "params": model.get("params",""),
                    "license": model.get("license",""),
                    "website": model.get("link",""),
                    "discussionId": ""
                }
                
                with open(model_file_path, "w", encoding="utf-8") as mf:
                    json.dump(model_meta, mf, indent=4, ensure_ascii=False)
            
                processed_models_set.add(model_ref_id)
            
            if publisher_slug not in processed_publisher_set:
                publisher_dir = f"../src/content/publishers/{publisher_slug}.json"
                
                publisher_meta = {
                    "name": publisher
                }
                
                with open(publisher_dir,"w",encoding="utf-8") as pf:
                    json.dump(publisher_meta, pf, indent=4, ensure_ascii=False)
                
                processed_publisher_set.add(publisher_slug)
                
            
            # For every model, add the score to each benchmark
            for bench_id, score in evals.items():
                if score is None:
                    continue
                if bench_id not in bench_results and bench_id != "aime":
                    bench_results[bench_id] = []
                
                # Convert score to [0,100]    
                display_score = score * 100 if score <= 1.0 else score
                
                if bench_id != "aime":
                    # Add the score
                    bench_results[bench_id].append({
                        "modelRef": model_ref_id,
                        "score": round(display_score,2)
                    })
                
        for bench_id, snapshot in bench_results.items():
            meta = BENCHMARK_METADATA.get(bench_id, {})
            
            if "name" not in meta:
                print("missing name",meta)
                continue
            
            output_data = {
                "name": meta["name"],
                "fullName": meta["fullName"],
                "publisher": meta["publisher"],
                "description": meta["description"],
                "link": meta["link"],
                "tags": meta["tags"],
                "lastUpdated": "2026-01-07",
                "metrics": meta["metrics"],
                "trending": {"views": 0, "initialWeight": 1000},
                "snapshot": sorted(snapshot, key=lambda x: x["score"], reverse=True),
                "isFromAA": meta["isFromAA"],
                "AALink": meta["AALink"]
            }
            
            file_name = f"../src/content/benchmarks/{bench_id}.json"
            with open(file_name, "w", encoding="utf-8") as outfile:
                json.dump(output_data, outfile, indent=4, ensure_ascii=False)
                print(f"Successfully saved info of {bench_id} with location: {file_name}")

if __name__ == "__main__":
    process_benchmarks()
        
