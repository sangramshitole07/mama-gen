import React from 'react';
import { Salad } from 'lucide-react';

interface ResultDisplayProps {
  result: string;
}

const ResultDisplays: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Salad className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Your Diet Recommendations</h2>
      </div>
      
      <div className="whitespace-pre-wrap text-gray-700">
        {result}
      </div>
    </div>
  );
};

export default ResultDisplays;