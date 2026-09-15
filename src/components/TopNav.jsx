import React from 'react';
import { Link } from 'react-router-dom';
import './TopNav.css';

const TopNav = () => {
  return (
    <header className="topnav">
      <div className="container topnav-container">
        <Link to="/" className="logo-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.png" alt="DR-Sahayak Logo" className="logo-icon-main" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
          <span className="logo-text-main">नेत्रम</span>
        </Link>
        
        <nav className="topnav-links">
          <Link to="/screening" className="nav-link">Screening</Link>
          <Link to="/how-it-works" className="nav-link">How it works</Link>
          <Link to="/dashboard" className="nav-link">For Clinicians</Link>
        </nav>
        
        <div className="topnav-actions">
          <Link to="/login" className="btn btn-primary btn-md">Login</Link>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
