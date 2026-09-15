import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Simulation.css';

export default function Simulation() {
  const [params, setParams] = useState({
    patientsPerYear: 100000,
    phcs: 10,
    cameras: 15,
    bandwidth: 50,
    aiCapacity: 2,
    ophthalmologists: 5,
    doctorReviewTime: 10
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams({ ...params, [name]: Number(value) });
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('http://localhost:8000/api/simulation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      if (!response.ok) throw new Error('Simulation failed to run');

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content sim-main">
        <div className="sim-header">
          <div>
            <h1 className="sim-title">District-Scale Simulation</h1>
            <p className="sim-subtitle">Simulink System Queue Modeling</p>
          </div>
        </div>

        <div className="simulation-container" style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
          
          {/* Left Column: Config */}
          <div className="sim-config-panel" style={{ flex: 1, background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: '#333' }}>Simulation Parameters</h2>
            
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Patients per Year: {params.patientsPerYear}</label>
              <input type="range" name="patientsPerYear" min="10000" max="500000" step="10000" value={params.patientsPerYear} onChange={handleChange} style={{ width: '100%' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Number of PHCs: {params.phcs}</label>
              <input type="range" name="phcs" min="1" max="50" step="1" value={params.phcs} onChange={handleChange} style={{ width: '100%' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Number of Cameras: {params.cameras}</label>
              <input type="range" name="cameras" min="1" max="100" step="1" value={params.cameras} onChange={handleChange} style={{ width: '100%' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Network Bandwidth (Mbps): {params.bandwidth}</label>
              <input type="range" name="bandwidth" min="5" max="1000" step="5" value={params.bandwidth} onChange={handleChange} style={{ width: '100%' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>AI Capacity (Inferences/sec): {params.aiCapacity}</label>
              <input type="range" name="aiCapacity" min="1" max="50" step="1" value={params.aiCapacity} onChange={handleChange} style={{ width: '100%' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Ophthalmologists: {params.ophthalmologists}</label>
              <input type="range" name="ophthalmologists" min="1" max="50" step="1" value={params.ophthalmologists} onChange={handleChange} style={{ width: '100%' }} />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Doctor Review Time (Mins): {params.doctorReviewTime}</label>
              <input type="range" name="doctorReviewTime" min="2" max="30" step="1" value={params.doctorReviewTime} onChange={handleChange} style={{ width: '100%' }} />
            </div>

            <button 
              onClick={handleRunSimulation} 
              disabled={loading}
              style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' }}
            >
              {loading ? 'Running Simulation...' : 'RUN SIMULATION'}
            </button>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
          </div>

          {/* Right Column: Results */}
          <div className="sim-results-panel" style={{ flex: 1.5 }}>
            {results ? (
              <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eee' }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#333' }}>Simulation Results</h2>
                
                {results.demoMode && (
                  <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    <strong>Notice:</strong> {results.message} (Simulink/MATLAB Engine not detected)
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>TOTAL PATIENTS</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a' }}>{results.results.totalPatients.toLocaleString()}</div>
                  </div>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>PATIENTS PROCESSED</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a' }}>{results.results.processed.toLocaleString()}</div>
                  </div>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>PATIENTS WAITING</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a' }}>{results.results.waiting.toLocaleString()}</div>
                  </div>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>THROUGHPUT (Patients/Day)</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a' }}>{results.results.throughput.toLocaleString()}</div>
                  </div>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>AVG WAITING TIME (Mins)</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a' }}>{results.results.avgWaitingTime}</div>
                  </div>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>PEAK QUEUE</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0f172a' }}>{results.results.peakQueue.toLocaleString()}</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#333' }}>Resource Utilization & Bottlenecks</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                      <span>Camera Utilization</span>
                      <span>{results.results.cameraUtilization}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                      <div style={{ width: `${results.results.cameraUtilization}%`, height: '100%', background: results.results.cameraUtilization >= 100 ? '#ef4444' : '#3b82f6', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                      <span>AI Server Utilization</span>
                      <span>{results.results.aiUtilization}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                      <div style={{ width: `${results.results.aiUtilization}%`, height: '100%', background: results.results.aiUtilization >= 100 ? '#ef4444' : '#3b82f6', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '4px' }}>
                      <span>Ophthalmologist Utilization</span>
                      <span>{results.results.doctorUtilization}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
                      <div style={{ width: `${results.results.doctorUtilization}%`, height: '100%', background: results.results.doctorUtilization >= 100 ? '#ef4444' : '#3b82f6', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.5rem', background: results.results.sufficient ? '#dcfce7' : '#fee2e2', borderRadius: '8px', border: `1px solid ${results.results.sufficient ? '#bbf7d0' : '#fecaca'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: results.results.sufficient ? '#166534' : '#991b1b', fontSize: '1.1rem' }}>
                      {results.results.sufficient ? 'Capacity sufficient under simulated conditions' : 'Capacity insufficient under simulated conditions'}
                    </div>
                    {!results.results.sufficient && (
                      <div style={{ color: '#991b1b', marginTop: '4px', fontSize: '0.9rem' }}>
                        System Bottleneck: <strong>{results.results.bottleneck}</strong>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
                Configure parameters and run the simulation to see results.
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
