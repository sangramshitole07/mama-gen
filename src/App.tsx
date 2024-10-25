import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Activity } from 'lucide-react';
import Navigation from './components/Navigation';
import ExerciseRecommender from './pages/ExerciseRecommender';
import HRDashboard from './pages/HRDashboard';
import ResourceLibrary from './pages/ResourceLibrary';
import CommunicationHub from './pages/CommunicationHub';
import ErgonomicAdvice from './pages/ErgonomicAdvice';

function App() {
  return (
    <Router>
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
            <Route path="/communication" element={<CommunicationHub />} />
            <Route path="/ergonomics" element={<ErgonomicAdvice />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;