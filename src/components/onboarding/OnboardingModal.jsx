import { useState, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import client from '../../api/client';
import toast from 'react-hot-toast';

const DESIRED_POSITIONS = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Data Analyst',
  'Machine Learning Engineer',
  'Product Manager',
  'UX Designer',
  'DevOps Engineer',
  'Cloud Architect',
  'Cybersecurity Analyst',
  'Custom...',
];

const PROCESSING_STEPS = [
  { label: 'Uploading resume to secure storage...', duration: 2000 },
  { label: 'Extracting text and structure...', duration: 3000 },
  { label: 'Generating vector embeddings...', duration: 4000 },
  { label: 'Running AI resume analysis...', duration: 5000 },
  { label: 'Analyzing skill gaps for your target role...', duration: 5000 },
  { label: 'Building your career profile...', duration: 4000 },
  { label: 'Finalizing insights...', duration: 3000 },
];

export default function OnboardingModal({ onComplete }) {
  const { markResumeUploaded } = useAuth();
  const [step, setStep] = useState(1);
  const [position, setPosition] = useState('');
  const [customPosition, setCustomPosition] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef(null);

  const selectedPosition = position === 'Custom...' ? customPosition : position;

  // Drag and drop handlers
  const handleDragEnter = (e) => { e.preventDefault(); setDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setDragActive(false); };
  const handleDragOver = (e) => { e.preventDefault(); };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      toast.error('Please upload a PDF file only');
    }
  };
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected?.type === 'application/pdf') {
      setFile(selected);
    } else {
      toast.error('Please upload a PDF file only');
    }
  };

  // Simulate processing steps animation
  const runProcessingAnimation = useCallback(() => {
    let currentStep = 0;
    let totalDuration = PROCESSING_STEPS.reduce((sum, s) => sum + s.duration, 0);
    let elapsed = 0;

    const advance = () => {
      if (currentStep >= PROCESSING_STEPS.length) return;
      elapsed += PROCESSING_STEPS[currentStep].duration;
      setProcessingStep(currentStep);
      setProcessingProgress(Math.round((elapsed / totalDuration) * 100));
      currentStep++;
      if (currentStep < PROCESSING_STEPS.length) {
        setTimeout(advance, PROCESSING_STEPS[currentStep - 1].duration);
      }
    };

    advance();
  }, []);

  const handleUpload = async () => {
    if (!file || !selectedPosition.trim()) return;

    setUploading(true);
    setStep(3); // Move to processing step
    runProcessingAnimation();

    const formData = new FormData();
    formData.append('Desired_Position', selectedPosition.trim());
    formData.append('resume', file);

    try {
      const uploadPromise = client.post('/api/upload_resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 300000, // 5 minute timeout for heavy AI processing
      });

      const minAnimationPromise = new Promise((resolve) => setTimeout(resolve, 26000)); // Let the 26s animation finish

      await Promise.all([uploadPromise, minAnimationPromise]);

      markResumeUploaded();
      setUploading(false);
      setStep(4); // Success step

      setTimeout(() => {
        onComplete?.();
        toast.success('Resume uploaded! Your profile is being built.', {
          duration: 5000,
          className: 'toast-success',
        });
      }, 1500);

    } catch (err) {
      setUploading(false);
      setStep(2);
      const msg = err?.response?.data?.detail || 'Upload failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(12px)' }}
    >
      <div className="w-full max-w-lg bg-bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden animate-in">

        {/* Header */}
        {step <= 2 && (
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
                Step {step} of 2 — Getting Started
              </span>
              <div className="flex gap-1.5">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      s <= step ? 'w-8 bg-primary' : 'w-4 bg-bg-surface-3'
                    }`}
                  />
                ))}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-text-primary">
              {step === 1 ? "What's your target role?" : "Upload your resume"}
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              {step === 1
                ? 'Tell us where you want to go. We\'ll tailor everything to your goal.'
                : 'Upload your PDF resume and let our AI analyze your profile.'}
            </p>
          </div>
        )}

        <div className="p-6">
          {/* ——— STEP 1: Target Role ——— */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {DESIRED_POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosition(pos)}
                    className={`
                      px-4 py-3 rounded-xl text-sm font-medium text-left transition-all
                      ${position === pos
                        ? 'bg-primary/15 border border-primary/40 text-primary'
                        : 'bg-bg-surface-2 border border-border text-text-secondary hover:text-text-primary hover:border-border-light'
                      }
                    `}
                  >
                    {pos}
                  </button>
                ))}
              </div>

              {position === 'Custom...' && (
                <input
                  type="text"
                  placeholder="Enter your target role..."
                  value={customPosition}
                  onChange={(e) => setCustomPosition(e.target.value)}
                  className="w-full px-4 py-3 bg-bg-surface-2 border border-border rounded-xl text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary transition-colors"
                  autoFocus
                />
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!selectedPosition.trim()}
                className="
                  w-full py-3.5 mt-2 bg-gradient-to-r from-primary to-accent
                  text-white font-semibold rounded-xl transition-all duration-200
                  disabled:opacity-40 disabled:cursor-not-allowed
                  hover:opacity-90 btn-press
                "
              >
                Continue →
              </button>
            </div>
          )}

          {/* ——— STEP 2: Resume Upload ——— */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Selected position chip */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-xl w-fit">
                <span className="text-xs text-text-muted">Target role:</span>
                <span className="text-sm font-semibold text-primary">{selectedPosition}</span>
                <button onClick={() => setStep(1)} className="text-text-muted hover:text-primary text-xs ml-1">✎</button>
              </div>

              {/* Drop zone */}
              <div
                className={`drag-zone rounded-2xl p-10 text-center cursor-pointer transition-all ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-file-input"
                />

                {file ? (
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-success/10 border border-success/30 flex items-center justify-center mx-auto mb-4 text-2xl">
                      ✅
                    </div>
                    <p className="text-success font-semibold">{file.name}</p>
                    <p className="text-text-muted text-xs mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-bg-surface-2 border border-border flex items-center justify-center mx-auto mb-4 text-2xl">
                      📎
                    </div>
                    <p className="text-text-primary font-medium mb-1">Drop your resume here</p>
                    <p className="text-text-muted text-sm">or click to browse files</p>
                    <p className="text-text-muted text-xs mt-2">PDF only • Max 10MB</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-bg-surface-2 border border-border text-text-secondary rounded-xl text-sm hover:text-text-primary hover:border-border-light transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file}
                  className="
                    flex-2 flex-grow py-3 bg-gradient-to-r from-primary to-accent
                    text-white font-semibold rounded-xl transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed
                    hover:opacity-90 btn-press
                  "
                >
                  Upload & Analyze →
                </button>
              </div>
            </div>
          )}

          {/* ——— STEP 3: Processing Animation ——— */}
          {step === 3 && (
            <div className="py-6 text-center">
              {/* Animated logo */}
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl animate-pulse-glow">
                  🤖
                </div>
                <div
                  className="absolute inset-0 rounded-2xl border-2 border-primary animate-spin"
                  style={{ animationDuration: '3s', borderTopColor: 'transparent', borderRightColor: 'transparent' }}
                />
              </div>

              <h3 className="text-2xl font-bold text-text-primary mb-2">Building Your Profile</h3>
              <p className="text-text-secondary text-sm mb-8">
                This takes about 25–30 seconds. Please don't close this window.
              </p>

              {/* Progress bar */}
              <div className="interview-progress mb-4">
                <div
                  className="interview-progress-bar transition-all duration-1000"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
              <p className="text-xs text-text-muted mb-8">{processingProgress}% complete</p>

              {/* Processing steps list */}
              <div className="space-y-3 text-left">
                {PROCESSING_STEPS.map((s, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                      i < processingStep
                        ? 'bg-success/10 border border-success/20'
                        : i === processingStep
                        ? 'bg-primary/10 border border-primary/20'
                        : 'bg-bg-surface-2 border border-border opacity-40'
                    }`}
                  >
                    <span className="text-sm flex-shrink-0">
                      {i < processingStep ? '✅' : i === processingStep ? '⏳' : '⬜'}
                    </span>
                    <span className={`text-sm ${
                      i < processingStep ? 'text-success' :
                      i === processingStep ? 'text-primary font-medium' :
                      'text-text-muted'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dots animation */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <span className="processing-dot" />
                <span className="processing-dot" />
                <span className="processing-dot" />
              </div>
            </div>
          )}

          {/* ——— STEP 4: Success ——— */}
          {step === 4 && (
            <div className="py-8 text-center">
              <div className="w-20 h-20 rounded-full bg-success/15 border-2 border-success flex items-center justify-center mx-auto mb-6 text-3xl animate-in">
                ✅
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">You're all set!</h3>
              <p className="text-text-secondary text-sm">
                Your resume has been uploaded and analyzed. Welcome to PrepMate!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
