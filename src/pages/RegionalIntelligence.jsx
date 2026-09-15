import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Card from '../components/shared/Card';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { AlertOctagon } from 'lucide-react';
import './RegionalIntelligence.css';

// Reliable: world-atlas CDN, India = country id "356"
const WORLD_ATLAS_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const RISK_COLORS = {
  safe:     '#2F7D5A',
  moderate: '#E0A020',
  high:     '#E67E22',
  critical: '#C94C38',
};

const RISK_LABELS = {
  safe:     'Low Risk (< 10%)',
  moderate: 'Moderate (10–15%)',
  high:     'High (15–20%)',
  critical: 'Critical (> 20%)',
};

// State centroids [lng, lat] + DR data
const STATE_MARKERS = [
  { name: 'Uttar Pradesh',   coords: [80.7, 26.8], score: 23.5, risk: 'critical', r: 20 },
  { name: 'Madhya Pradesh',  coords: [78.7, 23.5], score: 24.1, risk: 'critical', r: 19 },
  { name: 'Rajasthan',       coords: [73.9, 26.5], score: 22.7, risk: 'critical', r: 19 },
  { name: 'Chhattisgarh',    coords: [81.9, 21.3], score: 21.3, risk: 'critical', r: 15 },
  { name: 'Telangana',       coords: [79.1, 17.9], score: 20.1, risk: 'critical', r: 15 },
  { name: 'Odisha',          coords: [84.2, 20.5], score: 19.4, risk: 'high',     r: 16 },
  { name: 'Andhra Pradesh',  coords: [80.4, 15.9], score: 18.2, risk: 'high',     r: 17 },
  { name: 'Jharkhand',       coords: [85.5, 23.4], score: 16.8, risk: 'high',     r: 14 },
  { name: 'Tamil Nadu',      coords: [78.7, 11.0], score: 15.3, risk: 'high',     r: 17 },
  { name: 'Bihar',           coords: [85.7, 25.6], score: 14.5, risk: 'moderate', r: 16 },
  { name: 'Maharashtra',     coords: [76.0, 19.7], score: 12.6, risk: 'moderate', r: 18 },
  { name: 'Karnataka',       coords: [76.1, 15.3], score: 13.7, risk: 'moderate', r: 17 },
  { name: 'West Bengal',     coords: [87.5, 23.8], score: 12.5, risk: 'moderate', r: 15 },
  { name: 'Gujarat',         coords: [71.5, 22.3], score: 11.2, risk: 'moderate', r: 17 },
  { name: 'Haryana',         coords: [76.0, 29.0], score: 10.4, risk: 'moderate', r: 12 },
  { name: 'Assam',           coords: [92.5, 26.2], score: 9.8,  risk: 'moderate', r: 14 },
  { name: 'Punjab',          coords: [75.3, 31.0], score: 9.2,  risk: 'safe',     r: 13 },
  { name: 'Kerala',          coords: [76.3, 10.6], score: 8.1,  risk: 'safe',     r: 14 },
  { name: 'Uttarakhand',     coords: [79.0, 30.3], score: 7.8,  risk: 'safe',     r: 11 },
  { name: 'Goa',             coords: [74.1, 15.4], score: 7.4,  risk: 'safe',     r: 8  },
  { name: 'Himachal Pradesh',coords: [77.2, 31.6], score: 5.9,  risk: 'safe',     r: 10 },
];

const RegionalIntelligence = () => {
  const [tooltip, setTooltip] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  const handleMouseEnter = (e, marker) => {
    const rect = mapRef?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({
      ...marker,
      x: e.clientX - rect.left + 14,
      y: e.clientY - rect.top  - 14,
    });
  };

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
          <Card className="map-card" style={{ position: 'relative' }}>
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

            {/* Map container */}
            <div
              className="india-map-container"
              ref={setMapRef}
              style={{ position: 'relative' }}
            >
              {/* Tooltip */}
              {tooltip && (
                <div className="map-tooltip" style={{ top: tooltip.y, left: tooltip.x }}>
                  <strong>{tooltip.name}</strong>
                  <div>DR Score: <b>{tooltip.score}%</b></div>
                  <div className="tooltip-risk">
                    <span
                      className="legend-dot"
                      style={{ background: RISK_COLORS[tooltip.risk], width: 8, height: 8 }}
                    />
                    {RISK_LABELS[tooltip.risk]}
                  </div>
                </div>
              )}

              <ComposableMap
                projection="geoMercator"
                projectionConfig={{ scale: 1050, center: [82.0, 22.5] }}
                width={600}
                height={480}
                style={{ width: '100%', height: '100%' }}
              >
                {/* India country outline */}
                <Geographies geography={WORLD_ATLAS_URL}>
                  {({ geographies }) =>
                    geographies
                      .filter(geo => geo.id === '356')
                      .map(geo => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="#EFF5F3"
                          stroke="#B8CEC9"
                          strokeWidth={1.2}
                          style={{
                            default: { outline: 'none' },
                            hover:   { outline: 'none' },
                            pressed: { outline: 'none' },
                          }}
                        />
                      ))
                  }
                </Geographies>

                {/* State bubble markers */}
                {STATE_MARKERS.map((marker) => (
                  <Marker key={marker.name} coordinates={marker.coords}>
                    {/* Pulse ring for critical states */}
                    {marker.risk === 'critical' && (
                      <circle
                        r={marker.r + 5}
                        fill={RISK_COLORS[marker.risk]}
                        fillOpacity={0.2}
                        stroke="none"
                        className="pulse-ring"
                      />
                    )}
                    <circle
                      r={marker.r}
                      fill={RISK_COLORS[marker.risk]}
                      fillOpacity={0.88}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                      onMouseEnter={(e) => handleMouseEnter(e, marker)}
                      onMouseLeave={() => setTooltip(null)}
                    />
                    {/* Score label inside large bubbles */}
                    {marker.r >= 16 && (
                      <text
                        textAnchor="middle"
                        dy="0.35em"
                        style={{
                          fontSize: marker.r >= 19 ? '7px' : '6px',
                          fill: '#fff',
                          fontWeight: 700,
                          pointerEvents: 'none',
                        }}
                      >
                        {marker.score}%
                      </text>
                    )}
                  </Marker>
                ))}
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
