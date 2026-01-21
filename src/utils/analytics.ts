import { getCollection } from 'astro:content';

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

export async function getModelStats(targetModelId: string): Promise<ModelStats> {
  // Get all benchmarks
  const allBenchmarks = await getCollection('benchmarks');

  // Store the score with respect to benchmarks like {"Reasoning": [80,90], "Coding": [70]}
  const categoryScores: Record<string, number[]> = {};
  const participatedBenchmarks: ModelStats['participatedBenchmarks'] = [];

  let totalScoreSum = 0;
  let count = 0;

  for (const bench of allBenchmarks) {
    // Try to find the score for the model in `bench`
    const result = bench.data.snapshot.find(r => r.modelRef.id === targetModelId);

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
        tags: bench.data.tags
      });

      // Record the score with respect to tag
      for (const tag of bench.data.tags) {
        categoryScores[tag] ??= [];
        categoryScores[tag].push(score)
      }
    }
  }

  // Compute average score for tag
  // Turn { "Reasoning": [80,90] } into { subject: "Math", A:85, fullMark: 100 }
  const radarData: RadarDataPoint[] = Object.entries(categoryScores).map(([tag, scores]) => {
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = Math.round(sum / scores.length);
    return {
      subject: tag,
      A: avg,
      fullMark: 100
    };
  });

  const globalAverage = count > 0 ? Math.round(totalScoreSum / count) : 0;

  return {
    modelId: targetModelId,
    totalBenchmarks: count,
    averageScore: globalAverage,
    radarData: radarData,
    participatedBenchmarks: participatedBenchmarks.sort((a, b) => b.score - a.score) // Sort the benchmark by score
  };
}
