import json
import os

TARGET_FOLDER = f"../src/content/benchmarks"
for root, dirs, files in os.walk(TARGET_FOLDER):
    for file in files:
        file_path = os.path.join(root,file)
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                original_data = json.load(f)

            snapshot = original_data.get("snapshot")
            for model in snapshot:
                if model.get("modelRef") == "zai/glm-4.5":
                    model["modelRef"] = "zai/glm-4-5"
                if model.get("modelRef") == "alibaba/QwQ-32B-Preview":
                    model["modelRef"] = "alibaba/qwq-32b-preview"
                if model.get("modelRef") == "alibaba/qwen2.5-32b-instruct":
                    model["modelRef"] = "alibaba/qwen2-5-32b-instruct"
                if model.get("modelRef") == "alibaba/qwen3-1.7b-instruct-reasoning":
                    model["modelRef"] = "alibaba/qwen3-1-7b-instruct-reasoning"
                if model.get("modelRef") == "alibaba/qwen1.5-110b-chat":
                    model["modelRef"] = "alibaba/qwen1-5-110b-chat"
                if model.get("modelRef") == "alibaba/qwen3-1.7b-instruct":
                    model["modelRef"] = "alibaba/qwen3-1-7b-instruct"
                if model.get("modelRef") == "alibaba/qwen3-0.6b-instruct-reasoning":
                    model["modelRef"] = "alibaba/qwen3-0-6b-instruct-reasoning"
                if model.get("modelRef") == "alibaba/qwen3-0.6b-instruct":
                    model["modelRef"] = "alibaba/qwen3-0-6b-instruct"

            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(original_data, f, indent=4, ensure_ascii=False)
        except json.JSONDecodeError:
            print(f"Error with file: {file_path}")
