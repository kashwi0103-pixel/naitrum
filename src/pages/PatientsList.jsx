import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import Button from '../components/shared/Button';
import { Search, Filter, MoreHorizontal, User, X } from 'lucide-react';
import './PatientsList.css';

const PatientsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', id: '', age: '', lastScreening: '', riskLevel: '1', status: 'pass' });

  const [patients, setPatients] = useState([
    { id: 'PT-8001', name: 'Arvind Mishra', age: 64, lastScreening: '2026-08-12', riskLevel: 1, status: 'pass' },
    { id: 'PT-8002', name: 'Sunita Verma', age: 58, lastScreening: '2026-09-01', riskLevel: 3, status: 'critical' },
    { id: 'PT-8003', name: 'Mahesh Patil', age: 72, lastScreening: '2026-08-28', riskLevel: 2, status: 'fail' },
    { id: 'PT-8004', name: 'Kavita Joshi', age: 51, lastScreening: '2026-09-05', riskLevel: 1, status: 'borderline' },
    { id: 'PT-8005', name: 'Prakash Yadav', age: 68, lastScreening: '2026-07-20', riskLevel: 1, status: 'pass' },
    { id: 'PT-8006', name: 'Rekha Tiwari', age: 61, lastScreening: '2026-09-08', riskLevel: 4, status: 'critical' },
    { id: 'PT-8007', name: 'Suresh Nair', age: 75, lastScreening: '2026-08-15', riskLevel: 2, status: 'fail' },
  ]);

  const handleAddPatient = (e) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.id) return;
    
    setPatients(prev => [{ ...newPatient, age: parseInt(newPatient.age) || 0, riskLevel: parseInt(newPatient.riskLevel) || 1 }, ...prev]);
    setIsAddModalOpen(false);
    setNewPatient({ name: '', id: '', age: '', lastScreening: '', riskLevel: '1', status: 'pass' });
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header fade-in">
          <div>
            <h1 className="page-title">Patient Directory</h1>
            <p className="page-subtitle">Manage and monitor all screened patients</p>
          </div>
          <div className="header-actions">
            <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)}>Add Patient</Button>
          </div>
        </header>

        <section className="patients-content fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="patients-card">
            
            <div className="table-controls">
              <div className="search-box">
                <Search size={20} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by name or ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <Button variant="secondary" size="md" className="filter-btn">
                <Filter size={18} />
                Filters
              </Button>
            </div>

            <div className="table-wrapper">
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>ID</th>
                    <th>Age</th>
                    <th>Last Screening</th>
                    <th>DR Level</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>
                        <div className="patient-name-cell">
                          <div className="avatar">
                            <User size={16} />
                          </div>
                          <span className="font-semibold">{patient.name}</span>
                        </div>
                      </td>
                      <td className="text-secondary">{patient.id}</td>
                      <td>{patient.age}</td>
                      <td>{patient.lastScreening}</td>
                      <td>
                        <span className="font-semibold">Level {patient.riskLevel}</span>
                      </td>
                      <td>
                        <Badge status={patient.status}>
                          {patient.status === 'pass' ? 'Normal' : patient.status === 'critical' ? 'High Risk' : patient.status === 'fail' ? 'Moderate' : 'Review'}
                        </Badge>
                      </td>
                      <td>
                        <button className="action-btn">
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPatients.length === 0 && (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        No patients found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="pagination">
              <span className="text-secondary">Showing {filteredPatients.length} of {patients.length} patients</span>
              <div className="pagination-controls">
                <Button variant="ghost" size="sm" disabled>Previous</Button>
                <Button variant="ghost" size="sm">Next</Button>
              </div>
            </div>

          </Card>
        </section>
      </main>

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '400px', maxWidth: '90%', position: 'relative' }}>
            <button onClick={() => setIsAddModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="#64748b" />
            </button>
            <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem', color: '#0f172a' }}>Add New Patient</h2>
            <form onSubmit={handleAddPatient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Patient ID</label>
                <input type="text" value={newPatient.id} onChange={e => setNewPatient({...newPatient, id: e.target.value})} placeholder="e.g. PT-8008" required style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Full Name</label>
                <input type="text" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} placeholder="e.g. Ramesh Kumar" required style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Age</label>
                  <input type="number" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} required style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Risk Level (1-4)</label>
                  <input type="number" min="1" max="4" value={newPatient.riskLevel} onChange={e => setNewPatient({...newPatient, riskLevel: e.target.value, status: e.target.value > 2 ? 'critical' : e.target.value == 2 ? 'fail' : 'pass' })} required style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Screening Date</label>
                <input type="date" value={newPatient.lastScreening} onChange={e => setNewPatient({...newPatient, lastScreening: e.target.value})} required style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
              </div>
              <Button variant="primary" size="md" type="submit" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>Save Patient</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsList;
