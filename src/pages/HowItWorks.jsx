import React from 'react';
import TopNav from '../components/TopNav';
import './HowItWorks.css';

const HowItWorks = () => {
  return (
    <div className="how-it-works-page">
      <TopNav />
      <div className="how-it-works-container">
        <header className="how-it-works-header">
          <h1>How नेत्रम Works</h1>
          <p>Your intelligent assistant for Diabetic Retinopathy screening and management.</p>
        </header>

        <section className="steps-container">
          <div className="step-card">
            <div className="step-icon">1</div>
            <h3>Patient Registration</h3>
            <p>Patients are registered into the system with their basic details and medical history. A unique Patient ID is generated for tracking their screening journey.</p>
          </div>

          <div className="step-card">
            <div className="step-icon">2</div>
            <h3>Image Upload & Analysis</h3>
            <p>Clinicians upload retinal fundus images of the patient. The AI-powered नेत्रम system analyzes these images in real-time to detect signs of Diabetic Retinopathy.</p>
          </div>

          <div className="step-card">
            <div className="step-icon">3</div>
            <h3>Risk Assessment</h3>
            <p>Based on the analysis, the system categorizes the patient's condition into different risk levels (e.g., No DR, Mild, Moderate, Severe, Proliferative) and highlights critical areas.</p>
          </div>

          <div className="step-card">
            <div className="step-icon">4</div>
            <h3>Regional Intelligence</h3>
            <p>The system aggregates data to provide regional insights, helping healthcare organizations identify high-risk zones and allocate resources effectively.</p>
          </div>
        </section>

        <div className="cta-section">
          <h2>Ready to get started?</h2>
          <p>Login to access the dashboard and start screening patients.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
