import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ScanEye, 
  Users, 
  ListOrdered, 
  Map, 
  Building2, 
  HeartPulse
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Screen Patient', path: '/screening', icon: ScanEye },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Priority Queue', path: '/queue', icon: ListOrdered },
    { name: 'Regional Intelligence', path: '/intelligence', icon: Map },
    { name: 'Health System', path: '/health-system', icon: Building2 },
    { name: 'Care Conversion', path: '/care-conversion', icon: HeartPulse },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/logo.png" alt="Logo" className="logo-icon-img" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
        <span className="logo-text">नेत्रम</span>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          
          return (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">DR</div>
          <div className="user-info">
            <span className="user-name">Dr. Priya Menon</span>
            <span className="user-role">Lead Ophthalmologist</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
