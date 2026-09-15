import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/shared/Card';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { AlertOctagon } from 'lucide-react';
import './RegionalIntelligence.css';

const INDIA_TOPO_URL =
  'https://cdn.jsdelivr.net/npm/india-pincode-search@1.0.6/docs/india.topojson';

// DR Score data keyed by state name
const STATE_DR_DATA = {
  'Andhra Pradesh':    { score: 18.2, region: 'South',   risk: 'high' },
  'Arunachal Pradesh': { score: 6.1,  region: 'East',    risk: 'safe' },
  'Assam':             { score: 9.8,  region: 'East',    risk: 'moderate' },
  'Bihar':             { score: 14.5, region: 'East',    risk: 'moderate' },
  'Chhattisgarh':      { score: 21.3, region: 'Central', risk: 'critical' },
  'Goa':               { score: 7.4,  region: 'West',    risk: 'safe' },
  'Gujarat':           { score: 11.2, region: 'West',    risk: 'moderate' },
  'Haryana':           { score: 10.4, region: 'North',   risk: 'moderate' },
  'Himachal Pradesh':  { score: 5.9,  region: 'North',   risk: 'safe' },
  'Jharkhand':         { score: 16.8, region: 'East',    risk: 'high' },
  'Karnataka':         { score: 13.7, region: 'South',   risk: 'moderate' },
  'Kerala':            { score: 8.1,  region: 'South',   risk: 'safe' },
  'Madhya Pradesh':    { score: 24.1, region: 'Central', risk: 'critical' },
  'Maharashtra':       { score: 12.6, region: 'West',    risk: 'moderate' },
  'Manipur':           { score: 7.0,  region: 'East',    risk: 'safe' },
  'Meghalaya':         { score: 8.5,  region: 'East',    risk: 'safe' },
  'Mizoram':           { score: 6.3,  region: 'East',    risk: 'safe' },
  'Nagaland':          { score: 5.7,  region: 'East',    risk: 'safe' },
  'Odisha':            { score: 19.4, region: 'East',    risk: 'high' },
  'Punjab':            { score: 9.2,  region: 'North',   risk: 'moderate' },
  'Rajasthan':         { score: 22.7, region: 'North',   risk: 'critical' },
  'Sikkim':            { score: 4.8,  region: 'East',    risk: 'safe' },
  'Tamil Nadu':        { score: 15.3, region: 'South',   risk: 'high' },
  'Telangana':         { score: 20.1, region: 'South',   risk: 'critical' },
  'Tripura':           { score: 8.9,  region: 'East',    risk: 'safe' },
  'Uttar Pradesh':     { score: 23.5, region: 'Central', risk: 'critical' },
  'Uttarakhand':       { score: 7.8,  region: 'North',   risk: 'safe' },
  'West Bengal':       { score: 12.5, region: 'East',    risk: 'moderate' },
  'Delhi':             { score: 10.1, region: 'North',   risk: 'moderate' },
  'Jammu and Kashmir': { score: 6.6,  region: 'North',   risk: 'safe' },
};

const RISK_COLORS = {
  safe:     '#2F7D5A',
  moderate: '#E0A020',
  high:     '#E67E22',
  critical: '#C94C38',
  default:  '#CBD5D3',
};

const RISK_LABELS = {
  safe:     'Low Risk (< 10%)',
  moderate: 'Moderate (10–15%)',
  high:     'High (15–20%)',
  critical: 'Critical (> 20%)',
};

const getStateName = (geo) =>
  geo.properties?.NAME_1 ||
  geo.properties?.ST_NM ||
  geo.properties?.name ||
  geo.properties?.NAME ||
  '';

const RegionalIntelligence = () => {
  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header fade-in">
          <div>
            <h1 className="page-title">Health System Intelligence</h1>
            <p className="page-subtitle">Capacity and demand forecasting across the network</p>
          </div>
        </header>

        <section className="capacity-alert fade-in" style={{ animationDelay: '0.1s' }}>
          <Card className="capacity-card">
            <h2 className="capacity-title">Referral Demand vs Capacity Warning</h2>
            <div className="comparison-visual">
              <div className="metric-box demand">
                <span className="metric-value">6,400</span>
                <span className="metric-label">High-Risk Patients</span>
              </div>
              <div className="vs-divider"><span>VS</span></div>
              <div className="metric-box capacity">
                <span className="metric-value">900</span>
                <span className="metric-label">Monthly Specialist Capacity</span>
              </div>
            </div>
            <div className="backlog-projection">
              <AlertOctagon className="text-critical" size={24} />
              <div className="backlog-text">
                <strong>Projected Backlog: 5,500 patients</strong>
                <p>System capacity must increase by 610% to meet current referral volume.</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="regional-grid fade-in" style={{ animationDelay: '0.2s' }}>
          <Card className="map-card" style={{ position: 'relative', overflow: 'hidden' }}>
            <h3 className="card-title">DR Distribution by Region — India</h3>

            {/* Legend */}
            <div className="map-legend">
              {Object.entries(RISK_LABELS).map(([key, label]) => (
                <div key={key} className="legend-item">
                  <span className="legend-dot" style={{ background: RISK_COLORS[key] }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Tooltip */}
            {tooltip && (
              <div
                className="map-tooltip"
                style={{ top: tooltip.y, left: tooltip.x }}
              >
                <strong>{tooltip.name}</strong>
                <div>DR Score: <b>{tooltip.score}%</b></div>
                <div>Region: {tooltip.region}</div>
              </div>
            )}

            <div className="india-map-container">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 1050, center: [82.5, 22.5] }}
                style={{ width: '100%', height: '100%' }}
              >
                <Geographies geography={INDIA_TOPO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const stateName = getStateName(geo);
                      const data = STATE_DR_DATA[stateName];
                      const fill = data ? RISK_COLORS[data.risk] : RISK_COLORS.default;
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={fill}
                          stroke="#ffffff"
                          strokeWidth={0.7}
                          style={{
                            default: { outline: 'none', opacity: 0.9 },
                            hover:   { outline: 'none', opacity: 1, filter: 'brightness(1.15)', cursor: 'pointer' },
                            pressed: { outline: 'none' },
                          }}
                          onMouseEnter={(e) => {
                            if (!data) return;
                            const svgEl = e.target.closest('svg');
                            const rect = svgEl?.getBoundingClientRect();
                            setTooltip({
                              name:   stateName,
                              score:  data.score,
                              region: data.region,
                              x: e.clientX - (rect?.left || 0) + 14,
                              y: e.clientY - (rect?.top  || 0) - 14,
                            });
                          }}
                          onMouseLeave={() => setTooltip(null)}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>
          </Card>

          <div className="stats-column">
            <Card className="stat-card border-safe">
              <h4>Screening Coverage</h4>
              <div className="stat-value">84%</div>
              <div className="progress-bar"><div className="fill safe" style={{ width: '84%' }} /></div>
            </Card>
            <Card className="stat-card border-moderate">
              <h4>Referable DR</h4>
              <div className="stat-value">12.5%</div>
              <div className="progress-bar"><div className="fill moderate" style={{ width: '12.5%' }} /></div>
            </Card>
            <Card className="stat-card border-high">
              <h4>Rapid Progression</h4>
              <div className="stat-value">4.2%</div>
              <div className="progress-bar"><div className="fill high" style={{ width: '4.2%' }} /></div>
            </Card>
            <Card className="stat-card border-critical">
              <h4>Pending Referrals</h4>
              <div className="stat-value">3,100</div>
              <div className="progress-bar"><div className="fill critical" style={{ width: '65%' }} /></div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RegionalIntelligence;
