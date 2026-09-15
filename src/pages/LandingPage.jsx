import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  // Simple intersection observer for fade-up animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="landing-page">
      <TopNav />
      
      {/* 1. Hero Section */}
      <section className="hero-section indian-pattern-bg">
        <div className="container hero-container">
          <div className="hero-content fade-up">
            <h1 className="hero-title">
              <span className="hindi-title">दृष्टि बचाएं, जीवन संवारें</span>
              <br/>
              Automate Diabetic Retinopathy Screening
            </h1>
            <p className="hero-subtitle">
              An AI-powered clinical-grade platform designed to turn retinal images into actionable patient intelligence. <br/>
              <span className="hindi-subtitle">रेटिनल छवियों का विश्लेषण करने और सटीक परिणाम देने के लिए एआई-संचालित मंच।</span>
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                शुरू करें | Get Started
              </button>
            </div>
          </div>
          
          <div className="hero-visual fade-up delay-1">
            <div className="browser-mockup">
              <div className="browser-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="browser-body">
                <div className="mockup-sidebar"></div>
                <div className="mockup-content">
                  <div className="mockup-header-bar"></div>
                  <div className="mockup-grid">
                    <div className="mockup-card large retina-scan-container">
                      <div className="retina-circle-shape"></div>
                      <div className="scan-line"></div>
                      <div className="scan-overlay"></div>
                    </div>
                    <div className="mockup-card small"></div>
                    <div className="mockup-card small"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Social Proof Section */}
      <section className="social-proof-section fade-up">
        <div className="container">
          <p className="social-proof-label">प्रमुख स्वास्थ्य सेवा प्रदाताओं द्वारा विश्वसनीय | TRUSTED BY LEADING PROVIDERS</p>
          <div className="logos-grid">
            {/* Grayscale logos */}
            <div className="logo-placeholder">Apollo Hospitals</div>
            <div className="logo-placeholder">Aravind Eye Care</div>
            <div className="logo-placeholder">Sankara Nethralaya</div>
            <div className="logo-placeholder">LV Prasad</div>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-number">50,000+</h3>
              <p className="stat-label">रोगियों की जांच<br/>Patients Screened</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">99.2%</h3>
              <p className="stat-label">सटीकता<br/>AI Accuracy</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">120+</h3>
              <p className="stat-label">क्लीनिक शामिल<br/>Clinics Onboarded</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">&lt;2 min</h3>
              <p className="stat-label">रिपोर्टिंग का समय<br/>Turnaround Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Features */}
      <section className="features-section">
        <div className="container">
          
          {/* Feature 1: Text Left, Image Right */}
          <div className="feature-row fade-up">
            <div className="feature-text">
              <span className="eyebrow">AI-POWERED ANALYSIS</span>
              <h2>Instant Clinical Insights</h2>
              <p>Upload retinal fundus images and receive immediate, highly accurate risk assessments for Diabetic Retinopathy. Our deep learning models highlight microaneurysms, exudates, and hemorrhages directly on the scan.</p>
            </div>
            <div className="feature-visual">
              <div className="image-frame">
                <div className="mockup-retina-scan"></div>
              </div>
            </div>
          </div>

          {/* Feature 2: Image Left, Text Right */}
          <div className="feature-row reverse fade-up">
            <div className="feature-text">
              <span className="eyebrow">PATIENT MANAGEMENT</span>
              <h2>Seamless Workflow Integration</h2>
              <p>Manage your entire screening pipeline from a single dashboard. Track patient histories, view longitudinal changes, and generate comprehensive clinical reports with one click.</p>
            </div>
            <div className="feature-visual">
              <div className="image-frame">
                <div className="mockup-workflow"></div>
              </div>
            </div>
          </div>

          {/* Feature 3: Text Left, Image Right */}
          <div className="feature-row fade-up">
            <div className="feature-text">
              <span className="eyebrow">REGIONAL INTELLIGENCE</span>
              <h2>Population Health Analytics</h2>
              <p>Aggregate screening data to uncover regional trends. Identify high-risk zones, allocate healthcare resources efficiently, and monitor the impact of intervention programs at scale.</p>
            </div>
            <div className="feature-visual">
              <div className="image-frame">
                <div className="mockup-map"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Testimonials */}
      <section className="testimonials-section fade-up indian-pattern-overlay">
        <div className="container" style={{position: 'relative', zIndex: 2}}>
          <h2 className="section-title">What Clinicians Are Saying <br/><span style={{fontSize: '1.5rem', color: '#cbd5e1', fontWeight: 400}}>चिकित्सकों के विचार</span></h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="quote">"नेत्रम has completely transformed our screening camps in rural India. The immediate AI feedback allows us to refer high-risk patients instantly."</p>
              <div className="author">
                <div className="avatar"></div>
                <div className="author-info">
                  <strong>Dr. Ananya Sharma</strong>
                  <span>Chief Ophthalmologist, VisionCare</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="quote">"The accuracy of the lesion detection is remarkable. It serves as an excellent second opinion and significantly reduces my workload across multiple clinics."</p>
              <div className="author">
                <div className="avatar"></div>
                <div className="author-info">
                  <strong>Dr. Rajesh Kumar</strong>
                  <span>Retina Specialist</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="quote">"Implementing this platform across our regional centers took less than a day. The population health dashboard is invaluable for our admins in identifying hotspots."</p>
              <div className="author">
                <div className="avatar"></div>
                <div className="author-info">
                  <strong>Meera Kulkarni</strong>
                  <span>Director of Operations, Aravind Eye Care</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/logo.png" alt="DR-Sahayak Logo" className="logo-icon-main" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                <span>नेत्रम</span>
              </div>
              <p>Automating Diabetic Retinopathy screening to save sight, worldwide.</p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Accuracy & Validation</a></li>
                <li><a href="#">Pricing</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Clinical Studies</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">API Documentation</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">HIPAA Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} नेत्रम. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
