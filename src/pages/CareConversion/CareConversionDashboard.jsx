import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import {
  HeartPulse, MessageSquare, PhoneCall, Users, AlertTriangle,
  CheckCircle2, Clock, TrendingUp, Filter, ArrowUpDown, ChevronRight
} from 'lucide-react';
import {
  INITIAL_PATIENTS, FUNNEL_DATA, getProbabilityCategory, getRiskColor, getUrgencyBadge
} from '../../data/careConversionData';
import './CareConversionDashboard.css';

// Load/persist patient state
function loadPatients() {
  try {
    const saved = sessionStorage.getItem('cc_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  } catch { return INITIAL_PATIENTS; }
}

export function savePatientsToSession(patients) {
  sessionStorage.setItem('cc_patients', JSON.stringify(patients));
}

const FILTER_OPTIONS = ['All', 'VERY HIGH', 'HIGH', 'MODERATE', 'Unconfirmed', 'Escalated', 'Completed'];

export default function CareConversionDashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(loadPatients);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortKey, setSortKey] = useState('urgency');
  const [toast, setToast] = useState(null);

  // Sync patients from sessionStorage when page re-visits
  useEffect(() => { setPatients(loadPatients()); }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Compute dashboard stats
  const stats = {
    followUpDue: patients.filter(p => p.appointmentStatus !== 'Completed').length,
    highRisk: patients.filter(p => p.risk === 'VERY HIGH' || p.risk === 'CRITICAL').length,
    smsSent: patients.filter(p => p.smsHistory.length > 0).length,
    responded: patients.filter(p => p.smsStatus === 'Confirmed').length,
    missed: patients.filter(p => p.smsStatus === 'No Response' || p.appointmentStatus === 'Missed').length,
    escalated: patients.filter(p => p.escalationLevel >= 2).length,
    completed: patients.filter(p => p.careStatus === 'Care Completed').length,
  };

  // Filter
  const filtered = patients.filter(p => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unconfirmed') return p.appointmentStatus === 'Unconfirmed';
    if (activeFilter === 'Escalated') return p.escalationLevel >= 2;
    if (activeFilter === 'Completed') return p.careStatus === 'Care Completed';
    return p.risk === activeFilter;
  });

  // Sort
  const urgencyOrder = { CRITICAL: 0, URGENT: 1, HIGH: 2, ROUTINE: 3 };
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'urgency') return (urgencyOrder[a.urgency] ?? 9) - (urgencyOrder[b.urgency] ?? 9);
    if (sortKey === 'probability') return a.returnProbability - b.returnProbability;
    if (sortKey === 'date') return new Date(a.followUpDate) - new Date(b.followUpDate);
    return 0;
  });

  const STAT_CARDS = [
    { label: 'Follow-up Due', value: stats.followUpDue, color: '#6366f1', icon: Clock },
    { label: 'High Risk', value: stats.highRisk, color: '#ef4444', icon: AlertTriangle },
    { label: 'SMS Sent', value: stats.smsSent, color: '#3b82f6', icon: MessageSquare },
    { label: 'Responded', value: stats.responded, color: '#10b981', icon: CheckCircle2 },
    { label: 'No Response', value: stats.missed, color: '#f59e0b', icon: PhoneCall },
    { label: 'Escalated', value: stats.escalated, color: '#dc2626', icon: AlertTriangle },
    { label: 'Care Completed', value: stats.completed, color: '#059669', icon: HeartPulse },
  ];

  // Priority list (top 3 urgent/unresolved)
  const priorityList = [...patients]
    .filter(p => p.careStatus !== 'Care Completed')
    .sort((a, b) => a.returnProbability - b.returnProbability)
    .slice(0, 3);

  const getRowAction = (p) => {
    if (p.nextAction === 'send_sms') return { label: 'Send SMS', color: '#1e40af', bg: '#dbeafe' };
    if (p.nextAction === 'initiate_call') return { label: 'Call Patient', color: '#d97706', bg: '#fef3c7' };
    if (p.nextAction === 'asha_outreach') return { label: 'ASHA Escalate', color: '#dc2626', bg: '#fee2e2' };
    if (p.nextAction === 'none') return { label: 'No Action', color: '#64748b', bg: '#f1f5f9' };
    return { label: 'View', color: '#1e40af', bg: '#dbeafe' };
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content" style={{ padding: '2rem', background: '#f8fafc', overflowY: 'auto' }}>
        {/* Header */}
        <div className="cc-header">
          <div>
            <h1>Care Conversion Engine</h1>
            <p>Turn referrals into completed care. Predict → Remind → Escalate → Track</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: 600 }}>
              PROTOTYPE — Follow-up prediction is not clinically validated
            </span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="cc-stats-grid">
          {STAT_CARDS.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="cc-stat-card" style={{ '--stat-color': s.color }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div className="cc-stat-value">{s.value}</div>
                  <Icon size={18} style={{ color: s.color, opacity: 0.7 }} />
                </div>
                <div className="cc-stat-label">{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Body: Queue + Right Panel */}
        <div className="cc-body-grid">

          {/* Patient Follow-up Queue */}
          <div className="cc-queue-section">
            <div className="cc-queue-header">
              <h2>Patient Follow-up Queue</h2>
              <div className="cc-filters">
                {FILTER_OPTIONS.map(f => (
                  <button
                    key={f}
                    className={`cc-filter-btn ${activeFilter === f ? 'active' : ''}`}
                    onClick={() => setActiveFilter(f)}
                  >{f}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Sort:</span>
                {['urgency', 'probability', 'date'].map(k => (
                  <button key={k} className={`cc-filter-btn ${sortKey === k ? 'active' : ''}`} onClick={() => setSortKey(k)}>
                    {k === 'urgency' ? 'Urgency' : k === 'probability' ? 'Return Prob' : 'Follow-up Date'}
                  </button>
                ))}
              </div>
            </div>

            <div className="cc-table-wrapper">
              <table className="cc-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Village</th>
                    <th>DR Grade</th>
                    <th>Risk</th>
                    <th>Follow-up</th>
                    <th><ArrowUpDown size={12} style={{marginRight:3}} />Return Prob.</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(p => {
                    const probCat = getProbabilityCategory(p.returnProbability);
                    const urgBadge = getUrgencyBadge(p.urgency);
                    const rowAction = getRowAction(p);
                    return (
                      <tr key={p.id} onClick={() => navigate(`/care-conversion/${p.id}`)}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.id}</div>
                        </td>
                        <td style={{ color: '#475569', fontSize: '0.85rem' }}>{p.village}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: getRiskColor(p.risk) }}>Grade {p.drGrade}</span>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{p.drLabel}</div>
                        </td>
                        <td>
                          <span className="cc-badge" style={{ background: probCat.bg, color: probCat.textColor }}>
                            {p.risk}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                          {p.followUpDate}
                          <div>
                            <span className="cc-badge" style={{ background: urgBadge.bg, color: urgBadge.color, marginTop: 2 }}>
                              {urgBadge.label}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="cc-prob-bar-wrap">
                            <div className="cc-prob-bar">
                              <div className="cc-prob-bar-fill" style={{ width: `${p.returnProbability}%`, background: probCat.color }} />
                            </div>
                            <span className="cc-prob-text" style={{ color: probCat.color }}>{p.returnProbability}%</span>
                          </div>
                        </td>
                        <td>
                          <span className="cc-badge" style={{
                            background: p.communicationStatus === 'Confirmed' ? '#dcfce7' :
                              p.communicationStatus === 'Escalated' ? '#fee2e2' :
                              p.communicationStatus === 'No Response' ? '#fef3c7' : '#f1f5f9',
                            color: p.communicationStatus === 'Confirmed' ? '#166534' :
                              p.communicationStatus === 'Escalated' ? '#991b1b' :
                              p.communicationStatus === 'No Response' ? '#92400e' : '#475569',
                          }}>{p.communicationStatus}</span>
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <button
                            className="cc-action-btn"
                            style={{ background: rowAction.bg, color: rowAction.color, borderColor: rowAction.bg }}
                            onClick={() => navigate(`/care-conversion/${p.id}`)}
                          >
                            {rowAction.label} <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {sorted.length === 0 && (
                    <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No patients match this filter.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel */}
          <div className="cc-right-panel">

            {/* Funnel */}
            <div className="cc-funnel-card">
              <h2>Referral → Care Conversion Funnel</h2>
              <div className="cc-funnel">
                {FUNNEL_DATA.map((row, i) => (
                  <div key={row.label} className="cc-funnel-row">
                    <div className="cc-funnel-label">{row.label}</div>
                    <div className="cc-funnel-bar-wrap">
                      <div className="cc-funnel-bar-fill" style={{ width: `${row.value}%`, background: row.color }}>
                        <span>{row.value}</span>
                      </div>
                    </div>
                    <div className="cc-funnel-value">{row.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                Conversion rate: <strong style={{ color: '#059669' }}>51%</strong> of referrals complete care
              </div>
            </div>

            {/* Priority Action Panel */}
            <div className="cc-priority-card">
              <h2>🚨 Urgent Action Required</h2>
              {priorityList.map((p, i) => {
                const rowAction = getRowAction(p);
                const colors = ['#fee2e2', '#fef3c7', '#dbeafe'];
                const textColors = ['#991b1b', '#92400e', '#1e40af'];
                return (
                  <div key={p.id} className="cc-priority-item" onClick={() => navigate(`/care-conversion/${p.id}`)}>
                    <div className="cc-priority-rank" style={{ background: colors[i] ?? '#f1f5f9', color: textColors[i] ?? '#475569' }}>
                      {i + 1}
                    </div>
                    <div className="cc-priority-info">
                      <div className="cc-priority-name">{p.name} <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{p.id}</span></div>
                      <div className="cc-priority-details">
                        {p.risk} · Return: {p.returnProbability}% · {p.communicationStatus}
                      </div>
                    </div>
                    <div className="cc-priority-action">{rowAction.label}</div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </main>

      {toast && <div className="cc-toast">✅ {toast}</div>}
    </div>
  );
}
