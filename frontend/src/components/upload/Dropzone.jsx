import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
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
        <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>1. Upload Resume</span>
          <span className="text-xs font-normal text-slate-500">(PDF or Pasted Text)</span>
        </label>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSampleResume}
            className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Load Sample Resume
          </button>
          <div className="h-3 w-px bg-slate-200" />
          <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setMode('pdf')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${mode === 'pdf' ? 'bg-white text-blue-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
            >
              PDF File
            </button>
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`px-2.5 py-1 rounded-md transition-colors font-medium ${mode === 'text' ? 'bg-white text-blue-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
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
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-blue-600 bg-blue-50/50'
                  : 'border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileProcess(e.target.files?.[0])}
              />

              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>

              <h4 className="text-sm font-bold text-slate-900 text-center mb-1">
                Drop your PDF resume here or <span className="text-blue-600 hover:underline">browse files</span>
              </h4>
              <p className="text-xs text-slate-500 text-center max-w-xs">
                Supports single and two-column standard PDF resumes up to 10MB
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-4 relative">
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-bold text-slate-900 truncate">{file.name}</h5>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Ready to check
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {(file.size / 1024).toFixed(1)} KB
                    {extractedInfo && (
                      <span className="ml-2 font-medium text-slate-700">
                        • {extractedInfo.page_count} {extractedInfo.page_count === 1 ? 'page' : 'pages'} • {extractedInfo.word_count} words extracted
                      </span>
                    )}
                  </p>

                  {isExtracting && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                      <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      Parsing PDF text with PyMuPDF layout engine...
                    </div>
                  )}

                  {extractedInfo && (
                    <div className="mt-2 p-2 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600 line-clamp-2">
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
            placeholder="Paste your raw resume text here (Professional Summary, Work Experience, Technical Skills, Education)..."
            rows={7}
            className="w-full rounded-2xl bg-white border border-slate-300 p-4 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
          />
          {resumeText && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Clear text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1 px-1">
            <span>{resumeText.split(/\s+/).filter(Boolean).length} words</span>
            <span>Minimum 50 characters required</span>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
