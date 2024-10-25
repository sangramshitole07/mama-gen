import React, { useState } from 'react';
import ExerciseForm from '../components/ExerciseForm';
import ResultDisplay from '../components/ResultDisplay';
import { exerciseRecommendation } from '../api/exerciseApi';

const ExerciseRecommender = () => {
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      const recommendation = await exerciseRecommendation(data);
      setResult(recommendation);
    } catch (error) {
      console.error('Error getting recommendation:', error);
      setResult('An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <ExerciseForm onSubmit={handleSubmit} />
      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default ExerciseRecommender;