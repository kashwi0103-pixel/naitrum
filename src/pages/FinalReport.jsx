import React, { useMemo, useId } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './FinalReport.css';

/* ── DR Grade Data ─────────────────────────────────────────────── */
const DR_LABELS = { 0: 'No DR', 1: 'Mild NPDR', 2: 'Moderate NPDR', 3: 'Severe NPDR', 4: 'Proliferative DR' };
const DR_COLORS = { 0: '#10b981', 1: '#f59e0b', 2: '#f97316', 3: '#ef4444', 4: '#7c3aed' };

/* Auto-generated physician notes per grade */
const PHYSICIAN_NOTES = {
  0: `No signs of diabetic retinopathy detected in this screening. The retinal vasculature appears normal with no microaneurysms, haemorrhages, or exudates observed. Continue routine annual screening and maintain good glycaemic control (target HbA1c < 7%). No ophthalmology referral required at this time.`,
  1: `Mild non-proliferative diabetic retinopathy (NPDR) identified. A small number of microaneurysms are present; however, no significant haemorrhages or exudates were detected. Patient should be counselled on strict glycaemic and blood pressure control. Follow-up screening recommended in 12 months or sooner if symptoms worsen.`,
  2: `Moderate non-proliferative diabetic retinopathy (NPDR) detected. Microaneurysms, dot-and-blot haemorrhages, and/or hard exudates are present. Risk of progression to sight-threatening disease is elevated. Referral to an ophthalmologist is recommended within 4–6 weeks. Optimise HbA1c, blood pressure, and lipid management.`,
  3: `Severe non-proliferative diabetic retinopathy (NPDR) identified. Extensive intraretinal haemorrhages, venous beading, or intraretinal microvascular abnormalities (IRMA) are present in multiple quadrants. Urgent ophthalmology referral is required within 1–2 weeks. High risk of progression to proliferative DR. Intensive systemic risk factor management is mandatory.`,
  4: `Proliferative diabetic retinopathy (PDR) detected. Neovascularisation on disc (NVD) or elsewhere (NVE) is evident, indicating advanced disease. URGENT referral to a vitreoretinal specialist is required immediately — within 24–48 hours. Laser photocoagulation or anti-VEGF therapy may be indicated. Patient should be advised about the risk of vitreous haemorrhage and traction retinal detachment.`,
};

const PLAN_BY_LEVEL = {
  0: { referral: 'No referral required — continue annual screening', followUp: '12 months', recommendations: ['Maintain HbA1c < 7%', 'Blood pressure control < 130/80 mmHg', 'Annual dilated eye exam', 'Regular physical activity', 'Healthy diet — limit sugar and saturated fats'] },
  1: { referral: 'Non-urgent ophthalmology review within 6 months', followUp: '6–12 months', recommendations: ['Maintain HbA1c < 7%', 'Blood pressure < 130/80 mmHg', 'Lipid profile check and management', 'Avoid smoking / alcohol', 'Monitor for vision changes'] },
  2: { referral: 'Refer to District Hospital Ophthalmology within 4 weeks', followUp: '3–4 months', recommendations: ['Strict HbA1c target < 7%', 'Blood pressure < 130/80 mmHg', 'Statin therapy if indicated', 'Avoid smoking and alcohol', 'Report any sudden vision changes immediately'] },
  3: { referral: 'URGENT — Refer to ophthalmologist within 1–2 weeks', followUp: '1–2 months', recommendations: ['Immediate HbA1c optimisation', 'Aggressive blood pressure control', 'Aspirin/anti-platelet as advised', 'Cease smoking immediately', 'Urgent ophthalmology — may require laser treatment'] },
  4: { referral: 'EMERGENCY — Refer to vitreoretinal specialist within 24–48 hours', followUp: '2–4 weeks post-treatment', recommendations: ['Immediate specialist review', 'Anti-VEGF / laser therapy likely needed', 'Strict bed rest if vitreous haemorrhage suspected', 'No straining or heavy lifting', 'Emergency contact for sudden vision loss'] },
};

const FINDINGS_BY_LEVEL = {
  0: ['No microaneurysms detected', 'No haemorrhages or exudates', 'Normal retinal vasculature', 'Optic disc appears healthy'],
  1: ['Microaneurysms present (mild)', 'No significant haemorrhages', 'No hard exudates detected', 'Early vascular changes noted'],
  2: ['Microaneurysms present', 'Dot-and-blot haemorrhages detected', 'Hard exudates present', 'No neovascularisation'],
  3: ['Extensive intraretinal haemorrhages', 'Venous beading present', 'Intraretinal microvascular abnormalities (IRMA)', 'No neovascularisation yet'],
  4: ['Neovascularisation detected', 'Pre-retinal haemorrhages', 'Fibrovascular proliferation', 'High risk of vitreous haemorrhage'],
};

/* Report ID — stable per render */
const useReportId = () => useMemo(() => `RPT-${Math.floor(Math.random() * 90000 + 10000)}`, []);

export default function FinalReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const reportId = useReportId();

  /* ── Pull real analysis data from sessionStorage ─────────────── */
  const rawResult = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem('dr_result') || 'null'); } catch { return null; }
  }, []);
  const previewUrl = sessionStorage.getItem('dr_preview_url') || null;

  const level = rawResult?.dr_level ?? 2;
  const confidence = rawResult?.confidence ?? 0;
  const referable = rawResult?.referable ?? level >= 2;
  const qualityLabel = rawResult?.quality?.label ?? 'Good';
  const qualityScore = rawResult?.quality?.score ?? 87;

  const drColor  = DR_COLORS[level]  ?? '#6366f1';
  const drLabel  = DR_LABELS[level]  ?? 'Unknown';
  const notes    = PHYSICIAN_NOTES[level];
  const plan     = PLAN_BY_LEVEL[level];
  const findings = FINDINGS_BY_LEVEL[level];

  const now = new Date();
  const examDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const examTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content report-main">

        {/* Toolbar */}
        <div className="report-toolbar no-print">
          <div className="toolbar-left">
            <button className="btn-ghost" onClick={() => navigate(-1)}>← Back</button>
            <h1 className="toolbar-title">Final Diagnostic Report</h1>
          </div>
          <div className="toolbar-right">
            <button className="btn-secondary" onClick={() => navigate('/screening')}>+ New Screening</button>
            <button className="btn-primary" onClick={() => window.print()}>🖨️ Print / Save PDF</button>
          </div>
        </div>

        {/* Printable Report */}
        <div className="report-paper">

          {/* ── Header ── */}
          <div className="report-header">
            <div className="report-logo-block">
              <div className="report-logo-icon">👁️</div>
              <div>
                <h2 className="report-org">नेत्रम — Retinal Screening Platform</h2>
                <p className="report-sub">Diabetic Retinopathy AI Diagnostic Report</p>
              </div>
            </div>
            <div className="report-meta">
              <span className="report-id">Report ID: {reportId}</span>
              <span className="report-date">{examDate} · {examTime}</span>
            </div>
          </div>
          <hr className="report-divider" />

          {/* ── Diagnosis Banner ── */}
          <div className="diagnosis-banner" style={{ borderColor: drColor, background: `${drColor}10` }}>
            <div className="banner-grade" style={{ color: drColor }}>Grade {level}</div>
            <div className="banner-label">{drLabel}</div>
            <div className="banner-confidence">AI Confidence: {(confidence * 100).toFixed(1)}%</div>
            <div className="banner-referral">
              {referable
                ? <span className="badge-referral">⚠️ REFERRAL REQUIRED</span>
                : <span className="badge-no-referral">✓ No Referral Needed</span>}
            </div>
          </div>

          {/* ── Retinal Images Row ── */}
          {(previewUrl || rawResult?.gradcam_image_base64 || rawResult?.vessel_mask_base64 || rawResult?.lesion_mask_base64) && (
            <section className="report-section images-section">
              <h3 className="section-title">Retinal Images &amp; AI Analysis</h3>
              <div className="images-grid">

                {previewUrl && (
                  <div className="img-block">
                    <div className="img-label">Original Fundus Image</div>
                    <img src={previewUrl} alt="Original retinal fundus" className="report-img" />
                    <div className="img-caption">Quality: {qualityLabel} ({qualityScore}%)</div>
                  </div>
                )}

                {rawResult?.gradcam_image_base64 && (
                  <div className="img-block">
                    <div className="img-label">Grad-CAM Heatmap</div>
                    <img
                      src={`data:image/png;base64,${rawResult.gradcam_image_base64}`}
                      alt="Grad-CAM AI focus heatmap"
                      className="report-img"
                    />
                    <div className="img-caption">AI lesion focus regions highlighted</div>
                  </div>
                )}

                {rawResult?.vessel_mask_base64 && previewUrl && (
                  <div className="img-block">
                    <div className="img-label">Vessel Segmentation (U-Net)</div>
                    <div className="vessel-overlay-wrap">
                      <img src={previewUrl} alt="Fundus base" className="report-img" />
                      <img
                        src={`data:image/png;base64,${rawResult.vessel_mask_base64}`}
                        alt="Vessel overlay"
                        className="report-img vessel-overlay"
                      />
                    </div>
                    <div className="img-caption">Green: predicted retinal vascular structure</div>
                  </div>
                )}

                {rawResult?.lesion_mask_base64 && (
                  <div className="img-block">
                    <div className="img-label">Lesion Detection Mask</div>
                    <img
                      src={`data:image/png;base64,${rawResult.lesion_mask_base64}`}
                      alt="Detected lesion mask"
                      className="report-img"
                    />
                    <div className="img-caption">Microaneurysms / haemorrhages / exudates</div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Main two-col grid ── */}
          <div className="report-grid">
            {/* LEFT */}
            <div className="report-left">

              {/* Exam details */}
              <section className="report-section">
                <h3 className="section-title">Examination Details</h3>
                <table className="info-table">
                  <tbody>
                    <tr><td>Date &amp; Time</td><td>{examDate}, {examTime}</td></tr>
                    <tr><td>Platform</td><td>नेत्रम AI v2.0</td></tr>
                    <tr><td>Image Quality</td><td>{qualityLabel} ({qualityScore}%)</td></tr>
                    <tr><td>AI Model</td><td>EfficientNet-B4 + UNet (ONNX)</td></tr>
                    <tr><td>DR Grade</td><td><strong style={{ color: drColor }}>Grade {level} — {drLabel}</strong></td></tr>
                    <tr><td>Confidence</td><td>{(confidence * 100).toFixed(1)}%</td></tr>
                    <tr><td>Referral Status</td><td>{referable ? 'Referral Required' : 'Not Required'}</td></tr>
                  </tbody>
                </table>
              </section>

              {/* AI Findings */}
              <section className="report-section">
                <h3 className="section-title">AI Findings</h3>
                <ul className="findings-list">
                  {findings.map((f, i) => <li key={i}>• {f}</li>)}
                </ul>
              </section>

              {/* Management Plan */}
              <section className="report-section">
                <h3 className="section-title">Management Plan</h3>
                <div className="plan-block">
                  <div className="plan-item referral-item">
                    <span className="plan-icon">🏥</span>
                    <span>{plan.referral}</span>
                  </div>
                  <div className="plan-item">
                    <span className="plan-icon">📅</span>
                    <span>Follow-up: <strong>{plan.followUp}</strong></span>
                  </div>
                </div>
                <ul className="recommendations-list">
                  {plan.recommendations.map((r, i) => <li key={i}>✓ {r}</li>)}
                </ul>
              </section>
            </div>

            {/* RIGHT */}
            <div className="report-right">

              {/* Confidence bar */}
              <section className="report-section">
                <h3 className="section-title">AI Confidence Score</h3>
                <div className="confidence-row">
                  <span>Confidence</span>
                  <div className="confidence-bar-wrap">
                    <div className="confidence-bar-fill" style={{ width: `${confidence * 100}%`, background: drColor }} />
                  </div>
                  <span>{(confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="decision-source">✅ Generated by नेत्रम AI — Grade {level}: {drLabel}</div>
                <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.5rem', fontStyle: 'italic', background: '#f8fafc', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  ℹ️ <strong>Clinical Rule:</strong> Grades 0–1 are considered Non-Referable. Grades 2–4 require specialist Referral.
                </div>
              </section>

              {/* Physician Notes — auto-generated from grade */}
              <section className="report-section">
                <h3 className="section-title">Physician Notes</h3>
                <p className="doctor-notes-text">{notes}</p>
              </section>

              {/* Signature */}
              <section className="signature-block">
                <div className="sig-line"></div>
                <p className="sig-name"><strong>नेत्रम AI Screening System</strong></p>
                <p className="sig-role">Automated AI Diagnostic Report</p>
                <p className="sig-time">Generated: {now.toLocaleString('en-IN')}</p>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="report-footer">
            <p>This report was generated by नेत्रम AI Screening Platform. It is intended to assist clinical decision-making and does not replace professional medical advice.</p>
            <p>For queries: support@drsahayak.gov.in | Helpline: 1800-XXX-XXXX</p>
          </div>
        </div>
      </main>
    </div>
  );
}
