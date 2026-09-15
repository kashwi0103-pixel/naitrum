import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Card from '../components/shared/Card';
import Badge from '../components/shared/Badge';
import Button from '../components/shared/Button';
import { ChevronRight, CheckCircle2, AlertCircle, Upload, Loader, XCircle, Eye, Mic, ShieldCheck, ShieldAlert, ShieldX, Stethoscope, FileText, Volume2, Square } from 'lucide-react';
import './PatientScreening.css';

const TTS_MESSAGES = {
  'en-IN': {
    0: 'Your screening shows no signs of diabetic retinopathy. Your eyes look healthy. Continue your regular annual checkups.',
    1: 'Your screening shows very mild changes. There is no need to worry right now, but please maintain your blood sugar levels and return for a checkup next year.',
    2: 'Your screening shows moderate changes. You should see an eye specialist within the next few weeks for a detailed checkup.',
    3: 'Your screening shows severe changes. Please consult an eye specialist urgently to prevent further damage.',
    4: 'Your screening shows advanced disease. You need an emergency referral to an eye specialist immediately for treatment.',
  },
  'hi-IN': {
    0: 'आपकी जांच में डायबिटिक रेटिनोपैथी का कोई लक्षण नहीं मिला है। आपकी आंखें स्वस्थ हैं। कृपया अपनी नियमित जांच कराते रहें।',
    1: 'आपकी जांच में बहुत हल्के बदलाव दिख रहे हैं। घबराने की बात नहीं है, बस अपना ब्लड शुगर कंट्रोल में रखें।',
    2: 'आपकी जांच में मध्यम बदलाव दिख रहे हैं। आपको अगले कुछ हफ्तों के अंदर आंखों के डॉक्टर से जांच करानी चाहिए।',
    3: 'आपकी जांच में गंभीर बदलाव दिख रहे हैं। कृपया तुरंत आंखों के डॉक्टर से मिलें।',
    4: 'आपकी जांच में बीमारी काफी बढ़ चुकी है। इलाज के लिए आपको तुरंत विशेषज्ञ को दिखाना जरूरी है।',
  },
  'bn-IN': {
    0: 'আপনার স্ক্রীনিংয়ে ডায়াবেটিক রেটিনোপ্যাথির কোনো লক্ষণ পাওয়া যায়নি। আপনার চোখ সুস্থ আছে।',
    1: 'আপনার স্ক্রীনিংয়ে খুব সামান্য পরিবর্তন দেখা যাচ্ছে। আপনার রক্তে শর্করার মাত্রা নিয়ন্ত্রণে রাখুন।',
    2: 'আপনার স্ক্রীনিংয়ে মাঝারি পরিবর্তন দেখা যাচ্ছে। আপনার চোখের ডাক্তারের সাথে পরামর্শ করা উচিত।',
    3: 'আপনার স্ক্রীনিংয়ে গুরুতর পরিবর্তন দেখা যাচ্ছে। অনুগ্রহ করে অবিলম্বে একজন চোখের ডাক্তারের সাথে পরামর্শ করুন।',
    4: 'আপনার স্ক্রীনিংয়ে উন্নত রোগ দেখা যাচ্ছে। জরুরি চিকিৎসার জন্য অবিলম্বে একজন চোখের ডাক্তারের কাছে যান।',
  },
  'mr-IN': {
    0: 'तुमच्या तपासणीत डायबेटिक रेटिनोपॅथीची कोणतीही चिन्हे आढळलेली नाहीत. तुमचे डोळे निरोगी आहेत.',
    1: 'तुमच्या तपासणीत अतिशय सौम्य बदल दिसून येत आहेत. कृपया तुमची रक्तातील साखर नियंत्रणात ठेवा.',
    2: 'तुमच्या तपासणीत मध्यम बदल दिसून येत आहेत. तुम्ही पुढील काही आठवड्यांत नेत्ररोग तज्ज्ञांचा सल्ला घ्यावा.',
    3: 'तुमच्या तपासणीत गंभीर बदल दिसून येत आहेत. कृपया तातडीने नेत्ररोग तज्ज्ञांचा सल्ला घ्या.',
    4: 'तुमच्या तपासणीत प्रगत आजार दिसून येत आहे. तुम्हाला तातडीने नेत्ररोग तज्ज्ञांकडे जाण्याची गरज आहे.',
  },
  'ta-IN': {
    0: 'உங்கள் பரிசோதனையில் சர்க்கரை நோய் விழித்திரை பாதிப்பு இல்லை. உங்கள் கண்கள் ஆரோக்கியமாக உள்ளன.',
    1: 'உங்கள் பரிசோதனையில் மிகச் சிறிய மாற்றங்கள் உள்ளன. உங்கள் இரத்த சர்க்கரை அளவை கட்டுக்குள் வைக்கவும்.',
    2: 'உங்கள் பரிசோதனையில் மிதமான மாற்றங்கள் உள்ளன. நீங்கள் கண் மருத்துவரை அணுக வேண்டும்.',
    3: 'உங்கள் பரிசோதனையில் கடுமையான மாற்றங்கள் உள்ளன. உடனடியாக கண் மருத்துவரை அணுகவும்.',
    4: 'உங்கள் பரிசோதனையில் நோய் முற்றியுள்ளது. அவசரமாக கண் மருத்துவரை அணுக வேண்டியது அவசியம்.',
  },
  'te-IN': {
    0: 'మీ స్క్రీనింగ్లో డయాబెటిక్ రెటినోపతి లక్షణాలు లేవు. మీ కళ్ళు ఆరోగ్యంగా ఉన్నాయి.',
    1: 'మీ స్క్రీనింగ్లో స్వల్ప మార్పులు ఉన్నాయి. మీ రక్తంలో చక్కెర స్థాయిని నియంత్రణలో ఉంచుకోండి.',
    2: 'మీ స్క్రీనింగ్లో మితమైన మార్పులు ఉన్నాయి. మీరు కంటి వైద్యుడిని సంప్రదించాలి.',
    3: 'మీ స్క్రీనింగ్లో తీవ్రమైన మార్పులు ఉన్నాయి. దయచేసి వెంటనే కంటి వైద్యుడిని సంప్రదించండి.',
    4: 'మీ స్క్రీనింగ్లో వ్యాధి ముదిరింది. అత్యవసర చికిత్స కోసం వెంటనే కంటి వైద్యుడిని సంప్రదించాలి.',
  },
  'gu-IN': {
    0: 'તમારી તપાસમાં ડાયાબિટીક રેટિનોપેથીના કોઈ સંકેતો મળ્યા નથી. તમારી આંખો સ્વસ્થ છે.',
    1: 'તમારી તપાસમાં ખૂબ જ હળવા ફેરફારો જોવા મળ્યા છે. કૃપા કરીને તમારું બ્લડ સુગર નિયંત્રણમાં રાખો.',
    2: 'તમારી તપાસમાં મધ્યમ ફેરફારો જોવા મળ્યા છે. તમારે આંખના ડૉક્ટરની સલાહ લેવી જોઈએ.',
    3: 'તમારી તપાસમાં ગંભીર ફેરફારો જોવા મળ્યા છે. કૃપા કરીને તાત્કાલિક આંખના ડૉક્ટરની સલાહ લો.',
    4: 'તમારી તપાસમાં અદ્યતન રોગ જોવા મળ્યો છે. તમારે તાત્કાલિક આંખના ડૉક્ટર પાસે જવાની જરૂર છે.',
  }
};

const LANGUAGES = [
  { code: 'hi-IN', name: 'हिंदी (Hindi)' },
  { code: 'en-IN', name: 'English' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)' },
  { code: 'mr-IN', name: 'मराठी (Marathi)' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
  { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)' },
];
import './PatientScreening.css';

const PatientScreening = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [quality, setQuality] = useState(null); // { score, label, status }
  const fileInputRef = useRef(null);

  const [commLang, setCommLang] = useState('hi-IN');
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    if (!result) return;
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    
    window.speechSynthesis.cancel(); // clear previous
    const text = TTS_MESSAGES[commLang][result.dr_level] || TTS_MESSAGES['hi-IN'][result.dr_level];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = commLang;
    utterance.rate = 0.85; // Slightly slower for better comprehension
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const steps = [
    'Patient', 'Image', 'Quality', 'Analysis', 'Result', 'History', 'Risk', 'Communicate'
  ];


  // ── Quality Assessment (pixel-dimension based) ────────────────────
  const assessQualityFromDimensions = (width, height) => {
    const minDim = Math.min(width, height);
    if (minDim >= 400) {
      return { score: 94, label: 'Good', status: 'pass', message: 'Image quality is excellent. Ready for AI analysis.' };
    }
    if (minDim >= 250) {
      return { score: 71, label: 'Acceptable', status: 'borderline', message: 'Image quality is acceptable. Proceeding with analysis.' };
    }
    if (minDim >= 150) {
      return { score: 42, label: 'Borderline', status: 'borderline', message: 'Image quality is borderline. Analysis may have reduced accuracy.' };
    }
    return { score: 15, label: 'Ungradable', status: 'ungradable', message: 'Image resolution too low. Please recapture with the fundus camera.' };
  };

  const loadAndAssessFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(null);
      setQuality({ score: 0, label: 'Ungradable', status: 'ungradable', message: 'File is not a valid image format.' });
      setResult(null); setError(null);
      setActiveStep(2);
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const q = assessQualityFromDimensions(img.naturalWidth, img.naturalHeight);
      setSelectedFile(file);
      setPreviewUrl(url);
      setQuality(q);
      setResult(null);
      setError(null);
      setActiveStep(2);
    };
    img.onerror = () => {
      setSelectedFile(file);
      setPreviewUrl(url);
      setQuality({ score: 30, label: 'Borderline', status: 'borderline', message: 'Could not read image dimensions — proceeding with caution.' });
      setResult(null); setError(null);
      setActiveStep(2);
    };
    img.src = url;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) loadAndAssessFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) loadAndAssessFile(file);
  };


  const handleDragOver = (e) => e.preventDefault();

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setActiveStep(3);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Call the unified SIH orchestrator endpoint
      const response = await fetch('http://127.0.0.1:8000/api/screen', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const drData = await response.json();

      const finalResult = {
        ...drData,
        quality,
      };

      setResult(finalResult);

      // Save to sessionStorage for Doctor Review / Final Report pages
      sessionStorage.setItem('dr_result', JSON.stringify(finalResult));
      sessionStorage.setItem('dr_preview_url', previewUrl);

      setActiveStep(4);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setActiveStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
    setQuality(null);
    setActiveStep(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Confidence Routing ───────────────────────────────────────────
  const getConfidenceRouting = (result) => {
    const conf = result.confidence * 100;
    if (quality?.status === 'ungradable') {
      return { tier: 'ungradable', label: 'Image Ungradable', color: 'critical', icon: ShieldX };
    }
    if (conf >= 85) {
      return { tier: 'confident', label: 'High Confidence — Auto Complete', color: 'pass', icon: ShieldCheck };
    }
    if (conf >= 60) {
      return { tier: 'uncertain', label: 'Uncertain — Doctor Review Recommended', color: 'borderline', icon: ShieldAlert };
    }
    return { tier: 'ungradable', label: 'Low Confidence — Recapture Suggested', color: 'critical', icon: ShieldX };
  };

  const getDrLevelStatus = (level) => {
    if (level >= 3) return 'critical';
    if (level === 2) return 'fail';
    if (level === 1) return 'borderline';
    return 'pass';
  };

  const getPatientFriendlyText = (level) => {
    if (level === 0) return 'Your screening looks healthy. No signs of diabetic retinopathy were found.';
    if (level === 1) return 'Your screening shows very mild changes. We recommend regular follow-up screenings.';
    if (level === 2) return 'Your screening shows changes that should be checked by an eye specialist.';
    if (level === 3) return 'Your screening shows significant changes. Please see an eye specialist soon.';
    return 'Your screening shows advanced changes that need urgent specialist attention.';
  };

  const routing = result ? getConfidenceRouting(result) : null;

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content screening-layout">

        {/* Progressive Workflow Header */}
        <header className="workflow-header fade-in">
          <div className="workflow-steps">
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className={`workflow-step ${idx === activeStep ? 'active' : idx < activeStep ? 'completed' : ''}`}>
                  <div className="step-indicator">
                    {idx < activeStep ? <CheckCircle2 size={16} /> : idx + 1}
                  </div>
                  <span className="step-label">{step}</span>
                </div>
                {idx < steps.length - 1 && <div className={`step-connector ${idx < activeStep ? 'completed' : ''}`}></div>}
              </React.Fragment>
            ))}
          </div>
        </header>

        <div className="screening-grid fade-in" style={{ animationDelay: '0.1s' }}>

          {/* Left Column: Image Upload & Preview */}
          <div className="evidence-column">
            <Card className="image-card" padding="none">

              {!previewUrl ? (
                <div
                  className="upload-zone"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" hidden />
                  <div className="upload-icon-wrapper">
                    <Upload size={48} />
                  </div>
                  <h3>Upload Retinal Image</h3>
                  <p>Drag &amp; drop a fundus photograph here, or click to browse</p>
                  <span className="upload-hint">Supports JPG, PNG • Max 10MB</span>
                </div>
              ) : (
                <>
                  <div className="image-tabs">
                    <button className="tab active">Uploaded Image</button>
                    {result && <button className="tab text-digital">AI Result</button>}
                  </div>
                  <div className="retinal-image-container">
                    <img src={previewUrl} alt="Retinal scan" className="uploaded-retinal-image" />
                    {isLoading && (
                      <div className="scan-overlay">
                        <div className="scan-line"></div>
                      </div>
                    )}
                    {/* Vessel overlay */}
                    {result?.vessel_mask_base64 && (
                      <img
                        src={`data:image/png;base64,${result.vessel_mask_base64}`}
                        alt="Vessel mask overlay"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 8 }}
                      />
                    )}
                  </div>

                  {/* Quality Bar */}
                  {quality && (
                    <div className={`image-quality-bar quality-${quality.status}`}>
                      <span className="quality-label">
                        Quality: <strong>{quality.label}</strong>
                        <span className="quality-score"> — {quality.score}%</span>
                      </span>
                      <div className="quality-metrics">
                        <div className="quality-bar-track">
                          <div
                            className={`quality-bar-fill quality-fill-${quality.status}`}
                            style={{ width: `${quality.score}%` }}
                          />
                        </div>
                        <button className="reset-link" onClick={handleReset}>Change image</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          </div>

          {/* Right Column: Actions & Results */}
          <div className="result-column">

            {/* Quality Gate Card — show after image selected, before analysis */}
            {selectedFile && !result && !isLoading && quality && (
              <Card className={`quality-gate-card fade-in quality-gate-${quality.status}`}>
                <div className="quality-gate-header">
                  {quality.status === 'pass' && <ShieldCheck size={28} className="text-pass" />}
                  {quality.status === 'borderline' && <ShieldAlert size={28} className="text-borderline" />}
                  {quality.status === 'ungradable' && <ShieldX size={28} className="text-critical" />}
                  <div>
                    <h3>Image Quality Assessment</h3>
                    <p>{quality.message}</p>
                  </div>
                </div>

                {quality.status !== 'ungradable' ? (
                  <Button variant="primary" size="lg" className="w-full" onClick={handleAnalyze}>
                    <Eye size={20} />
                    {quality.status === 'borderline' ? 'Proceed with Analysis (Borderline)' : 'Analyze with AI'}
                  </Button>
                ) : (
                  <Button variant="secondary" size="lg" className="w-full" onClick={handleReset}>
                    Recapture Image
                  </Button>
                )}
              </Card>
            )}

            {/* Loading State */}
            {isLoading && (
              <Card className="loading-card fade-in">
                <div className="loading-content">
                  <div className="loading-spinner">
                    <Loader size={40} className="spin" />
                  </div>
                  <h3>Analyzing image...</h3>
                  <p className="loading-hint">Running vessel segmentation + DR classification in parallel...</p>
                  <div className="loading-steps">
                    <span className="lstep done">✓ Image quality assessed</span>
                    <span className="lstep done">✓ Image received by server</span>
                    <span className="lstep active">⋯ Running AI models</span>
                    <span className="lstep">○ Generating result</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Error State */}
            {error && (
              <Card className="error-card fade-in">
                <div className="error-content">
                  <XCircle size={32} className="text-critical" />
                  <h3>Analysis Failed</h3>
                  <p>{error}</p>
                  <Button variant="primary" size="md" onClick={handleAnalyze}>Retry Analysis</Button>
                </div>
              </Card>
            )}

            {/* Result Card */}
            {result && (
              <>
                {/* Confidence Routing Banner */}
                {routing && (
                  <Card className={`confidence-routing-card fade-in routing-${routing.tier}`}>
                    <div className="routing-content">
                      <routing.icon size={24} />
                      <div>
                        <strong>{routing.label}</strong>
                        {routing.tier === 'uncertain' && (
                          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
                            Confidence {(result.confidence * 100).toFixed(1)}% — below the 85% auto-completion threshold.
                          </p>
                        )}
                        {routing.tier === 'ungradable' && (
                          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
                            Please retake the fundus image and re-run the analysis.
                          </p>
                        )}
                      </div>
                    </div>
                    {routing.tier === 'uncertain' && (
                      <Button variant="primary" size="md" onClick={() => navigate('/report')}>
                        <FileText size={18} /> View Final Report
                      </Button>
                    )}
                    {routing.tier === 'ungradable' && (
                      <Button variant="secondary" size="md" onClick={handleReset}>
                        Recapture Image
                      </Button>
                    )}
                  </Card>
                )}

                <Card className="result-card fade-in">
                  <div className="result-header">
                    <Badge status="digital" className="ai-badge">AI Analysis Complete</Badge>
                    <span className="confidence">Confidence {(result.confidence * 100).toFixed(1)}%</span>
                  </div>

                  <h2 className={`diagnosis-title text-${getDrLevelStatus(result.dr_level)}`}>
                    DR LEVEL {result.dr_level}
                  </h2>

                  <div className="result-label-row">
                    <span className="result-label">{result.label}</span>
                  </div>

                  <div className="referable-status">
                    <span className={`referable-badge ${result.referable ? 'yes' : 'no'}`}>
                      {result.referable ? '⚠ Referable — Specialist Review Needed' : '✓ Non-Referable'}
                    </span>
                  </div>

                  <p className="patient-friendly-text">{getPatientFriendlyText(result.dr_level)}</p>

                  <div className="result-details">
                    <h4>Full AI Response:</h4>
                    <div className="json-display">
                      {[
                        ['DR Level', result.dr_level],
                        ['Label', result.label],
                        ['Referable', result.referable ? 'Yes' : 'No'],
                        ['Confidence', `${(result.confidence * 100).toFixed(1)}%`],
                        ['Image Quality', quality?.label || '—'],
                      ].map(([k, v]) => (
                        <div className="json-row" key={k}>
                          <span className="json-key">{k}</span>
                          <span className="json-value">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.gradcam_image_base64 && (
                    <div className="explainability-section" style={{ marginTop: 24 }}>
                      <h4>AI Focus Area (Grad-CAM)</h4>
                      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 8 }}>
                        Highlighted regions show where the AI focused to make its prediction.
                      </p>
                      <div style={{ position: 'relative', width: '100%' }}>
                        <img src={previewUrl} alt="Original fundus" style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd', display: 'block' }} />
                        <img
                          src={`data:image/png;base64,${result.gradcam_image_base64}`}
                          alt="Grad-CAM heatmap"
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 8, mixBlendMode: 'multiply' }}
                        />
                      </div>
                    </div>
                  )}

                  {result.lesion_mask_base64 && (
                    <div className="explainability-section" style={{ marginTop: 20 }}>
                      <h4>Detected Lesions</h4>
                      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 8 }}>
                        Highlighted areas indicate possible microaneurysms, haemorrhages, or exudates.
                      </p>
                      <div style={{ position: 'relative', width: '100%' }}>
                        <img src={previewUrl} alt="Original fundus" style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd', display: 'block' }} />
                        <img
                          src={`data:image/png;base64,${result.lesion_mask_base64}`}
                          alt="Lesion segmentation mask"
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 8 }}
                        />
                      </div>
                    </div>
                  )}

                  {result.vessel_mask_base64 && (
                    <div className="explainability-section" style={{ marginTop: 20 }}>
                      <h4>Blood Vessel Segmentation (UNet)</h4>
                      <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: 8 }}>
                        Green highlights show predicted retinal vascular structure.
                      </p>
                      <div style={{ position: 'relative', width: '100%' }}>
                        <img src={previewUrl} alt="Original fundus" style={{ width: '100%', borderRadius: 8, border: '1px solid #ddd', display: 'block' }} />
                        <img
                          src={`data:image/png;base64,${result.vessel_mask_base64}`}
                          alt="Vessel mask overlay"
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 8 }}
                        />
                      </div>
                    </div>
                  )}
                </Card>

                {/* Action Buttons */}
                <Card className="action-card fade-in" style={{ animationDelay: '0.15s' }}>
                  <h3 className="card-title">Next Steps</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/report')}>
                      <FileText size={18} /> View Final Report
                    </Button>
                  </div>
                </Card>

                <Card className="action-card highlight-card fade-in" style={{ animationDelay: '0.2s' }}>
                  <h3 className="card-title">Patient Communication</h3>
                  <div className="voice-flow">
                    <div className="flow-step">1. Simplified Explanation</div>
                    <div className="flow-step">
                      2. Language: 
                      <select 
                        value={commLang} 
                        onChange={(e) => {
                          setCommLang(e.target.value);
                          if (isPlaying) {
                            window.speechSynthesis.cancel();
                            setIsPlaying(false);
                          }
                        }}
                        style={{ marginLeft: 8, padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', fontSize: '0.9rem', outline: 'none' }}
                      >
                        {LANGUAGES.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '16px', fontSize: '0.95rem', color: '#334155', borderLeft: '4px solid #3b82f6' }}>
                      "{TTS_MESSAGES[commLang]?.[result.dr_level] || TTS_MESSAGES['hi-IN']?.[result.dr_level]}"
                    </div>
                    <Button variant="primary" size="lg" className="w-full explain-btn" onClick={handlePlayAudio}>
                      {isPlaying ? <Square size={20} /> : <Volume2 size={20} />}
                      {isPlaying ? 'Stop Explanation' : 'Explain to Patient'}
                    </Button>
                  </div>
                </Card>
              </>
            )}

            {/* Empty state */}
            {!selectedFile && (
              <Card className="empty-state-card fade-in">
                <div className="empty-state-content">
                  <Upload size={40} className="text-secondary" />
                  <h3>No Image Selected</h3>
                  <p>Upload a retinal fundus photograph to begin AI-powered diabetic retinopathy screening.</p>
                </div>
              </Card>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientScreening;
