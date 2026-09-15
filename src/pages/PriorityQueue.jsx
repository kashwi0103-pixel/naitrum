import React from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import Button from '../components/shared/Button';
import { AlertCircle, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import './PriorityQueue.css';

const PriorityQueue = () => {
  // Mock data for priority queue
  const queueData = [
    { id: 'PT-9042', name: 'Geeta Iyer', drLevel: 4, progression: 'Rapid', waitDays: 12, aiConfidence: 98 },
    { id: 'PT-8831', name: 'Arvind Mishra', drLevel: 3, progression: 'Stable', waitDays: 14, aiConfidence: 92 },
    { id: 'PT-9105', name: 'Vikram Rathore', drLevel: 4, progression: 'Stable', waitDays: 5, aiConfidence: 95 },
    { id: 'PT-8722', name: 'Sunita Verma', drLevel: 2, progression: 'Rapid', waitDays: 21, aiConfidence: 88 },
    { id: 'PT-9018', name: 'Kavita Joshi', drLevel: 3, progression: 'Rapid', waitDays: 8, aiConfidence: 94 },
    { id: 'PT-8955', name: 'Prakash Yadav', drLevel: 2, progression: 'Stable', waitDays: 30, aiConfidence: 85 },
  ];

  // Sorting logic based on severity:
  // 1. Highest DR Level
  // 2. Rapid progression over Stable
  // 3. Longest wait time
  const sortedQueue = [...queueData].sort((a, b) => {
    if (b.drLevel !== a.drLevel) {
      return b.drLevel - a.drLevel;
    }
    if (a.progression !== b.progression) {
      return a.progression === 'Rapid' ? -1 : 1;
    }
    return b.waitDays - a.waitDays;
  });

  const getStatusBadge = (level) => {
    if (level === 4) return <Badge status="critical">Critical (L4)</Badge>;
    if (level === 3) return <Badge status="fail">High Risk (L3)</Badge>;
    return <Badge status="borderline">Moderate (L2)</Badge>;
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header fade-in">
          <div>
            <h1 className="page-title">Clinical Priority Queue</h1>
            <p className="page-subtitle">Patients automatically sorted by AI-detected clinical severity</p>
          </div>
          <div className="header-actions">
            <span className="text-secondary font-semibold">{sortedQueue.length} Patients Pending Review</span>
          </div>
        </header>

        <section className="queue-list fade-in" style={{ animationDelay: '0.1s' }}>
          {sortedQueue.map((patient, index) => (
            <Card key={patient.id} className={`queue-card ${index === 0 ? 'top-priority' : ''}`}>
              {index === 0 && (
                <div className="urgent-banner">
                  <AlertCircle size={16} /> Highest Priority - Requires Immediate Review
                </div>
              )}
              
              <div className="queue-card-content">
                <div className="queue-patient-info">
                  <div className="queue-rank">#{index + 1}</div>
                  <div>
                    <h3 className="queue-name">{patient.name}</h3>
                    <span className="queue-id">{patient.id}</span>
                  </div>
                </div>

                <div className="queue-metrics">
                  <div className="metric-group">
                    <span className="metric-label">Severity</span>
                    {getStatusBadge(patient.drLevel)}
                  </div>
                  
                  <div className="metric-group">
                    <span className="metric-label">Progression</span>
                    <span className={`progression-val ${patient.progression === 'Rapid' ? 'text-fail font-semibold' : 'text-secondary'}`}>
                      {patient.progression === 'Rapid' && <TrendingUp size={14} className="inline-icon" />}
                      {patient.progression}
                    </span>
                  </div>

                  <div className="metric-group">
                    <span className="metric-label">Wait Time</span>
                    <span className={`wait-time ${patient.waitDays > 14 ? 'text-critical font-semibold' : 'text-secondary'}`}>
                      <Clock size={14} className="inline-icon" />
                      {patient.waitDays} days
                    </span>
                  </div>

                  <div className="metric-group">
                    <span className="metric-label">AI Confidence</span>
                    <Badge status="digital">{patient.aiConfidence}%</Badge>
                  </div>
                </div>

                <div className="queue-actions">
                  <Button variant={index === 0 ? 'primary' : 'secondary'} size="md">
                    Review Case <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
};

export default PriorityQueue;
