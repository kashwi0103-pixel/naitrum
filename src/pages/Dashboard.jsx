import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Card from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import { Users, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const kpis = [
    {
      title: 'Screened',
      value: '82,000',
      icon: Users,
      trend: '+12% this month',
      status: 'pass'
    },
    {
      title: 'High Risk',
      value: '6,400',
      icon: AlertTriangle,
      trend: 'Needs attention',
      status: 'critical'
    },
    {
      title: 'Rapid Progression',
      value: '1,200',
      icon: TrendingUp,
      trend: 'Elevated velocity',
      status: 'fail'
    },
    {
      title: 'Pending Referral',
      value: '3,100',
      icon: Clock,
      trend: 'Avg wait: 14 days',
      status: 'borderline'
    }
  ];

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header fade-in">
          <div>
            <h1 className="page-title">District Screening Overview</h1>
            <p className="page-subtitle">Real-time intelligence across 14 connected clinics</p>
          </div>
          <div className="header-actions">
            <span className="last-updated">Updated: Just now</span>
          </div>
        </header>

        <section className="kpi-grid fade-in" style={{ animationDelay: '0.1s' }}>
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <Card key={idx} hoverable className={`kpi-card status-${kpi.status}`}>
                <div className="kpi-header">
                  <h3 className="kpi-title">{kpi.title}</h3>
                  <div className={`kpi-icon-wrapper text-${kpi.status}`}>
                    <Icon size={24} />
                  </div>
                </div>
                <div className="kpi-body">
                  <div className="kpi-value">{kpi.value}</div>
                  <Badge status={kpi.status}>{kpi.trend}</Badge>
                </div>
              </Card>
            );
          })}
        </section>
        
        <section className="dashboard-content fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="dashboard-grid">
            <Card className="chart-card">
              <h3 className="card-title">Recent High-Risk Cases</h3>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Location</th>
                      <th>AI Risk Level</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4].map((i) => (
                      <tr key={i}>
                        <td>#PT-{8000 + i}</td>
                        <td>North Clinic</td>
                        <td><Badge status="critical">Level {Math.floor(Math.random() * 2) + 3}</Badge></td>
                        <td><button onClick={() => navigate('/review')} className="text-primary font-semibold" style={{cursor: 'pointer'}}>Review</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            
            <Card className="chart-card">
              <h3 className="card-title">Screening Coverage (Last 6 Months)</h3>
              <div className="chart-placeholder" style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem 0' }}>
                {[
                  { month: 'Apr', value: 65, status: 'pass' },
                  { month: 'May', value: 72, status: 'pass' },
                  { month: 'Jun', value: 85, status: 'pass' },
                  { month: 'Jul', value: 45, status: 'borderline' },
                  { month: 'Aug', value: 30, status: 'fail' },
                  { month: 'Sep', value: 92, status: 'pass' },
                ].map(data => (
                  <div key={data.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '4px', color: '#64748b' }}>{data.value}%</span>
                    <div className={`bar ${data.status}`} style={{ height: `${data.value}%`, width: '100%', borderRadius: '4px 4px 0 0', minWidth: '30px' }}></div>
                    <span style={{ fontSize: '0.75rem', marginTop: '8px', color: '#475569' }}>{data.month}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
