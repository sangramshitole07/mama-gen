import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { DailyEntry } from '../types/tracker';
import { predictProductivityTrend, analyzePatterns } from '../ml/modelService';
import { TrendingUp, Activity, Brain } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  entries: DailyEntry[];
}

export const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  const [productivityData, setProductivityData] = useState<any>(null);
  const [patterns, setPatterns] = useState<any>(null);

  useEffect(() => {
    const analyzeData = async () => {
      if (entries.length > 0) {
        const predictions = await predictProductivityTrend(entries);
        const patternAnalysis = analyzePatterns(entries);
        
        setProductivityData(predictions);
        setPatterns(patternAnalysis);
      }
    };
    
    analyzeData();
  }, [entries]);

  const productivityChartData = {
    labels: productivityData?.map((d: any) => format(d.date, 'MMM d')) || [],
    datasets: [
      {
        label: 'Actual Productivity',
        data: productivityData?.map((d: any) => d.actual) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Predicted Trend',
        data: productivityData?.map((d: any) => d.predicted) || [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const patternsChartData = {
    labels: patterns?.map((d: any) => format(d.date, 'MMM d')) || [],
    datasets: [
      {
        label: 'Mood Trend (7-day average)',
        data: patterns?.map((d: any) => d.moodAverage) || [],
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      },
      {
        label: 'Stress Trend (7-day average)',
        data: patterns?.map((d: any) => d.stressAverage) || [],
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold">Productivity Score</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {productivityData ? 
              `${(productivityData[productivityData.length - 1]?.actual * 100).toFixed(1)}%` : 
              'N/A'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Activity className="h-6 w-6 text-green-500 mr-2" />
            <h3 className="text-lg font-semibold">Stress Level</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {patterns ? 
              `${(patterns[patterns.length - 1]?.stressAverage * 100).toFixed(1)}%` : 
              'N/A'}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Brain className="h-6 w-6 text-purple-500 mr-2" />
            <h3 className="text-lg font-semibold">Mood Index</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {patterns ? 
              `${(patterns[patterns.length - 1]?.moodAverage * 100).toFixed(1)}%` : 
              'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Productivity Trend Analysis</h3>
          {productivityData && (
            <Line
              data={productivityChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' },
                  title: { display: false }
                }
              }}
            />
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Mood & Stress Patterns</h3>
          {patterns && (
            <Line
              data={patternsChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' },
                  title: { display: false }
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};