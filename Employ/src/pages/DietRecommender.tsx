import React, { useState } from 'react';
import DietForm from '../components/DietForm'; // Adjust the path as necessary
import ResultDisplay from '../components/ResultDisplays'; // Adjust the path as necessary
// Ensure this path is correct
import { DietFormData } from '../services/diet'; // Ensure this path is correct
import DietRecommendation from '../api/dietApi';

const DietRecommendationComponent: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // For loading state
  const [error, setError] = useState<string | null>(null); // To handle errors

  const handleSubmit = async (data: DietFormData) => {
    setIsLoading(true);
    setError(null); // Clear any previous errors
    try {
      const recommendation = await DietRecommendation(data); // Call the API with the diet data
      setResult(recommendation); // Set the recommendation result
    } catch (error) {
      console.error('Error getting recommendation:', error);
      setError('An error occurred. Please try again.'); // Set error message
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Diet Recommendation</h1>
      <DietForm onSubmit={handleSubmit} isLoading={isLoading} /> {/* Pass loading state to DietForm */}
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      {result && <ResultDisplay result={result} />} {/* Display the recommendation */}
    </div>
  );
};

export default DietRecommendationComponent;
