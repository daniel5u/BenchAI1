import { getCollection } from "astro:content";
import { BENCH_CATEGORIES } from "../consts";

export interface RadarDataPoint {
  subject: string;
  A: number;
  fullMark: 100;
}

export interface ModelStats {
  modelId: string;
  totalBenchmarks: number;
  averageScore: number;
  radarData: RadarDataPoint[];
  participatedBenchmarks: Array<{
    id: string;
    name: string;
    score: number;
    tags: string[];
  }>;
}

export async function getModelStats(
  targetModelId: string,
): Promise<ModelStats> {
  // Get all benchmarks
  const allBenchmarks = await getCollection("benchmarks");

  // Store the score with respect to benchmarks like {"Reasoning": [80,90], "Coding": [70]}
  const categoryScores: Record<string, number[]> = {};
  for (const cat of BENCH_CATEGORIES) {
    categoryScores[cat] = [];
  }

  const participatedBenchmarks: ModelStats["participatedBenchmarks"] = [];

  let totalScoreSum = 0;
  let count = 0;

  for (const bench of allBenchmarks) {
    // Try to find the score for the model in `bench`
    const result = bench.data.snapshot.find(
      (r) => r.modelRef.id === targetModelId,
    );

    if (result) {
      const score = result.score;

      // Record the score
      totalScoreSum += score;
      count++;

      // Record the benchmark for model
      participatedBenchmarks.push({
        id: bench.id,
        name: bench.data.name,
        score: score,
        tags: bench.data.tags,
      });

      // Record the score with respect to tag
      for (const tag of bench.data.tags) {
        if (tag in categoryScores) {
          categoryScores[tag].push(score);
        }
      }
    }
  }

  // Compute average score for tag
  // Turn { "Reasoning": [80,90] } into { subject: "Math", A:85, fullMark: 100 }
  const radarData: RadarDataPoint[] = BENCH_CATEGORIES.map((category) => {
    const scores = categoryScores[category];

    let avg = 0;
    if (scores.length > 0) {
      const sum = scores.reduce((a, b) => a + b, 0);
      avg = Math.round(sum / scores.length);
    }

    return {
      subject: category,
      A: avg,
      fullMark: 100,
    };
  });

  const globalAverage = count > 0 ? Math.round(totalScoreSum / count) : 0;

  return {
    modelId: targetModelId,
    totalBenchmarks: count,
    averageScore: globalAverage,
    radarData: radarData,
    participatedBenchmarks: participatedBenchmarks.sort(
      (a, b) => b.score - a.score,
    ), // Sort the benchmark by score
  };
}
