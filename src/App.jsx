import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import PatientScreening from './pages/PatientScreening';
import RegionalIntelligence from './pages/RegionalIntelligence';
import PatientsList from './pages/PatientsList';
import PriorityQueue from './pages/PriorityQueue';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/Login';
import DoctorReview from './pages/DoctorReview';
import FinalReport from './pages/FinalReport';
import HealthSystem from './pages/HealthSystem';
import Preloader from './components/Preloader';
import CareConversionDashboard from './pages/CareConversion/CareConversionDashboard';
import CareConversionProfile from './pages/CareConversion/CareConversionProfile';
import './App.css';

function App() {
  // Show preloader once per browser session
  const [showPreloader, setShowPreloader] = useState(
    () => !sessionStorage.getItem('preloader_shown')
  );

  const handlePreloaderDone = () => {
    sessionStorage.setItem('preloader_shown', '1');
    setShowPreloader(false);
  };

  if (showPreloader) {
    return <Preloader onDone={handlePreloaderDone} />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/screening" element={<PatientScreening />} />
      <Route path="/intelligence" element={<RegionalIntelligence />} />
      <Route path="/patients" element={<PatientsList />} />
      <Route path="/queue" element={<PriorityQueue />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/login" element={<Login />} />
      <Route path="/review" element={<DoctorReview />} />
      <Route path="/report" element={<FinalReport />} />
      <Route path="/health-system" element={<HealthSystem />} />
      <Route path="/care-conversion" element={<CareConversionDashboard />} />
      <Route path="/care-conversion/:id" element={<CareConversionProfile />} />
      {/* Fallback for undefined routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
