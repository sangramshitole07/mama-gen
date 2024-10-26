import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Activity } from 'lucide-react';
import Navigation from './components/Navigation';
import ExerciseRecommender from './pages/ExerciseRecommender';
import HRDashboard from './pages/HRDashboard';
import ResourceLibrary from './pages/ResourceLibrary';
import ForumPage from './pages/ForumPage';
import ErgonomicAdvice from './pages/ErgonomicAdvice';
import DietRecommender from './pages/DietRecommender';
//import { AuthForms } from './components/AuthForms';

import { Forum } from './components/Forum';
import DietForm from './components/DietForm';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <Activity className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800">Pregnancy Wellness Hub</h1>
          <p className="text-xl text-gray-600 mt-2">Supporting healthy pregnancies in the workplace</p>
        </header>

       

        <Routes>
          <Route path="/" element={<ExerciseRecommender />} />
          <Route path="/hr-dashboard" element={<HRDashboard />} />
          <Route path="/resources" element={<ResourceLibrary />} />
          <Route path="/communication" element={<ForumPage />} />
          <Route path="/ergonomics" element={<ErgonomicAdvice />} />
          <Route path="/Diet " element={<DietRecommender />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
