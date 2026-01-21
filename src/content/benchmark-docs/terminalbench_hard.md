## Overview

Terminal-Bench Hard, developed by researchers at Stanford University and Laude, evaluates AI agents in realistic terminal/shell environments. It tests whether AI models can effectively use command-line tools and navigate complex computing environments.

## Task Categories

The benchmark evaluates AI performance across three major domains:

| Category | Task Examples |
|----------|--------------|
| **Software Engineering** | Git operations, debugging, code review, refactoring |
| **System Administration** | User management, service configuration, monitoring |
| **Data Processing** | File manipulation, data transformation, scripting |

## Difficulty Levels

Terminal-Bench Hard presents challenges at multiple difficulty tiers:

| Level | Description |
|-------|-------------|
| **Easy** | Single command operations, simple scripts |
| **Medium** | Multi-step workflows, conditional logic |
| **Hard** | Complex projects, debugging production issues |

## What Makes Terminal-Bench Hard

1. **Realistic Environments**: Simulates actual Linux/Unix terminals
2. **Tool Diversity**: Requires using multiple CLI tools
3. **Context Management**: Maintaining state across operations
4. **Error Recovery**: Handling command failures gracefully

## Evaluation Criteria

Models are evaluated on:

- **Command Correctness**: Do commands achieve the desired outcome?
- **Efficiency**: Number of commands/attempts needed
- **Script Quality**: For generated scripts and programs
- **Debugging Ability**: Finding and fixing issues
- **Completion Rate**: Successfully completing assigned tasks

## Example Tasks

- "Debug and fix the failing test suite"
- "Configure a web server with SSL certificates"
- "Migrate data from CSV to database format"
- "Set up a CI/CD pipeline for a project"

## Purpose

Terminal-Bench Hard assesses whether AI models can serve as **effective terminal-based agents** - capable of automating workflows, assisting developers, and managing systems through natural language commands.

---

*Source: [T-Bench](https://www.tbench.ai/)*
