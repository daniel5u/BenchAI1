## Overview

τ²-Bench (Tau-squared Bench), developed by Sierra AI, introduces a unique **dual-control** evaluation framework. Unlike single-agent benchmarks, τ²-Bench simulates complete customer service interactions requiring coordinated action between AI systems.

## Dual-Control Concept

Traditional benchmarks evaluate a single AI agent. τ²-Bench introduces:

| Role | Description |
|------|-------------|
| **AI Agent** | Represents the customer service representative |
| **AI User** | Simulates the customer with a technical issue |
| **Coordination** | Both AIs must work together to resolve the issue |

## Scenario Structure

Each interaction involves:

1. **Customer Issue Presentation**: AI User describes a telecom problem
2. **Agent Diagnosis**: AI Agent asks questions to understand the issue
3. **Guided Resolution**: Agent provides instructions to resolve the problem
4. **Execution**: User confirms whether actions solved the problem

## Telecom Domain Focus

The benchmark focuses specifically on **telecom service issues**, including:

| Category | Examples |
|----------|----------|
| **Connectivity** | Internet connection problems, WiFi issues |
| **Billing** | Payment processing, invoice disputes |
| **Service Changes** | Plan modifications, feature requests |
| **Technical Support** | Device configuration, troubleshooting |

## Evaluation Dimensions

Models are evaluated on:

- **Problem Understanding**: Correctly identifying the customer's issue
- **Communication Quality**: Clear, helpful customer service interactions
- **Technical Accuracy**: Providing correct solutions
- **Resolution Rate**: Successfully resolving customer issues
- **Efficiency**: Number of interactions needed for resolution

## Purpose

τ²-Bench evaluates whether AI systems can function as effective **customer service agents** capable of handling real-world support scenarios through natural conversation.

---

*Source: [Tau²-Bench](https://taubench.com/#leaderboard)*
