## Overview

SWE-bench, developed by researchers at Princeton University and the University of Chicago, evaluates AI models on real-world software engineering tasks. The "Bash Only" variant focuses specifically on shell script and command-line based fixes.

## Core Challenge

Given:
1. A **codebase** (real software project)
2. A **GitHub issue** describing a problem or feature request

The model must:
1. Understand the issue description
2. Navigate and understand the codebase
3. **Generate a patch** that fixes the problem

## What Makes SWE-bench Challenging

| Aspect | Challenge |
|--------|-----------|
| **Context Understanding** | Must comprehend large codebases |
| **Problem Analysis** | Debugging skills from issue descriptions |
| **Solution Design** | Architecture and design considerations |
| **Code Generation** | Writing correct, maintainable code |
| **Testing** | Ensuring fixes don't break existing functionality |

## Dataset Characteristics

- **Source**: Real GitHub repositories
- **Issues**: Actual bug reports and feature requests
- **Complexity**: Varied difficulty from simple fixes to complex features
- **Language Focus**: Primarily Python and shell scripting for "Bash Only" variant

## Evaluation Methodology

Models are evaluated on:

- **Patch Acceptance**: Does the generated patch fix the issue?
- **Test Passing**: Do existing tests still pass?
- **Code Quality**: Is the fix clean and maintainable?
- **Commit Accuracy**: Does the fix address only what's needed?

## Purpose

SWE-bench assesses whether AI models can function as **software engineering assistants**, capable of:

- Understanding real-world codebases
- Debugging existing code
- Implementing new features
- Contributing meaningfully to software projects

---

*Source: [SWE-bench](https://www.swebench.com/)*
