import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './HealthSystem.css';

const DISTRICTS = [
  { name: 'Varanasi',     screened: 1284, referrals: 312, backlog: 34, coverage: 78, status: 'online',  phcs: 8 },
  { name: 'Lucknow',      screened: 2140, referrals: 498, backlog: 12, coverage: 91, status: 'online',  phcs: 14 },
  { name: 'Agra',         screened: 876,  referrals: 201, backlog: 67, coverage: 54, status: 'warning', phcs: 6 },
  { name: 'Kanpur',       screened: 1560, referrals: 389, backlog: 23, coverage: 82, status: 'online',  phcs: 10 },
  { name: 'Gorakhpur',    screened: 634,  referrals: 178, backlog: 89, coverage: 41, status: 'critical',phcs: 5 },
  { name: 'Prayagraj',    screened: 1102, referrals: 267, backlog: 45, coverage: 67, status: 'warning', phcs: 7 },
  { name: 'Meerut',       screened: 980,  referrals: 220, backlog: 18, coverage: 74, status: 'online',  phcs: 6 },
  { name: 'Mathura',      screened: 412,  referrals: 98,  backlog: 102, coverage: 29, status: 'critical',phcs: 3 },
  { name: 'Bareilly',     screened: 720,  referrals: 156, backlog: 52, coverage: 58, status: 'warning', phcs: 5 },
  { name: 'Aligarh',      screened: 548,  referrals: 134, backlog: 38, coverage: 63, status: 'online',  phcs: 4 },
  { name: 'Moradabad',    screened: 398,  referrals: 87,  backlog: 74, coverage: 38, status: 'critical',phcs: 3 },
  { name: 'Saharanpur',   screened: 512,  referrals: 118, backlog: 29, coverage: 55, status: 'warning', phcs: 4 },
];

const STATUS_CONFIG = {
  online:   { label: 'Online',   color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  warning:  { label: 'Warning',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

const MONTHLY = [
  { month: 'Apr', screened: 3200, referrals: 720 },
  { month: 'May', screened: 4100, referrals: 890 },
  { month: 'Jun', screened: 3800, referrals: 810 },
  { month: 'Jul', screened: 5200, referrals: 1100 },
  { month: 'Aug', screened: 6100, referrals: 1340 },
  { month: 'Sep', screened: 5800, referrals: 1280 },
];

const maxMonthly = Math.max(...MONTHLY.map(m => m.screened));

export default function HealthSystem() {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('screened');
  const [selected, setSelected] = useState(null);

  const filtered = DISTRICTS
    .filter(d => filter === 'all' || d.status === filter)
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const totals = DISTRICTS.reduce((acc, d) => ({
    screened: acc.screened + d.screened,
    referrals: acc.referrals + d.referrals,
    backlog: acc.backlog + d.backlog,
    phcs: acc.phcs + d.phcs,
  }), { screened: 0, referrals: 0, backlog: 0, phcs: 0 });

  const sel = selected !== null ? DISTRICTS[selected] : null;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content hs-main">
        <div className="hs-header">
          <div>
            <h1 className="hs-title">Health System Overview</h1>
            <p className="hs-subtitle">District-level DR screening capacity, backlog, and coverage — Uttar Pradesh</p>
          </div>
          <div className="hs-header-badges">
            <span className="hs-badge online">{DISTRICTS.filter(d => d.status === 'online').length} Online</span>
            <span className="hs-badge warning">{DISTRICTS.filter(d => d.status === 'warning').length} Warning</span>
            <span className="hs-badge critical">{DISTRICTS.filter(d => d.status === 'critical').length} Critical</span>
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="hs-kpi-grid">
          {[
            { label: 'Total Screened', value: totals.screened.toLocaleString(), icon: '👁️', color: '#6366f1' },
            { label: 'Total Referrals', value: totals.referrals.toLocaleString(), icon: '🏥', color: '#ef4444' },
            { label: 'Total Backlog', value: totals.backlog.toLocaleString(), icon: '⏳', color: '#f59e0b' },
            { label: 'Active PHCs', value: totals.phcs, icon: '🏪', color: '#10b981' },
          ].map(k => (
            <div key={k.label} className="hs-kpi-card" style={{ borderTopColor: k.color }}>
              <div className="kpi-icon">{k.icon}</div>
              <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="hs-content-grid">
          {/* District grid */}
          <div className="hs-district-panel">
            <div className="panel-toolbar">
              <div className="filter-tabs">
                {['all', 'online', 'warning', 'critical'].map(f => (
                  <button
                    key={f}
                    className={`filter-tab ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f === 'all' ? 'All' : STATUS_CONFIG[f].label}
                  </button>
                ))}
              </div>
              <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="screened">Sort: Screened</option>
                <option value="referrals">Sort: Referrals</option>
                <option value="backlog">Sort: Backlog</option>
                <option value="coverage">Sort: Coverage</option>
              </select>
            </div>

            <div className="district-grid">
              {filtered.map((d, i) => {
                const sc = STATUS_CONFIG[d.status];
                const originalIdx = DISTRICTS.indexOf(d);
                return (
                  <div
                    key={d.name}
                    className={`district-card ${selected === originalIdx ? 'district-selected' : ''}`}
                    onClick={() => setSelected(selected === originalIdx ? null : originalIdx)}
                    style={{ borderTopColor: sc.color }}
                  >
                    <div className="district-card-header">
                      <span className="district-name">{d.name}</span>
                      <span className="district-status-dot" style={{ background: sc.color, boxShadow: `0 0 6px ${sc.color}` }}></span>
                    </div>
                    <div className="district-phcs">{d.phcs} PHCs</div>

                    <div className="district-coverage-bar">
                      <div
                        className="coverage-fill"
                        style={{
                          width: `${d.coverage}%`,
                          background: d.coverage > 70 ? '#10b981' : d.coverage > 50 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                    <div className="district-coverage-label">{d.coverage}% coverage</div>

                    <div className="district-stats-row">
                      <div className="dstat">
                        <span className="dstat-val">{d.screened.toLocaleString()}</span>
                        <span className="dstat-lbl">Screened</span>
                      </div>
                      <div className="dstat">
                        <span className="dstat-val" style={{ color: '#ef4444' }}>{d.referrals}</span>
                        <span className="dstat-lbl">Referred</span>
                      </div>
                      <div className="dstat">
                        <span className="dstat-val" style={{ color: d.backlog > 60 ? '#ef4444' : '#f59e0b' }}>{d.backlog}</span>
                        <span className="dstat-lbl">Backlog</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side panel */}
          <div className="hs-side-panel">
            {/* District detail */}
            {sel ? (
              <div className="district-detail-card">
                <div className="detail-header" style={{ borderColor: STATUS_CONFIG[sel.status].color }}>
                  <h3>{sel.name} District</h3>
                  <span
                    className="detail-status-badge"
                    style={{ background: STATUS_CONFIG[sel.status].bg, color: STATUS_CONFIG[sel.status].color }}
                  >
                    {STATUS_CONFIG[sel.status].label}
                  </span>
                </div>
                <div className="detail-metric-list">
                  {[
                    ['Primary Health Centres', sel.phcs],
                    ['Total Screened', sel.screened.toLocaleString()],
                    ['Referrals Issued', sel.referrals],
                    ['Current Backlog', sel.backlog],
                    ['Population Coverage', `${sel.coverage}%`],
                    ['Referral Rate', `${((sel.referrals / sel.screened) * 100).toFixed(1)}%`],
                  ].map(([k, v]) => (
                    <div key={k} className="detail-metric-row">
                      <span className="dm-key">{k}</span>
                      <span className="dm-val">{v}</span>
                    </div>
                  ))}
                </div>
                {sel.backlog > 60 && (
                  <div className="detail-alert">⚠️ High backlog — consider mobile camp deployment</div>
                )}
                {sel.coverage < 50 && (
                  <div className="detail-alert critical-alert">🔴 Low coverage — priority for expansion</div>
                )}
              </div>
            ) : (
              <div className="district-detail-placeholder">
                <span>👆</span>
                <p>Click a district card to see detailed metrics</p>
              </div>
            )}

            {/* Monthly trend chart */}
            <div className="monthly-chart-card">
              <h3 className="chart-title">Monthly Trend (UP State)</h3>
              <div className="monthly-bars">
                {MONTHLY.map(m => (
                  <div key={m.month} className="monthly-col">
                    <div className="monthly-bar-wrap">
                      <div
                        className="monthly-bar screened-bar"
                        style={{ height: `${(m.screened / maxMonthly) * 100}%` }}
                        title={`Screened: ${m.screened}`}
                      />
                      <div
                        className="monthly-bar referral-bar"
                        style={{ height: `${(m.referrals / maxMonthly) * 100}%` }}
                        title={`Referrals: ${m.referrals}`}
                      />
                    </div>
                    <span className="monthly-label">{m.month}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <span><span className="legend-dot screened-dot"></span>Screened</span>
                <span><span className="legend-dot referral-dot"></span>Referrals</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
