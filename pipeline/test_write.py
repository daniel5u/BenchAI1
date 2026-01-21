import json
from pathlib import Path
from models import Benchmark, Metrics, SnapshotItem, Trending

def save_benchmark(data: Benchmark):
    # 1.Confirm the base path
    base_path = Path(__file__).parent.parent / "src" / "content" / "benchmarks"
    
    # 2.Set the saved file path
    file_name = f"{data.name.lower().replace(' ','-')}.json"
    file_path = base_path / file_name
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(data.model_dump_json(indent=2))
    
    print(f"Successfully saved: {file_path}")
    
if __name__ == "__main__":
    sample_data = Benchmark(
        name="GSM8K",
        fullName="Grade School Math",
        publisher="OpenAI",
        description="A dataset of 8.5K high quality linguistically diverse grade school math word problems.",
        link="https://github.com/openai/grade-school-math",
        tags=["Math", "Reasoning", "LLM"],
        lastUpdated="2024-12-30",
        metrics=Metrics(unit="Accuracy(%)", isBetterHigher=True),
        trending=Trending(initialWeight=2000),
        snapshot=[
            SnapshotItem(model="GPT-4o", score=94.2, publisher="OpenAI"),
            SnapshotItem(model="Claude 3.5 Sonnet", score=92.0, publisher="Anthropic"),
            SnapshotItem(model="Llama 3 70B", score=82.5, publisher="Meta")
        ]
    )
    
    save_benchmark(sample_data)