import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Sparkles, ArrowRight } from 'lucide-react';
import { extractPdfPreview } from '../../services/api';
import { SAMPLE_RESUME_TEXT } from '../../utils/formatters';

export const Dropzone = ({
  file,
  setFile,
  resumeText,
  setResumeText,
  extractedInfo,
  setExtractedInfo,
  isExtracting,
  setIsExtracting,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [mode, setMode] = useState('pdf'); // 'pdf' or 'text'
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileProcess = async (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF document (.pdf)');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB');
      return;
    }

    setError(null);
    setFile(selectedFile);
    setIsExtracting(true);

    try {
      const data = await extractPdfPreview(selectedFile);
      setExtractedInfo(data);
    } catch (err) {
      console.error('PDF extraction failed:', err);
      setError('Could not extract text from this PDF. It may be scanned or image-based.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSampleResume = () => {
    setMode('text');
    setFile(null);
    setExtractedInfo(null);
    setResumeText(SAMPLE_RESUME_TEXT);
  };

  const handleClear = () => {
    setFile(null);
    setResumeText('');
    setExtractedInfo(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <span>1. Upload Resume</span>
          <span className="text-xs font-normal text-slate-400">(PDF or Pasted Text)</span>
        </label>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSampleResume}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Sample Resume
          </button>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setMode('pdf')}
              className={`px-2.5 py-1 rounded-md transition-colors ${mode === 'pdf' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              PDF File
            </button>
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`px-2.5 py-1 rounded-md transition-colors ${mode === 'text' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Paste Text
            </button>
          </div>
        </div>
      </div>

      {mode === 'pdf' ? (
        <div>
          {!file ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileProcess(e.target.files?.[0])}
              />

              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>

              <h4 className="text-sm font-semibold text-slate-200 text-center mb-1">
                Drop your PDF resume here or <span className="text-indigo-400 hover:underline">browse</span>
              </h4>
              <p className="text-xs text-slate-400 text-center max-w-xs">
                Supports single and two-column standard PDF formats up to 10MB
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 relative">
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <h5 className="text-sm font-medium text-slate-200 truncate">{file.name}</h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB
                    {extractedInfo && (
                      <span className="ml-2 font-medium text-emerald-400">
                        • {extractedInfo.page_count} {extractedInfo.page_count === 1 ? 'page' : 'pages'} • {extractedInfo.word_count} words parsed
                      </span>
                    )}
                  </p>

                  {isExtracting && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-indigo-400">
                      <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      Parsing PDF text with PyMuPDF...
                    </div>
                  )}

                  {extractedInfo && (
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-mono line-clamp-2">
                      "{extractedInfo.text_preview}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your raw resume text here (Summary, Work Experience, Skills, Education)..."
            rows={7}
            className="w-full rounded-2xl bg-slate-900/80 border border-slate-800 p-4 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
          />
          {resumeText && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              title="Clear text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1 px-1">
            <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
            <span>Min 50 characters required</span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
