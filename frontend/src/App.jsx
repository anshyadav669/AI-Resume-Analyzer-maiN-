import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { LandingPage } from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';
import { ResultsPage } from './pages/ResultsPage';
import { AnalysisStepper } from './components/upload/AnalysisStepper';

import { analyzeResume, checkHealth } from './services/api';
import { DEFAULT_MOCK_ANALYSIS, generateMockAnalysis } from './data/mockAnalysisData';
import { SAMPLE_JOBS } from './utils/formatters';

export default function App() {
  // Page routing state: 'landing' | 'upload' | 'analyzing' | 'results'
  const [currentPage, setCurrentPage] = useState('landing');

  // Input states
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState(SAMPLE_JOBS[0].text);
  const [targetRole, setTargetRole] = useState(SAMPLE_JOBS[0].title);
  const [customGeminiKey, setCustomGeminiKey] = useState('');

  // Process & preview states
  const [extractedInfo, setExtractedInfo] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [backendHealthy, setBackendHealthy] = useState(null);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Analysis result
  const [analysisData, setAnalysisData] = useState(DEFAULT_MOCK_ANALYSIS);

  const addToast = ({ type = 'info', title, message }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 5500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check backend health on initial load
  useEffect(() => {
    checkHealth()
      .then((data) => {
        const healthy = data?.status === 'healthy';
        setBackendHealthy(healthy);
        if (healthy) {
          addToast({
            type: 'info',
            title: 'FastAPI Backend Connected',
            message: 'Connected to local FastAPI engine with PyMuPDF & Gemini ATS pipeline.',
          });
        }
      })
      .catch(() => {
        setBackendHealthy(false);
      });
  }, []);

  const handleStartScan = () => {
    setCurrentPage('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreDemo = () => {
    setAnalysisData(DEFAULT_MOCK_ANALYSIS);
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast({
      type: 'info',
      title: 'Demo Results Loaded',
      message: 'Viewing full interactive results for Staff Full-Stack Engineer target.',
    });
  };

  const handleRunAnalysis = async () => {
    if (!file && (!resumeText || resumeText.trim().length < 50)) {
      const msg = 'Please upload a PDF resume or enter at least 50 characters of resume text.';
      setError(msg);
      addToast({
        type: 'warning',
        title: 'Resume Required',
        message: msg,
      });
      return;
    }
    if (!jobDescription || jobDescription.trim().length < 20) {
      const msg = 'Please provide a target job description (at least 20 characters).';
      setError(msg);
      addToast({
        type: 'warning',
        title: 'Job Description Required',
        message: msg,
      });
      return;
    }

    setError(null);
    setIsAnalyzing(true);
    setCurrentPage('analyzing');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      // Call actual backend API
      const result = await analyzeResume({
        file,
        resumeText,
        jobDescription,
        targetRole,
        customGeminiKey,
      });

      setAnalysisData(result);
      setIsAnalyzing(false);
      setCurrentPage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      addToast({
        type: 'success',
        title: 'Audit Complete!',
        message: `Calculated ATS Score: ${result.scores?.overall_score || 0}% for ${result.candidate_name || 'Candidate'}.`,
      });
    } catch (err) {
      console.error('Analysis failed:', err);
      setIsAnalyzing(false);

      // If backend is unreachable or failed, check if we should offer smart simulation fallback
      const errorMsg = err.message || 'Failed to complete resume analysis. Please verify your file or backend.';
      setError(errorMsg);

      addToast({
        type: 'error',
        title: 'Analysis Error',
        message: errorMsg,
      });

      // Return to upload page with error alert
      setCurrentPage('upload');
    }
  };

  const handleBackToUpload = () => {
    setCurrentPage('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewAnalysis = () => {
    setFile(null);
    setResumeText('');
    setJobDescription(SAMPLE_JOBS[0].text);
    setTargetRole(SAMPLE_JOBS[0].title);
    setExtractedInfo(null);
    setError(null);
    setCurrentPage('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 selection:bg-indigo-500 selection:text-white bg-grid-pattern transition-colors duration-200">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Navbar
        currentPage={currentPage}
        backendHealthy={backendHealthy}
        onNavigate={(page) => {
          if (page === 'results' && !analysisData) {
            setAnalysisData(DEFAULT_MOCK_ANALYSIS);
          }
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {/* 1. LANDING PAGE */}
          {currentPage === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <LandingPage
                onGetStarted={handleStartScan}
                onDemoResults={handleExploreDemo}
              />
            </motion.div>
          )}

          {/* 2. UPLOAD WORKSPACE PAGE */}
          {currentPage === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <UploadPage
                file={file}
                setFile={setFile}
                resumeText={resumeText}
                setResumeText={setResumeText}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                targetRole={targetRole}
                setTargetRole={setTargetRole}
                customGeminiKey={customGeminiKey}
                setCustomGeminiKey={setCustomGeminiKey}
                extractedInfo={extractedInfo}
                setExtractedInfo={setExtractedInfo}
                isExtracting={isExtracting}
                setIsExtracting={setIsExtracting}
                onAnalyze={handleRunAnalysis}
                error={error}
                isAnalyzing={isAnalyzing}
              />
            </motion.div>
          )}

          {/* 3. ANALYZING / LOADING ANIMATION INTERSTITIAL */}
          {currentPage === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="py-16 sm:py-24"
            >
              <AnalysisStepper />
            </motion.div>
          )}

          {/* 4. RESULTS DASHBOARD PAGE */}
          {currentPage === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ResultsPage
                analysisData={analysisData}
                onBackToUpload={handleBackToUpload}
                onNewAnalysis={handleNewAnalysis}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
