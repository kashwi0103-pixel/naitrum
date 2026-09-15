import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import './Login.css';

const Login = () => {
  const [activeTab, setActiveTab] = useState('clinician'); // 'clinician' or 'patient'
  const navigate = useNavigate();

  const handleClinicianLogin = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
  };

  const handlePatientLogin = (e) => {
    e.preventDefault();
    // Simulate login for patient, could go to a specific patient view or dashboard
    navigate('/dashboard'); 
  };

  return (
    <div className="login-page">
      <TopNav />
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome to नेत्रम</h2>
            <p>Please log in to continue</p>
          </div>

          <div className="login-tabs">
            <button 
              className={`tab-btn ${activeTab === 'clinician' ? 'active' : ''}`}
              onClick={() => setActiveTab('clinician')}
            >
              Clinician
            </button>
            <button 
              className={`tab-btn ${activeTab === 'patient' ? 'active' : ''}`}
              onClick={() => setActiveTab('patient')}
            >
              Patient
            </button>
          </div>

          <div className="login-content">
            {activeTab === 'clinician' ? (
              <form onSubmit={handleClinicianLogin} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" placeholder="doctor@hospital.com" required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input type="password" id="password" placeholder="••••••••" required />
                </div>
                <div className="form-actions">
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>
                <button type="submit" className="login-submit-btn">Login as Clinician</button>
              </form>
            ) : (
              <form onSubmit={handlePatientLogin} className="login-form">
                <div className="form-group">
                  <label htmlFor="patientId">Patient ID</label>
                  <input type="text" id="patientId" placeholder="e.g., PAT-12345" required />
                </div>
                <div className="form-group">
                  <label htmlFor="patientName">Full Name</label>
                  <input type="text" id="patientName" placeholder="e.g., Ramesh Kumar" required />
                </div>
                <div className="form-group">
                  <label htmlFor="dob">Date of Birth</label>
                  <input type="date" id="dob" required />
                </div>
                <button type="submit" className="login-submit-btn">Login as Patient</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
