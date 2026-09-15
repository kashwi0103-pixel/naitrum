// ============================================================
// CARE CONVERSION ENGINE — MOCK DATA STORE
// All patient follow-up and care conversion data lives here.
// State is persisted via sessionStorage when actions are taken.
// ============================================================

export const SMS_TEMPLATES = {
  appointment_reminder: {
    en: (p) => `Hello ${p.name},\nYour eye appointment is scheduled on ${p.followUpDate} at ${p.clinic}. Please arrive on time. Contact us if you need to reschedule.`,
    hi: (p) => `नमस्ते ${p.nameSuffix},\nआपकी आँखों की जाँच ${p.followUpDate} को सुबह 10 बजे ${p.clinicHindi}, ${p.village} में निर्धारित है। कृपया समय पर पहुँचें। यदि आप नहीं आ सकते हैं तो दिए गए नंबर पर संपर्क करें।`,
  },
  urgent_followup: {
    en: (p) => `URGENT: ${p.name}, your eye condition requires prompt medical attention. Please visit ${p.clinic} as soon as possible. This message is for your timely care.`,
    hi: (p) => `नमस्ते ${p.nameSuffix},\nआपकी आँखों की जाँच में आगे की जाँच आवश्यक है। कृपया ${p.clinicHindi} पर जल्द संपर्क करें। यह संदेश आपकी समय पर देखभाल के लिए है।`,
  },
  missed_appointment: {
    en: (p) => `Hello ${p.name}, we noticed you missed your appointment on ${p.followUpDate}. Please contact us to reschedule. Your eye health is important.`,
    hi: (p) => `नमस्ते ${p.nameSuffix},\nआप अपनी निर्धारित जाँच पर नहीं आ सके। कृपया हमसे संपर्क करें और नई तारीख तय करें। आपकी आँखों की देखभाल हमारी प्राथमिकता है।`,
  },
  reschedule: {
    en: (p) => `Hello ${p.name}, your appointment has been rescheduled. New date: ${p.followUpDate} at ${p.clinic}. Please confirm by replying YES.`,
    hi: (p) => `नमस्ते ${p.nameSuffix},\nआपकी जाँच की नई तारीख ${p.followUpDate} है। कृपया 'हाँ' लिखकर पुष्टि करें।`,
  },
  rescreen_reminder: {
    en: (p) => `Hello ${p.name}, it is time for your next diabetic retinopathy screening. Please visit your nearest PHC or contact us to schedule.`,
    hi: (p) => `नमस्ते ${p.nameSuffix},\nआपकी अगली रेटिनल जाँच का समय आ गया है। कृपया नजदीकी स्वास्थ्य केंद्र पर जाएँ।`,
  },
};

export const INITIAL_PATIENTS = [
  {
    id: 'PAT-1024',
    name: 'Ramesh Kumar',
    nameSuffix: 'रामेश जी',
    age: 58,
    village: 'Rampur',
    contact: '+91-94201-XXXXX',
    preferredLanguage: 'hi',
    drGrade: 3,
    drLabel: 'Severe NPDR',
    risk: 'VERY HIGH',
    progression: 'Worsening',
    referralDate: '12 Sept 2026',
    followUpDate: '18 Sept 2026',
    urgency: 'URGENT',
    returnProbability: 34,
    missedAppointments: 2,
    prevAttendance: false,
    accessDifficulty: 'High',
    distanceKm: 24,
    clinic: 'Community Health Centre, Bhilpur',
    clinicHindi: 'सामुदायिक स्वास्थ्य केंद्र, भिलपुर',
    reminderStrategy: 'Very High Risk Follow-up',
    smsHistory: [
      { date: '14 Sept', status: 'Sent', template: 'appointment_reminder', lang: 'hi' },
    ],
    smsStatus: 'No Response',
    voiceCallStatus: 'Pending',
    healthWorkerStatus: 'Not Assigned',
    escalationLevel: 1,
    appointmentStatus: 'Unconfirmed',
    communicationStatus: 'No Response',
    nextAction: 'initiate_call',
    careStatus: 'Awaiting Follow-up',
    nextRescreenDate: null,
    timeline: [
      { stage: 'SCREENED', status: 'completed', date: '5 Sept 2026' },
      { stage: 'AI ASSESSED', status: 'completed', date: '5 Sept 2026' },
      { stage: 'REFERRED', status: 'completed', date: '12 Sept 2026' },
      { stage: 'REMINDER SENT', status: 'completed', date: '14 Sept 2026' },
      { stage: 'PATIENT RESPONSE', status: 'missed', date: null },
      { stage: 'APPOINTMENT', status: 'pending', date: '18 Sept 2026' },
      { stage: 'CARE COMPLETED', status: 'pending', date: null },
      { stage: 'RESCREEN', status: 'pending', date: null },
    ],
    ashWorker: null,
    oldProfile: { drGrade: 3, progression: 'Worsening' },
    newProfile: null,
  },
  {
    id: 'PAT-1041',
    name: 'Sita Devi',
    nameSuffix: 'सीता जी',
    age: 52,
    village: 'Bhilpur',
    contact: '+91-98301-XXXXX',
    preferredLanguage: 'hi',
    drGrade: 2,
    drLabel: 'Moderate NPDR',
    risk: 'HIGH',
    progression: 'Stable',
    referralDate: '10 Sept 2026',
    followUpDate: '25 Sept 2026',
    urgency: 'ROUTINE',
    returnProbability: 78,
    missedAppointments: 0,
    prevAttendance: true,
    accessDifficulty: 'Low',
    distanceKm: 6,
    clinic: 'District Hospital, Bhilpur',
    clinicHindi: 'जिला अस्पताल, भिलपुर',
    reminderStrategy: 'High Risk Follow-up',
    smsHistory: [
      { date: '18 Sept', status: 'Sent', template: 'appointment_reminder', lang: 'hi' },
    ],
    smsStatus: 'Confirmed',
    voiceCallStatus: 'Not Required',
    healthWorkerStatus: 'Not Assigned',
    escalationLevel: 0,
    appointmentStatus: 'Confirmed',
    communicationStatus: 'Confirmed',
    nextAction: 'none',
    careStatus: 'Appointment Scheduled',
    nextRescreenDate: null,
    timeline: [
      { stage: 'SCREENED', status: 'completed', date: '4 Sept 2026' },
      { stage: 'AI ASSESSED', status: 'completed', date: '4 Sept 2026' },
      { stage: 'REFERRED', status: 'completed', date: '10 Sept 2026' },
      { stage: 'REMINDER SENT', status: 'completed', date: '18 Sept 2026' },
      { stage: 'PATIENT RESPONSE', status: 'completed', date: '18 Sept 2026' },
      { stage: 'APPOINTMENT', status: 'pending', date: '25 Sept 2026' },
      { stage: 'CARE COMPLETED', status: 'pending', date: null },
      { stage: 'RESCREEN', status: 'pending', date: null },
    ],
    ashWorker: null,
    oldProfile: { drGrade: 2, progression: 'Stable' },
    newProfile: null,
  },
  {
    id: 'PAT-1037',
    name: 'Mohan Lal',
    nameSuffix: 'मोहन जी',
    age: 65,
    village: 'Keshavpur',
    contact: '+91-88201-XXXXX',
    preferredLanguage: 'hi',
    drGrade: 2,
    drLabel: 'Moderate NPDR',
    risk: 'HIGH',
    progression: 'Slow Progression',
    referralDate: '8 Sept 2026',
    followUpDate: '17 Sept 2026',
    urgency: 'HIGH',
    returnProbability: 41,
    missedAppointments: 1,
    prevAttendance: true,
    accessDifficulty: 'Medium',
    distanceKm: 15,
    clinic: 'PHC, Keshavpur',
    clinicHindi: 'प्राथमिक स्वास्थ्य केंद्र, केशवपुर',
    reminderStrategy: 'High Risk Follow-up',
    smsHistory: [],
    smsStatus: 'Not Sent',
    voiceCallStatus: 'Not Required',
    healthWorkerStatus: 'Not Assigned',
    escalationLevel: 0,
    appointmentStatus: 'Unconfirmed',
    communicationStatus: 'Awaiting Contact',
    nextAction: 'send_sms',
    careStatus: 'Awaiting Follow-up',
    nextRescreenDate: null,
    timeline: [
      { stage: 'SCREENED', status: 'completed', date: '2 Sept 2026' },
      { stage: 'AI ASSESSED', status: 'completed', date: '2 Sept 2026' },
      { stage: 'REFERRED', status: 'completed', date: '8 Sept 2026' },
      { stage: 'REMINDER SENT', status: 'pending', date: null },
      { stage: 'PATIENT RESPONSE', status: 'pending', date: null },
      { stage: 'APPOINTMENT', status: 'pending', date: '17 Sept 2026' },
      { stage: 'CARE COMPLETED', status: 'pending', date: null },
      { stage: 'RESCREEN', status: 'pending', date: null },
    ],
    ashWorker: null,
    oldProfile: { drGrade: 2, progression: 'Slow Progression' },
    newProfile: null,
  },
  {
    id: 'PAT-1062',
    name: 'Anjali Rao',
    nameSuffix: 'अंजली जी',
    age: 44,
    village: 'Nagpur Peth',
    contact: '+91-79301-XXXXX',
    preferredLanguage: 'en',
    drGrade: 1,
    drLabel: 'Mild NPDR',
    risk: 'MODERATE',
    progression: 'Stable',
    referralDate: '5 Sept 2026',
    followUpDate: '30 Sept 2026',
    urgency: 'ROUTINE',
    returnProbability: 76,
    missedAppointments: 0,
    prevAttendance: true,
    accessDifficulty: 'Low',
    distanceKm: 3,
    clinic: 'Eye Care Centre, Nagpur',
    clinicHindi: 'नेत्र देखभाल केंद्र, नागपुर',
    reminderStrategy: 'Routine Reminder',
    smsHistory: [
      { date: '20 Sept', status: 'Sent', template: 'appointment_reminder', lang: 'en' },
    ],
    smsStatus: 'Confirmed',
    voiceCallStatus: 'Not Required',
    healthWorkerStatus: 'Not Assigned',
    escalationLevel: 0,
    appointmentStatus: 'Confirmed',
    communicationStatus: 'Confirmed',
    nextAction: 'none',
    careStatus: 'Appointment Scheduled',
    nextRescreenDate: null,
    timeline: [
      { stage: 'SCREENED', status: 'completed', date: '30 Aug 2026' },
      { stage: 'AI ASSESSED', status: 'completed', date: '30 Aug 2026' },
      { stage: 'REFERRED', status: 'completed', date: '5 Sept 2026' },
      { stage: 'REMINDER SENT', status: 'completed', date: '20 Sept 2026' },
      { stage: 'PATIENT RESPONSE', status: 'completed', date: '20 Sept 2026' },
      { stage: 'APPOINTMENT', status: 'pending', date: '30 Sept 2026' },
      { stage: 'CARE COMPLETED', status: 'pending', date: null },
      { stage: 'RESCREEN', status: 'pending', date: null },
    ],
    ashWorker: null,
    oldProfile: { drGrade: 1, progression: 'Stable' },
    newProfile: null,
  },
  {
    id: 'PAT-1089',
    name: 'Bharat Singh',
    nameSuffix: 'भरत जी',
    age: 70,
    village: 'Daulatpur',
    contact: '+91-96501-XXXXX',
    preferredLanguage: 'hi',
    drGrade: 4,
    drLabel: 'PDR (Proliferative)',
    risk: 'VERY HIGH',
    progression: 'Rapid Progression',
    referralDate: '1 Sept 2026',
    followUpDate: '10 Sept 2026',
    urgency: 'CRITICAL',
    returnProbability: 28,
    missedAppointments: 3,
    prevAttendance: false,
    accessDifficulty: 'Very High',
    distanceKm: 38,
    clinic: 'Eye Hospital, District HQ',
    clinicHindi: 'जिला मुख्यालय नेत्र अस्पताल',
    reminderStrategy: 'Very High Risk Follow-up',
    smsHistory: [
      { date: '6 Sept', status: 'Sent', template: 'appointment_reminder', lang: 'hi' },
      { date: '9 Sept', status: 'Sent', template: 'urgent_followup', lang: 'hi' },
    ],
    smsStatus: 'No Response',
    voiceCallStatus: 'No Answer',
    healthWorkerStatus: 'Assigned',
    escalationLevel: 3,
    appointmentStatus: 'Missed',
    communicationStatus: 'Escalated',
    nextAction: 'asha_outreach',
    careStatus: 'ASHA Follow-up Required',
    nextRescreenDate: null,
    timeline: [
      { stage: 'SCREENED', status: 'completed', date: '25 Aug 2026' },
      { stage: 'AI ASSESSED', status: 'completed', date: '25 Aug 2026' },
      { stage: 'REFERRED', status: 'completed', date: '1 Sept 2026' },
      { stage: 'REMINDER SENT', status: 'completed', date: '6 Sept 2026' },
      { stage: 'PATIENT RESPONSE', status: 'missed', date: null },
      { stage: 'APPOINTMENT', status: 'missed', date: '10 Sept 2026' },
      { stage: 'CARE COMPLETED', status: 'pending', date: null },
      { stage: 'RESCREEN', status: 'pending', date: null },
    ],
    ashWorker: { name: 'Sunita Devi', id: 'ASHA-042', village: 'Daulatpur', phone: '+91-98765-XXXXX' },
    oldProfile: { drGrade: 4, progression: 'Rapid Progression' },
    newProfile: null,
  },
];

export const FUNNEL_DATA = [
  { label: 'Referred', value: 100, color: '#6366f1' },
  { label: 'SMS Reached', value: 88, color: '#3b82f6' },
  { label: 'Confirmed', value: 64, color: '#f59e0b' },
  { label: 'Attended', value: 57, color: '#10b981' },
  { label: 'Care Completed', value: 51, color: '#059669' },
];

export function computeReturnProbability(patient) {
  let score = 50;
  if (patient.risk === 'VERY HIGH') score -= 15;
  else if (patient.risk === 'HIGH') score -= 8;
  if (patient.drGrade >= 3) score -= 8;
  if (patient.missedAppointments >= 3) score -= 18;
  else if (patient.missedAppointments === 2) score -= 12;
  else if (patient.missedAppointments === 1) score -= 6;
  if (patient.prevAttendance) score += 15;
  if (patient.accessDifficulty === 'Very High') score -= 14;
  else if (patient.accessDifficulty === 'High') score -= 8;
  else if (patient.accessDifficulty === 'Low') score += 10;
  if (patient.smsStatus === 'Confirmed') score += 20;
  else if (patient.smsStatus === 'No Response') score -= 10;
  return Math.max(5, Math.min(98, Math.round(score)));
}

export function getProbabilityCategory(prob) {
  if (prob >= 70) return { label: 'HIGH LIKELIHOOD', color: '#10b981', bg: '#dcfce7', textColor: '#166534' };
  if (prob >= 40) return { label: 'MODERATE', color: '#f59e0b', bg: '#fef3c7', textColor: '#92400e' };
  return { label: 'LOW', color: '#ef4444', bg: '#fee2e2', textColor: '#991b1b' };
}

export function getRiskColor(risk) {
  if (risk === 'VERY HIGH' || risk === 'CRITICAL') return '#ef4444';
  if (risk === 'HIGH') return '#f59e0b';
  if (risk === 'MODERATE') return '#3b82f6';
  return '#10b981';
}

export function getUrgencyBadge(urgency) {
  if (urgency === 'CRITICAL' || urgency === 'URGENT') return { bg: '#fee2e2', color: '#991b1b', label: urgency };
  if (urgency === 'HIGH') return { bg: '#fef3c7', color: '#92400e', label: urgency };
  return { bg: '#dbeafe', color: '#1e40af', label: 'ROUTINE' };
}
