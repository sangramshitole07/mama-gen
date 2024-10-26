import * as tf from '@tensorflow/tfjs';
import { DailyEntry } from '../types/tracker';

const MOOD_MAPPING = {
  'Very Positive': 1,
  'Positive': 0.75,
  'Neutral': 0.5,
  'Negative': 0.25,
  'Very Negative': 0
};

const STRESS_MAPPING = {
  'Very Low Stress': 0,
  'Low Stress': 0.25,
  'Moderate Stress': 0.5,
  'High Stress': 0.75,
  'Very High Stress': 1
};

// Preprocesses input data by mapping mood and stress levels to numerical values
export const preprocessData = (entries: DailyEntry[]) => {
  return entries.map(entry => ({
    moodScore: MOOD_MAPPING[entry.moodLevel as keyof typeof MOOD_MAPPING] ?? 0.5,
    stressScore: STRESS_MAPPING[entry.stressLevel as keyof typeof STRESS_MAPPING] ?? 0.5,
    date: new Date(entry.date)
  }));
};

// Predicts productivity trend based on mood and stress levels using a linear regression model with improvements
export const predictProductivityTrend = async (entries: DailyEntry[]) => {
  const processedData = preprocessData(entries);

  // Normalize inputs
  const moodScores = processedData.map(d => d.moodScore);
  const stressScores = processedData.map(d => d.stressScore);
  const maxMoodScore = Math.max(...moodScores);
  const maxStressScore = Math.max(...stressScores);

  const normalizedData = processedData.map(d => ({
    moodScore: d.moodScore / maxMoodScore,
    stressScore: d.stressScore / maxStressScore,
    date: d.date
  }));

  // Create a more complex model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 10, inputShape: [2], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 10, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));

  // Prepare training data
  const xs = tf.tensor2d(normalizedData.map(d => [d.moodScore, d.stressScore]));
  const ys = tf.tensor2d(processedData.map((_, i) => [i / processedData.length]));

  // Train the model with a higher epoch count and validation split
  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  await model.fit(xs, ys, { epochs: 100, batchSize: 4, validationSplit: 0.2 });

  // Make predictions
  const predictions = model.predict(xs) as tf.Tensor;
  const predictedValues = (await predictions.array()) as number[][];

  // Cleanup
  model.dispose();
  xs.dispose();
  ys.dispose();
  predictions.dispose();

  return predictedValues.map((pred: number[], i) => ({
    date: processedData[i].date,
    actual: processedData[i].moodScore,
    predicted: pred[0] ?? 0
  }));
};

// Analyzes mood and stress patterns by calculating a moving average for a given window size
export const analyzePatterns = (entries: DailyEntry[]) => {
  const processedData = preprocessData(entries);

  // Calculate moving averages
  const windowSize = 7;
  const movingAverages = processedData.map((_, index, array) => {
    if (index < windowSize - 1) return null;

    const window = array.slice(index - windowSize + 1, index + 1);
    const moodAvg = window.reduce((sum, entry) => sum + entry.moodScore, 0) / windowSize;
    const stressAvg = window.reduce((sum, entry) => sum + entry.stressScore, 0) / windowSize;

    return {
      date: array[index].date,
      moodAverage: moodAvg,
      stressAverage: stressAvg
    };
  }).filter((average): average is NonNullable<typeof average> => average !== null);

  return movingAverages;
};
