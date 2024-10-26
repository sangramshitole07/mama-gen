import React from 'react'; 
import { DietFormData } from '../services/diet';

interface DietFormProps {
  onSubmit: (data: DietFormData) => void; // Ensure the function type is correct
  isLoading: boolean;
}

const DietForm: React.FC<DietFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = React.useState<DietFormData>({
    trimester: 'First',
    dietType: 'Non Veg',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <div>
          <label htmlFor="trimester" className="block text-sm font-medium text-gray-700">
            Trimester
          </label>
          <select
            id="trimester"
            value={formData.trimester}
            onChange={(e) => setFormData(prev => ({ ...prev, trimester: e.target.value as DietFormData['trimester'] }))}
            className="form-select"
            disabled={isLoading}
          >
            <option value="First">First</option>
            <option value="Second">Second</option>
            <option value="Third">Third</option>
          </select>
        </div>

        <div>
          <label htmlFor="dietType" className="block text-sm font-medium text-gray-700">
            Diet Type
          </label>
          <select
            id="dietType"
            value={formData.dietType}
            onChange={(e) => setFormData(prev => ({ ...prev, dietType: e.target.value as DietFormData['dietType'] }))}
            className="form-select"
            disabled={isLoading}
          >
            <option value="Veg">Vegetarian</option>
            <option value="Non Veg">Non-Vegetarian</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Getting Recommendations...' : 'Get Diet Recommendation'}
      </button>
    </form>
  );
};

export default DietForm;
