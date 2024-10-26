export interface DietFormData {
    trimester: 'First' | 'Second' | 'Third';
    dietType: 'Veg' | 'Non Veg';
  }
  
  export interface Message {
    role: 'user' | 'ai';
    content: string;
  }
  
  export interface DietRecommendation {
    recommendations: string[];
  }