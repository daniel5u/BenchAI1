export interface PublisherInfo {
  color: string;
  logo: string;
}

export const PUBLISHER_REGISTRY: Record<string, PublisherInfo> = {
  "OpenAI":{
    color:"#1f1f1f",
    logo:"/logos/openai.svg"
  },
  "Google":{
    color:"#34a853",
    logo:"/logos/google.svg"
  },
  "Anthropic": {
    color: "#cc785c",
    logo: "/logos/anthropic.svg"
  },
  "Meta": {
    color: "#0668E1",
  	logo: "/logos/meta.svg"
  },
  "Mistral": {
    color: "#FD7E14", 
    logo: "/logos/mistral.svg"
  },
  "DeepSeek": {
    color: "#2243e6",
    logo: "/logos/deepseek.svg"
  },
  "Kimi":{
    color: "#047afe",
    logo: "/logos/kimi.svg"
  },
  "Grok":{
    color: "#736cd3",
    logo: "/logos/grok.svg"
  },
  "MiniMax":{
    color: "#eb3568",
    logo: "/logos/minimax.svg"
  },
  "Qwen":{
    color: "#623ce5",
    logo: "/logos/qwen.svg"
  },
  "Nvidia":{
    color: "#86b737",
    logo: "/logos/nvidia.svg"
  },
  "Zai":{
    color: "#1c7ff8",
    logo: "/logos/zai.svg"
  },
  "Microsoft":{
    color: "#74b71b",
    logo: "/logos/microsoft.svg"
  },
  "AWS":{
    color: "#ff9900",
    logo: "/logos/aws.svg"
  },
  "ByteDance":{
    color: "#74e1de",
    logo: "/logos/bytedance.svg"
  }
};

export const DEFAULT_PUBLISHER: PublisherInfo = {
  color:"#94a3b8",
  logo:"logos/generics.svg"
}