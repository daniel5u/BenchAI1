import json
import os

PUBLISHER_REGISTRY = {
  "OpenAI": {
    "color": "#1f1f1f",
    "logo": "/logos/openai.svg"
  },
  "Google": {
    "color": "#34a853",
    "logo": "/logos/google.svg"
  },
  "Anthropic": {
    "color": "#cc785c",
    "logo": "/logos/anthropic.svg"
  },
  "Meta": {
    "color": "#0668E1",
    "logo": "/logos/meta.svg"
  },
  "Mistral": {
    "color": "#FD7E14",
    "logo": "/logos/mistral.svg"
  },
  "DeepSeek": {
    "color": "#2243e6",
    "logo": "/logos/deepseek.svg"
  },
  "Kimi": {
    "color": "#047afe",
    "logo": "/logos/kimi.svg"
  },
  "xAI": {
    "color": "#736cd3",
    "logo": "/logos/xai.svg"
  },
  "MiniMax": {
    "color": "#eb3568",
    "logo": "/logos/minimax.svg"
  },
  "Qwen": {
    "color": "#623ce5",
    "logo": "/logos/qwen.svg"
  },
  "Nvidia": {
    "color": "#86b737",
    "logo": "/logos/nvidia.svg"
  },
  "Zai": {
    "color": "#1c7ff8",
    "logo": "/logos/zai.svg"
  },
  "Microsoft": {
    "color": "#74b71b",
    "logo": "/logos/microsoft.svg"
  },
  "AWS": {
    "color": "#ff9900",
    "logo": "/logos/aws.svg"
  },
  "ByteDance": {
    "color": "#74e1de",
    "logo": "/logos/bytedance.svg"
  }
}


DEFAULT_INFO = {
    "color": "#94a3b8",
    "logo": "/logos/unknown.svg"
}

def migrate():
    folder_path = "../src/content/publishers"
    
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
    
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
            name = data.get("name")
            
            if name in PUBLISHER_REGISTRY:
                print(f"Found publisher: {name}")
                info = PUBLISHER_REGISTRY[name]
                
                data["color"] = info["color"]
                data["logo"] = info["logo"]

        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

if __name__ == "__main__":
    migrate()