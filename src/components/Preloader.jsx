import React, { useState, useEffect } from 'react';
import './Preloader.css';
import { Eye } from 'lucide-react';

export default function Preloader({ onDone }) {
  const [phase, setPhase] = useState('enter'); // enter → text → exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 400);
    const t2 = setTimeout(() => setPhase('exit'), 2000);
    const t3 = setTimeout(() => onDone(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className={`preloader-overlay preloader-${phase}`}>
      <div className="preloader-content">
        <div className="preloader-brand">
          <div className="brand-icon-wrapper" style={{ background: 'transparent' }}>
            <img src="/logo.png" alt="DR-Sahayak Logo" className="brand-icon" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
          </div>
          <div className="brand-text">
            <h1 className="brand-name">नमस्ते | नेत्रम</h1>
            <p className="brand-subtitle">Diabetic Retinopathy Intelligence</p>
          </div>
        </div>
        
        <div className="preloader-progress-container">
          <div className="preloader-progress-bar" />
        </div>
        
        <p className="preloader-status">Initializing clinical environment...</p>
      </div>
    </div>
  );
}
