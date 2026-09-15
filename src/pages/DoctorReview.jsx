import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Card from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import Button from '../components/shared/Button';
import { CheckCircle2, Edit3, AlertTriangle, Stethoscope, ChevronDown, FileText } from 'lucide-react';
import './DoctorReview.css';

const DoctorReview = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [decision, setDecision] = useState('accept'); // 'accept' | 'override'
  const [overrideDrLevel, setOverrideDrLevel] = useState(0);
  const [overrideNotes, setOverrideNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('dr_result');
    const preview = sessionStorage.getItem('dr_preview_url');
    if (stored) setResult(JSON.parse(stored));
    if (preview) setPreviewUrl(preview);
  }, []);

  const handleSubmit = () => {
    const review = {
      decision,
      doctorDrLevel: decision === 'override' ? overrideDrLevel : result?.dr_level,
      doctorNotes: overrideNotes,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'Dr. Priya Menon',
    };
    sessionStorage.setItem('dr_review', JSON.stringify(review));
    setSubmitted(true);
    setTimeout(() => navigate('/report'), 1200);
  };

  const getDrLevelColor = (level) => {
    if (level >= 3) return 'critical';
    if (level === 2) return 'fail';
    if (level === 1) return 'borderline';
    return 'pass';
  };

  if (!result) {
    return (
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <div className="no-result-state">
            <AlertTriangle size={48} className="text-borderline" />
            <h2>No Analysis Result Found</h2>
            <p>Please run a screening first before reviewing.</p>
            <Button variant="primary" size="md" onClick={() => navigate('/screening')}>
              Go to Screening
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="page-header fade-in">
          <div>
            <h1 className="page-title">Doctor Review</h1>
            <p className="page-subtitle">Review AI analysis and confirm or override the clinical decision</p>
          </div>
          <Badge status="digital">Awaiting Doctor Decision</Badge>
        </header>

        <div className="review-grid fade-in">

          {/* Left: AI Summary */}
          <div className="review-left">
            <Card className="ai-summary-card">
              <h3 className="card-title">AI Analysis Summary</h3>

              <div className={`dr-level-display level-${getDrLevelColor(result.dr_level)}`}>
                <span className="dr-level-num">{result.dr_level}</span>
                <div>
                  <div className="dr-level-label">DR Level</div>
                  <Badge status={getDrLevelColor(result.dr_level)}>{result.label}</Badge>
                </div>
              </div>

              <div className="summary-rows">
                {[
                  ['Confidence', `${(result.confidence * 100).toFixed(1)}%`],
                  ['Referable', result.referable ? 'YES — Specialist needed' : 'No'],
                  ['Image Quality', result.quality?.label || '—'],
                ].map(([k, v]) => (
                  <div className="summary-row" key={k}>
                    <span className="summary-key">{k}</span>
                    <span className="summary-val">{v}</span>
                  </div>
                ))}
              </div>

              {/* Fundus + vessel overlay */}
              {previewUrl && (
                <div className="review-image-wrapper">
                  <div style={{ position: 'relative' }}>
                    <img src={previewUrl} alt="Fundus" className="review-fundus" />
                    {result.vessel_mask_base64 && (
                      <img
                        src={`data:image/png;base64,${result.vessel_mask_base64}`}
                        alt="Vessel overlay"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 8 }}
                      />
                    )}
                  </div>
                  {result.gradcam_image_base64 && (
                    <>
                      <p className="image-label">Grad-CAM Heatmap</p>
                      <img
                        src={`data:image/png;base64,${result.gradcam_image_base64}`}
                        alt="Grad-CAM"
                        className="review-fundus"
                      />
                    </>
                  )}
                  {result.lesion_mask_base64 && (
                    <>
                      <p className="image-label">Lesion Detection</p>
                      <img
                        src={`data:image/png;base64,${result.lesion_mask_base64}`}
                        alt="Lesion mask"
                        className="review-fundus"
                      />
                    </>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Right: Decision Panel */}
          <div className="review-right">
            <Card className="decision-card">
              <h3 className="card-title">
                <Stethoscope size={18} /> Clinical Decision
              </h3>

              {/* Accept / Override toggle */}
              <div className="decision-toggle">
                <button
                  className={`toggle-btn ${decision === 'accept' ? 'active-accept' : ''}`}
                  onClick={() => setDecision('accept')}
                >
                  <CheckCircle2 size={18} /> Accept AI Decision
                </button>
                <button
                  className={`toggle-btn ${decision === 'override' ? 'active-override' : ''}`}
                  onClick={() => setDecision('override')}
                >
                  <Edit3 size={18} /> Override Decision
                </button>
              </div>

              {decision === 'accept' && (
                <div className="accept-summary">
                  <p>You are confirming the AI diagnosis of <strong>DR Level {result.dr_level} — {result.label}</strong>.</p>
                  <p className="text-secondary" style={{ fontSize: '0.875rem', marginTop: 4 }}>
                    This will be recorded in the final report.
                  </p>
                </div>
              )}

              {decision === 'override' && (
                <div className="override-form fade-in">
                  <label className="form-label">Override DR Level</label>
                  <div className="select-wrapper">
                    <select
                      className="form-select"
                      value={overrideDrLevel}
                      onChange={(e) => setOverrideDrLevel(Number(e.target.value))}
                    >
                      <option value={0}>Level 0 — No DR</option>
                      <option value={1}>Level 1 — Mild NPDR</option>
                      <option value={2}>Level 2 — Moderate NPDR</option>
                      <option value={3}>Level 3 — Severe NPDR</option>
                      <option value={4}>Level 4 — PDR (Proliferative)</option>
                    </select>
                    <ChevronDown size={16} className="select-icon" />
                  </div>

                  <label className="form-label" style={{ marginTop: 16 }}>Clinical Notes (required for override)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe the reason for overriding the AI decision..."
                    value={overrideNotes}
                    onChange={(e) => setOverrideNotes(e.target.value)}
                    rows={4}
                  />
                  {decision === 'override' && overrideNotes.trim().length < 10 && (
                    <p className="form-hint text-critical">Please provide at least a brief clinical rationale.</p>
                  )}
                </div>
              )}

              <div className="decision-actions">
                {submitted ? (
                  <div className="submitted-state">
                    <CheckCircle2 size={24} className="text-pass" />
                    <span>Decision recorded. Generating report...</span>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={decision === 'override' && overrideNotes.trim().length < 10}
                  >
                    <FileText size={18} />
                    {decision === 'accept' ? 'Confirm & Generate Report' : 'Submit Override & Generate Report'}
                  </Button>
                )}
              </div>
            </Card>

            {/* Diagnostic guidelines quick ref */}
            <Card className="guidelines-card">
              <h4 className="card-title">DR Grading Reference</h4>
              <div className="guidelines-list">
                {[
                  { level: 0, label: 'No DR', desc: 'No abnormalities', color: 'pass' },
                  { level: 1, label: 'Mild NPDR', desc: 'Microaneurysms only', color: 'borderline' },
                  { level: 2, label: 'Moderate NPDR', desc: 'More than mild but less than severe', color: 'borderline' },
                  { level: 3, label: 'Severe NPDR', desc: '20+ intraretinal hemorrhages, venous beading, IRMA', color: 'fail' },
                  { level: 4, label: 'PDR', desc: 'Neovascularization, vitreous hemorrhage, tractional detachment', color: 'critical' },
                ].map(({ level, label, desc, color }) => (
                  <div className="guideline-row" key={level}>
                    <Badge status={color}>L{level}</Badge>
                    <div>
                      <strong>{label}</strong>
                      <span className="guideline-desc">{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorReview;
