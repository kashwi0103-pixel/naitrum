import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import {
  ArrowLeft, MessageSquare, PhoneCall, UserCheck, CheckCircle2,
  AlertTriangle, Clock, RefreshCw, Send, XCircle, Mic
} from 'lucide-react';
import {
  INITIAL_PATIENTS, SMS_TEMPLATES, getProbabilityCategory,
  getRiskColor, computeReturnProbability
} from '../../data/careConversionData';
import './CareConversionProfile.css';

// ---------- Helpers ----------
function loadPatients() {
  try {
    const s = sessionStorage.getItem('cc_patients');
    return s ? JSON.parse(s) : INITIAL_PATIENTS;
  } catch { return INITIAL_PATIENTS; }
}
function savePatients(ps) {
  sessionStorage.setItem('cc_patients', JSON.stringify(ps));
}

function buildSmsText(patient, templateKey, lang) {
  const tpl = SMS_TEMPLATES[templateKey];
  if (!tpl) return '';
  return (tpl[lang] || tpl['en'])(patient);
}

// ---------- Sub-components ----------

/** Circular probability ring */
function ProbRing({ value, color }) {
  const r = 48, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  const dash = ((100 - value) / 100) * circ;
  return (
    <div className="cc-prob-ring">
      <svg viewBox="0 0 120 120">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={dash}
          strokeLinecap="round"
        />
      </svg>
      <div className="cc-prob-ring-label">
        <div className="cc-prob-ring-pct" style={{ color }}>{value}%</div>
        <div className="cc-prob-ring-sub">likelihood</div>
      </div>
    </div>
  );
}

/** Visual timeline */
function Timeline({ timeline }) {
  const statusIcon = (s) => {
    if (s === 'completed') return { icon: '✓', bg: '#10b981', color: '#fff', border: '#10b981' };
    if (s === 'missed') return { icon: '✗', bg: '#fee2e2', color: '#dc2626', border: '#dc2626' };
    return { icon: '○', bg: '#fff', color: '#94a3b8', border: '#e2e8f0' };
  };
  return (
    <div className="cc-timeline">
      {timeline.map((item, i) => {
        const { icon, bg, color, border } = statusIcon(item.status);
        const lineActive = item.status === 'completed';
        const lineMissed = item.status === 'missed';
        return (
          <div key={item.stage} className="cc-timeline-item">
            <div className="cc-timeline-left">
              <div className="cc-timeline-dot" style={{ background: bg, color, borderColor: border }}>
                {icon}
              </div>
              {i < timeline.length - 1 && (
                <div className={`cc-timeline-line ${lineActive ? 'active' : lineMissed ? 'missed' : ''}`} />
              )}
            </div>
            <div className="cc-timeline-content">
              <div className="cc-timeline-stage" style={{
                color: item.status === 'completed' ? '#059669' : item.status === 'missed' ? '#dc2626' : '#64748b'
              }}>{item.stage}</div>
              <div className="cc-timeline-date">{item.date || (item.status === 'pending' ? 'Pending' : 'Not yet')}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** SMS Tab */
function SmsTab({ patient, onAction }) {
  const [lang, setLang] = useState(patient.preferredLanguage || 'hi');
  const [template, setTemplate] = useState(
    patient.urgency === 'CRITICAL' || patient.urgency === 'URGENT' ? 'urgent_followup' : 'appointment_reminder'
  );
  const [sent, setSent] = useState(patient.smsStatus === 'Confirmed' || patient.smsHistory?.length > 0);
  const smsText = buildSmsText(patient, template, lang);
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const handleSend = () => {
    setSent(true);
    onAction('sms_sent', { template, lang });
  };

  return (
    <div>
      <div className="cc-strategy-badge">📋 Strategy: {patient.reminderStrategy}</div>

      {/* SMS History */}
      {patient.smsHistory?.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.5rem' }}>SMS HISTORY</div>
          <div className="cc-sms-history">
            {patient.smsHistory.map((s, i) => (
              <div key={i} className="cc-sms-history-item">
                <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '0.15rem 0.5rem', borderRadius: 12, fontWeight: 700 }}>{s.status}</span>
                <span style={{ color: '#64748b' }}>{s.date}</span>
                <span style={{ color: '#94a3b8' }}>· {s.template?.replace(/_/g,' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="cc-sms-controls">
        <select className="cc-select" value={template} onChange={e => setTemplate(e.target.value)}>
          <option value="appointment_reminder">Appointment Reminder</option>
          <option value="urgent_followup">Urgent Follow-up</option>
          <option value="missed_appointment">Missed Appointment</option>
          <option value="reschedule">Rescheduling</option>
          <option value="rescreen_reminder">Rescreen Reminder</option>
        </select>
        <select className="cc-select" value={lang} onChange={e => setLang(e.target.value)}>
          <option value="hi">🇮🇳 Hindi</option>
          <option value="en">🇬🇧 English</option>
        </select>
      </div>

      {/* Phone Preview */}
      <div className="cc-sms-phone">
        <div className="cc-sms-phone-header">
          <div className="cc-sms-phone-status" />
          <div className="cc-sms-phone-contact">{patient.contact}</div>
          <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>SMS</div>
        </div>
        <div className="cc-sms-bubble">{smsText}</div>
        <div className="cc-sms-time">{now}</div>
      </div>

      {/* Action Buttons */}
      {sent ? (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '0.875rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: 600 }}>
          <CheckCircle2 size={18} /> SMS Sent — waiting for patient response
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="cc-btn cc-btn-primary" onClick={handleSend}>
            <Send size={15} /> Send SMS
          </button>
          <button className="cc-btn cc-btn-secondary" onClick={() => onAction('sms_scheduled')}>
            <Clock size={15} /> Schedule SMS
          </button>
        </div>
      )}

      {/* Response Tracking */}
      {sent && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Simulate Patient Response (for demo):</div>
          <div className="cc-response-grid">
            {[
              { label: '✅ Patient Confirmed', cls: 'selected-green', action: 'confirmed' },
              { label: '📅 Rescheduled', cls: 'selected-amber', action: 'rescheduled' },
              { label: '🔇 No Response', cls: 'selected-red', action: 'no_response' },
              { label: '❌ Appointment Missed', cls: 'selected-red', action: 'missed' },
            ].map(r => (
              <button key={r.action} className={`cc-response-btn ${patient.smsStatus === r.action ? r.cls : ''}`}
                onClick={() => onAction('sms_response', { response: r.action })}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** Voice Call Tab */
function VoiceTab({ patient, onAction }) {
  const [callState, setCallState] = useState(patient.voiceCallStatus || 'Pending');

  const handleCall = () => { setCallState('Calling...'); setTimeout(() => setCallState('Ringing'), 1200); };
  const handleAnswered = () => { setCallState('Answered'); onAction('call_answered'); };
  const handleNoAnswer = () => { setCallState('No Answer'); onAction('call_no_answer'); };

  return (
    <div className="cc-escalation-flow">
      <div className={`cc-escalation-step ${callState === 'Answered' ? 'step-done' : callState === 'No Answer' ? 'step-danger' : 'step-active'}`}>
        <div className="cc-step-title">
          <Mic size={16} /> Voice Follow-up
        </div>
        <div className="cc-step-desc">
          Patient: <strong>{patient.name}</strong> · Language: <strong>{patient.preferredLanguage === 'hi' ? 'Hindi' : 'English'}</strong>
          <br />Contact: <strong>{patient.contact}</strong>
          <br />Reason: Unconfirmed high-risk appointment
        </div>
        <div style={{ marginBottom: '0.75rem', fontSize: '0.85rem' }}>
          Status: <span style={{ fontWeight: 700, color: callState === 'Answered' ? '#059669' : callState === 'No Answer' ? '#dc2626' : '#d97706' }}>{callState}</span>
        </div>
        <div className="cc-step-actions">
          <button className="cc-btn cc-btn-primary" onClick={handleCall} disabled={callState === 'Answered'}>
            <PhoneCall size={14} /> Call Patient
          </button>
          <button className="cc-btn cc-btn-success" onClick={handleAnswered} disabled={callState === 'Answered'}>
            <CheckCircle2 size={14} /> Mark Answered
          </button>
          <button className="cc-btn cc-btn-danger" onClick={handleNoAnswer} disabled={callState === 'No Answer'}>
            <XCircle size={14} /> No Response
          </button>
        </div>
      </div>

      {(callState === 'No Answer' || patient.voiceCallStatus === 'No Answer') && (
        <div className="cc-escalation-step step-danger" style={{ marginTop: '0.5rem' }}>
          <div className="cc-step-title"><AlertTriangle size={16} style={{ color: '#dc2626' }} /> Voice Call Failed</div>
          <div className="cc-step-desc">Patient did not answer. System recommends escalation to ASHA / Community Health Worker.</div>
          <div className="cc-step-actions">
            <button className="cc-btn cc-btn-danger" onClick={() => onAction('escalate_to_asha')}>
              <UserCheck size={14} /> Escalate to Health Worker
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** ASHA / Health Worker Tab */
function AshaTab({ patient, onAction }) {
  const worker = patient.ashWorker || { name: 'Sunita Devi', id: 'ASHA-042', village: patient.village, phone: '+91-98765-XXXXX' };
  const [assigned, setAssigned] = useState(patient.healthWorkerStatus === 'Assigned');
  const [contacted, setContacted] = useState(false);

  return (
    <div className="cc-escalation-flow">
      <div className="cc-escalation-step step-danger">
        <div className="cc-step-title"><AlertTriangle size={16} style={{ color: '#dc2626' }} /> Escalation Required</div>
        <div className="cc-step-desc">
          <strong>{patient.id}</strong> requires community follow-up.
          <br />Reason: <em>{patient.risk} DR risk + {patient.returnProbability}% predicted return probability + no SMS response.</em>
        </div>
      </div>

      <div className={`cc-escalation-step ${assigned ? 'step-done' : 'step-active'}`}>
        <div className="cc-step-title"><UserCheck size={16} /> Assign ASHA / Health Worker</div>
        <div className="cc-hw-card" style={{ marginBottom: '0.875rem' }}>
          <div className="cc-hw-title">Assigned Health Worker</div>
          {[
            ['ASHA Worker', worker.name],
            ['Worker ID', worker.id],
            ['Village', worker.village],
            ['Phone', worker.phone],
            ['Task', `Visit/contact ${patient.name} and facilitate attendance at ${patient.clinic}.`],
          ].map(([k, v]) => (
            <div className="cc-hw-row" key={k}>
              <span style={{ color: '#065f46', fontWeight: 500 }}>{k}</span>
              <span style={{ color: '#0f172a', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="cc-step-actions">
          {!assigned ? (
            <button className="cc-btn cc-btn-warning" onClick={() => { setAssigned(true); onAction('asha_assigned', { worker }); }}>
              <UserCheck size={14} /> Assign
            </button>
          ) : (
            <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>✓ ASHA Worker Assigned</span>
          )}
        </div>
      </div>

      {assigned && (
        <div className={`cc-escalation-step ${contacted ? 'step-done' : 'step-active'}`}>
          <div className="cc-step-title"><CheckCircle2 size={16} /> Follow-up Actions</div>
          <div className="cc-step-actions">
            <button className="cc-btn cc-btn-secondary" onClick={() => setContacted(true)} disabled={contacted}>
              <CheckCircle2 size={14} /> Mark Contacted
            </button>
            <button className="cc-btn cc-btn-success" onClick={() => onAction('care_attended')}>
              <UserCheck size={14} /> Patient Attended
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Care Completion Tab */
function CompleteTab({ patient, onAction }) {
  const [form, setForm] = useState({
    attended: patient.appointmentStatus === 'Attended',
    treatmentStatus: 'Completed',
    nextReviewMonths: 3,
    nextScreenDate: '18 Dec 2026',
    updatedDrGrade: patient.drGrade,
    updatedProgression: 'Stable',
  });
  const [completed, setCompleted] = useState(patient.careStatus === 'Care Completed');

  const handleComplete = () => {
    setCompleted(true);
    onAction('care_completed', form);
  };

  return (
    <div>
      {completed ? (
        <div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <CheckCircle2 size={32} style={{ color: '#059669', margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 700, color: '#059669', fontSize: '1.1rem' }}>Care Completed</div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 4 }}>Patient attended. Loop closed. Rescreen scheduled.</div>
          </div>

          {/* Longitudinal profile update */}
          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>Updated Retinal Profile</div>
          <div className="cc-profile-update">
            <div className="cc-profile-block">
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 4 }}>OLD PROFILE</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#dc2626' }}>Grade {patient.oldProfile?.drGrade ?? patient.drGrade}</div>
              <div style={{ fontSize: '0.8rem', color: '#ef4444' }}>{patient.oldProfile?.progression ?? patient.progression}</div>
            </div>
            <div className="cc-profile-arrow">→</div>
            <div className="cc-profile-block new-profile">
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: 4 }}>NEW SCREENING</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#059669' }}>Grade {form.updatedDrGrade}</div>
              <div style={{ fontSize: '0.8rem', color: '#10b981' }}>{form.updatedProgression}</div>
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#64748b' }}>Treatment</span>
              <span style={{ fontWeight: 600 }}>{form.treatmentStatus}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#64748b' }}>Next Review</span>
              <span style={{ fontWeight: 600 }}>In {form.nextReviewMonths} months</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Next Screening</span>
              <span style={{ fontWeight: 600, color: '#1e40af' }}>{form.nextScreenDate}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="cc-complete-form">
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem', lineHeight: 1.5 }}>
            Record care completion to close the loop and schedule rescreening.
          </div>
          <label>Treatment Status</label>
          <select value={form.treatmentStatus} onChange={e => setForm({ ...form, treatmentStatus: e.target.value })}>
            <option>Attended — Under Assessment</option>
            <option>Treatment Initiated</option>
            <option>Completed</option>
            <option>Referral to Specialist</option>
          </select>
          <label>Next Review (Months)</label>
          <select value={form.nextReviewMonths} onChange={e => setForm({ ...form, nextReviewMonths: Number(e.target.value) })}>
            <option value={1}>1 Month</option>
            <option value={3}>3 Months</option>
            <option value={6}>6 Months</option>
            <option value={12}>12 Months</option>
          </select>
          <label>Rescreen Date</label>
          <input type="text" value={form.nextScreenDate} onChange={e => setForm({ ...form, nextScreenDate: e.target.value })} />
          <label>Updated DR Grade (post-treatment)</label>
          <select value={form.updatedDrGrade} onChange={e => setForm({ ...form, updatedDrGrade: Number(e.target.value) })}>
            {[0,1,2,3,4].map(g => <option key={g} value={g}>Grade {g}</option>)}
          </select>
          <label>Updated Progression</label>
          <select value={form.updatedProgression} onChange={e => setForm({ ...form, updatedProgression: e.target.value })}>
            <option>Stable</option>
            <option>Improving</option>
            <option>Slow Progression</option>
            <option>Worsening</option>
          </select>
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
            <button className="cc-btn cc-btn-success" onClick={handleComplete}>
              <CheckCircle2 size={14} /> Mark Care Completed
            </button>
            <button className="cc-btn cc-btn-secondary" onClick={() => onAction('rescreen_scheduled')}>
              <RefreshCw size={14} /> Schedule Rescreen Only
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN PROFILE PAGE
// ============================================================
export default function CareConversionProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patients, setPatients] = useState(loadPatients);
  const [activeTab, setActiveTab] = useState('sms');
  const [toast, setToast] = useState(null);

  const patient = patients.find(p => p.id === id);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  const updatePatient = useCallback((updater) => {
    setPatients(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updater(p) } : p);
      savePatients(next);
      return next;
    });
  }, [id]);

  const handleAction = useCallback((action, payload) => {
    switch (action) {
      case 'sms_sent':
        updatePatient(p => ({
          smsStatus: 'Sent',
          communicationStatus: 'SMS Sent',
          smsHistory: [...(p.smsHistory || []), { date: 'Just now', status: 'Sent', template: payload.template, lang: payload.lang }],
          timeline: p.timeline.map(t => t.stage === 'REMINDER SENT' ? { ...t, status: 'completed', date: 'Today' } : t),
          nextAction: 'wait_response',
        }));
        showToast('✅ SMS sent to ' + patient.contact);
        break;

      case 'sms_response':
        if (payload.response === 'confirmed') {
          updatePatient(p => ({
            smsStatus: 'Confirmed', communicationStatus: 'Confirmed', appointmentStatus: 'Confirmed',
            nextAction: 'none',
            timeline: p.timeline.map(t => t.stage === 'PATIENT RESPONSE' ? { ...t, status: 'completed', date: 'Today' } : t),
          }));
          showToast('Patient confirmed appointment!');
        } else if (payload.response === 'no_response') {
          updatePatient(p => ({
            smsStatus: 'No Response', communicationStatus: 'No Response',
            nextAction: 'initiate_call',
          }));
          setActiveTab('call');
          showToast('No response. Recommend voice call.');
        } else if (payload.response === 'missed') {
          updatePatient(p => ({
            appointmentStatus: 'Missed', communicationStatus: 'Missed',
            escalationLevel: Math.min((p.escalationLevel || 0) + 1, 3),
            nextAction: 'asha_outreach',
            timeline: p.timeline.map(t =>
              t.stage === 'APPOINTMENT' ? { ...t, status: 'missed' } :
              t.stage === 'PATIENT RESPONSE' ? { ...t, status: 'missed' } : t
            ),
          }));
          setActiveTab('asha');
          showToast('Appointment marked missed. ASHA escalation recommended.');
        } else if (payload.response === 'rescheduled') {
          updatePatient(() => ({ appointmentStatus: 'Rescheduled', communicationStatus: 'Rescheduled', nextAction: 'none' }));
          showToast('Appointment rescheduled.');
        }
        break;

      case 'call_answered':
        updatePatient(() => ({ voiceCallStatus: 'Answered', nextAction: 'none' }));
        showToast('Call answered — marking confirmed.');
        break;

      case 'call_no_answer':
        updatePatient(p => ({
          voiceCallStatus: 'No Answer',
          escalationLevel: Math.min((p.escalationLevel || 0) + 1, 3),
          nextAction: 'asha_outreach',
          communicationStatus: 'Escalated',
        }));
        setActiveTab('asha');
        showToast('No answer. Escalating to ASHA worker.');
        break;

      case 'escalate_to_asha':
        updatePatient(p => ({
          escalationLevel: 3,
          nextAction: 'asha_outreach',
          healthWorkerStatus: 'Assigned',
          ashWorker: { name: 'Sunita Devi', id: 'ASHA-042', village: p.village, phone: '+91-98765-XXXXX' },
        }));
        setActiveTab('asha');
        showToast('Escalated to ASHA Worker Sunita Devi.');
        break;

      case 'asha_assigned':
        updatePatient(() => ({ healthWorkerStatus: 'Assigned', ashWorker: payload.worker }));
        showToast('ASHA Worker assigned!');
        break;

      case 'care_attended':
        updatePatient(p => ({
          appointmentStatus: 'Attended',
          communicationStatus: 'Attended',
          timeline: p.timeline.map(t =>
            t.stage === 'APPOINTMENT' ? { ...t, status: 'completed', date: 'Today' } : t
          ),
        }));
        setActiveTab('complete');
        showToast('Patient attended! Mark care completion.');
        break;

      case 'care_completed':
        updatePatient(p => ({
          careStatus: 'Care Completed',
          appointmentStatus: 'Completed',
          communicationStatus: 'Care Completed',
          nextRescreenDate: payload.nextScreenDate,
          nextAction: 'none',
          newProfile: { drGrade: payload.updatedDrGrade, progression: payload.updatedProgression },
          timeline: p.timeline.map(t =>
            t.stage === 'CARE COMPLETED' ? { ...t, status: 'completed', date: 'Today' } :
            t.stage === 'RESCREEN' ? { ...t, status: 'pending', date: payload.nextScreenDate } : t
          ),
        }));
        showToast('🎉 Care completed! Rescreen scheduled for ' + payload.nextScreenDate);
        break;

      case 'sms_scheduled':
        showToast('SMS scheduled for tomorrow at 9:00 AM');
        break;

      default:
        break;
    }
  }, [updatePatient, showToast, patient]);

  if (!patient) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content cc-profile-main">
          <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            <AlertTriangle size={48} style={{ margin: '0 auto 1rem' }} />
            <p>Patient not found. <button className="cc-btn cc-btn-secondary" onClick={() => navigate('/care-conversion')}>Back to Dashboard</button></p>
          </div>
        </main>
      </div>
    );
  }

  const probCat = getProbabilityCategory(patient.returnProbability);

  const TABS = [
    { id: 'sms', label: 'SMS Reminder', icon: MessageSquare },
    { id: 'call', label: 'Voice Call', icon: PhoneCall },
    { id: 'asha', label: 'ASHA Escalation', icon: UserCheck },
    { id: 'complete', label: 'Care Completion', icon: CheckCircle2 },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content" style={{ padding: '2rem', background: '#f8fafc', overflowY: 'auto' }}>

        {/* Header */}
        <div className="cc-profile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="cc-back-btn" onClick={() => navigate('/care-conversion')}>
              <ArrowLeft size={16} /> Back
            </button>
            <div>
              <h1 className="cc-profile-title">{patient.name}</h1>
              <p className="cc-profile-subtitle">{patient.id} · {patient.village} · Care Conversion Profile</p>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', padding: '0.3rem 0.75rem', borderRadius: '20px', fontWeight: 600 }}>
            PROTOTYPE — Prediction not clinically validated
          </span>
        </div>

        <div className="cc-profile-grid">

          {/* LEFT COLUMN */}
          <div>

            {/* Patient Profile */}
            <div className="cc-card">
              <div className="cc-card-title">Patient Profile</div>
              {[
                ['Name', patient.name],
                ['Patient ID', patient.id],
                ['Age', patient.age + ' years'],
                ['Village', patient.village],
                ['Contact', patient.contact],
                ['Preferred Language', patient.preferredLanguage === 'hi' ? 'Hindi (हिंदी)' : 'English'],
                ['Distance to Clinic', patient.distanceKm + ' km'],
              ].map(([k, v]) => (
                <div className="cc-field-row" key={k}>
                  <span className="cc-field-key">{k}</span>
                  <span className="cc-field-val">{v}</span>
                </div>
              ))}
            </div>

            {/* Clinical Status */}
            <div className="cc-card">
              <div className="cc-card-title">Clinical Status</div>
              {[
                ['DR Grade', `Grade ${patient.drGrade} — ${patient.drLabel}`],
                ['Risk Level', patient.risk],
                ['Progression', patient.progression],
                ['Referral Date', patient.referralDate],
                ['Follow-up Date', patient.followUpDate],
                ['Clinic', patient.clinic],
              ].map(([k, v]) => (
                <div className="cc-field-row" key={k}>
                  <span className="cc-field-key">{k}</span>
                  <span className="cc-field-val" style={{ color: k === 'Risk Level' ? getRiskColor(patient.risk) : undefined }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Return Probability */}
            <div className="cc-card">
              <div className="cc-card-title">Predicted Follow-up Likelihood</div>
              <div className="cc-prob-ring-wrap">
                <ProbRing value={patient.returnProbability} color={probCat.color} />
                <div className="cc-prob-category" style={{ background: probCat.bg, color: probCat.textColor }}>
                  {probCat.label}
                </div>
                <div className="cc-prob-note">
                  Prototype care-management prediction. Not clinically validated.
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.6 }}>
                <strong>Factors considered:</strong> DR Grade {patient.drGrade} · {patient.missedAppointments} missed appointments ·
                Access difficulty: {patient.accessDifficulty} · Previous attendance: {patient.prevAttendance ? 'Yes' : 'No'} ·
                Response: {patient.smsStatus}
              </div>
            </div>

            {/* Care Timeline */}
            <div className="cc-card">
              <div className="cc-card-title">Care Pathway Timeline</div>
              <Timeline timeline={patient.timeline} />
              {patient.nextRescreenDate && (
                <div style={{ marginTop: '1rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '0.75rem', fontSize: '0.85rem', color: '#0369a1' }}>
                  <strong>Next Rescreen Scheduled:</strong> {patient.nextRescreenDate}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div>

            {/* Communication Status */}
            <div className="cc-card" style={{ marginBottom: '1rem' }}>
              <div className="cc-card-title">Care Conversion Status</div>
              {[
                ['Return Probability', patient.returnProbability + '%'],
                ['Last Communication', patient.smsHistory?.at(-1)?.date || 'None'],
                ['SMS Status', patient.smsStatus],
                ['Voice Call', patient.voiceCallStatus],
                ['ASHA Worker', patient.healthWorkerStatus],
                ['Appointment Status', patient.appointmentStatus],
                ['Care Status', patient.careStatus],
              ].map(([k, v]) => (
                <div className="cc-field-row" key={k}>
                  <span className="cc-field-key">{k}</span>
                  <span className="cc-field-val" style={{
                    color: v?.includes('No Response') || v?.includes('Missed') ? '#dc2626' :
                      v?.includes('Confirmed') || v?.includes('Completed') ? '#059669' : undefined
                  }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Recommended Next Action Banner */}
            {patient.nextAction !== 'none' && patient.careStatus !== 'Care Completed' && (
              <div style={{
                background: patient.nextAction === 'asha_outreach' ? '#fee2e2' : '#fffbeb',
                border: `1px solid ${patient.nextAction === 'asha_outreach' ? '#fca5a5' : '#fde68a'}`,
                borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1rem'
              }}>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>💡 Recommended Next Action</div>
                <div style={{ color: patient.nextAction === 'asha_outreach' ? '#dc2626' : '#92400e', fontSize: '0.875rem', fontWeight: 600 }}>
                  {patient.nextAction === 'send_sms' && '→ Send SMS Reminder'}
                  {patient.nextAction === 'initiate_call' && '→ Initiate Voice Follow-up Call'}
                  {patient.nextAction === 'asha_outreach' && '→ Escalate to ASHA / Community Health Worker'}
                  {patient.nextAction === 'wait_response' && '→ Awaiting patient response…'}
                </div>
              </div>
            )}

            {/* Action Tabs */}
            <div className="cc-action-panel">
              <div className="cc-action-tabs">
                {TABS.map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.id} className={`cc-action-tab ${activeTab === t.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(t.id)}>
                      <Icon size={15} /> {t.label}
                    </button>
                  );
                })}
              </div>
              <div className="cc-action-body">
                {activeTab === 'sms' && <SmsTab patient={patient} onAction={handleAction} />}
                {activeTab === 'call' && <VoiceTab patient={patient} onAction={handleAction} />}
                {activeTab === 'asha' && <AshaTab patient={patient} onAction={handleAction} />}
                {activeTab === 'complete' && <CompleteTab patient={patient} onAction={handleAction} />}
              </div>
            </div>

          </div>
        </div>
      </main>

      {toast && <div className="cc-toast">✅ {toast}</div>}
    </div>
  );
}
