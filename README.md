# Bench All In One: An open-source hub for artificial intelligence benchmarks

<div align="center">

> **Community-Driven AI Benchmark Ecosystem.**
> Track SOTA models, visualize capabilities via Radar Charts, and explore the AI landscape with automated daily updates.

<br />

[![Built with Astro](https://img.shields.io/badge/Built_with-Astro-ff5a1f.svg)](https://astro.build)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000.svg)](https://vercel.com)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Discord Channel](https://img.shields.io/badge/Discord-Join_Server-5865F2?logo=discord&logoColor=white)](https://discord.gg/y5hgGZjq)

<br/>

[**Live Demo**](https://bench-ai-1-apzt.vercel.app/) | [**Report Bug**](https://github.com/daniel5u/BenchAI1/issues) | [**Request Feature**](https://github.com/daniel5u/BenchAI1/discussions)

</div>

## Introduction
**BenchAI1 is an open-source hub which collects benchmarks in artificial intelligence. It tries to collect as many benchmarks as possible for everyone to find their best model.**

I have tried different websites for AI benchamrk, all of them disappoints me at some aspect, so I decided to build BenchAI1 with following features:

- **Open-source data collection:** All the benchmark results are collected from official websites of benchmark / professional evaluation platform (like Artificial Analysis).
- **Automated Pipelines**: Most of the benchmark results are maintained by automated pipeline through **GitHub Actions** and Python scripts. The daily synchronization will make the data always up to date.
- **Interactive Leaderboards**: Filter, search and sort models with client-side interactivity.
- **Community Driven**: BenchAI1 tries to build up a community where people explore reasonable, professional or interesting benchmark to fully examine the capability of artificial intelligence.

## Tech Stack

The stack of this project aims to be simple but comprehensive:

- **Framework**: [Astro 5.0](https://astro.build/) (Static Site Generation)
- **UI Components**: [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Automation & Scripting**: Python (managed by `uv`)
- **CI/CD**: GitHub Actions (Cron Jobs for data sync)
- **Data Source**: JSON (For most data about benchmark/model/publisher) + MDX/MD (For benchmark document)

## Getting Started

### Prerequisites

- Node.js & npm/bun
- Python 3.10+ (with `uv` recommended)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/daniel5u/BenchAI1.git
cd BenchAI1
```

2. **Install dependencies**

```bash
bun install
```

3. **Set up Python environment (for data sync scripts)**
```bash
cd pipeline
uv sync
```

4. **Start Development Server**
```bash
bun dev
```
Visit `http://localhost:4321` to see the app.

## Data Synchronization

The data sync pipeline ensures the benchmark result is always up-to-date

- **Location**: `/pipeline/` (There are different scripts data for different data source)

Run the sync manually:
```bash
cd pipeline
uv run [specific_script].py
```

## Contributing

Contributions are welcomed! You can upload your own benchmark / your own model with scores / your improvement on the structure of the project, whether frontend or data structure

- **Upload your own benchmark**: ***Any benchmark should contain no less than 5 models to make it valid***. Simply write the corresponding `/src/content/benchamrks/your_benchmark.json` to include the benchamrk's name, matrix, data and so on, and the `/src/content/benchmark-docs/your_doc.mdx(or .md)` to describe any detailed information about your benchamrk.
- **Make sure the model reference is valid**: All models are stored in `/src/content/models` with respect to their publisher (for example, gpt-4 will be stored as `/src/content/models/openai/gpt-4.json`), if there are any problem with model (incorrect name, params and so on), open an issue to correct the information. 
- **Project improvement**: I am a total rookie to dev, so if you have any idea about *improving UI&UX about the pages*, *adding more function to the project*, *any other suggestions*, feel free to open an issue / pull request / discussion.

## License
This project is licensed under the **GNU General Public License v3.0**.
See the [LICENSE](LICENSE) file for details.

## TODOS:

I am constantly improving BenchAI1 to make it the best place for AI evaluation insights.

- [ ] **Comparison Function**: Add the `comparison` function between different models / publishers.
- [ ] **View Tracking**: The popularity(`view`) of different benchmarks are supposed to be tracked somehow, I am finding the best way, probably buying a NAS and deploy a redis server...
- [ ] **Community Setup**: Since the project aims to build up a complete community for AI evaluation, I am planning to :
    - set up a discord channel, where people can share their own benchmark, receive latest update, communicate model capabilities and so on.
    - set up subscription service, which sends email to users about the latest update / latest SOTA / latest model (customized by user).
- [ ] **Internationalization (i18n)**: Support various language for global AI community.
- [ ] **More Data Source**: Integrate as many data source as possible with auto sync.

Have an idea? [Open an issue](https://github.com/daniel5u/BenchAI1/issues) to discuss!
