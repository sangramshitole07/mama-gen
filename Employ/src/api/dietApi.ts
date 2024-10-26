import axios from 'axios';
import { DietFormData } from '../services/diet';

const API_URL = 'http://localhost:3000/api/chat';

// Define DietRecommendation as a const function
const DietRecommendation = async (
  data: DietFormData
): Promise<string> => {
  try {
    const promptMessage = `Please provide a detailed, structured diet recommendation for a pregnant woman in the ${data.trimester.toLowerCase()} trimester following a ${data.dietType.toLowerCase()} diet. Include specific foods, nutrients, and meal timing suggestions.`;

    const response = await axios.post(API_URL, {
      messages: [{ role: 'user', content: promptMessage }],
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return the response data
    return response.data;
  } catch (error) {
    console.error('Error in getDietRecommendation:', error);
    throw new Error('Failed to get diet recommendation. Please try again.');
  }
};

// Export the module
export default DietRecommendation;
