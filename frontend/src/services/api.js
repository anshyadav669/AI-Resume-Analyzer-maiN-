import axios from 'axios';

// Create Axios client with base URL pointing to FastAPI
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/v1`,
  timeout: 50000, // 50 seconds timeout
  headers: {
    Accept: 'application/json',
  },
});

// Interceptor for error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let customMessage = 'An unexpected server error occurred.';

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      customMessage = 'Request timed out. The server is taking longer than usual to analyze. Please retry.';
    } else if (error.response) {
      const data = error.response.data;
      if (data?.message) {
        customMessage = data.message;
      } else if (data?.detail) {
        customMessage = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      } else {
        customMessage = `Server error (${error.response.status}): ${error.response.statusText}`;
      }
    } else if (error.request) {
      customMessage = 'Cannot connect to backend server. Ensure FastAPI is running on http://127.0.0.1:8000.';
    }

    const enhancedError = new Error(customMessage);
    enhancedError.originalError = error;
    enhancedError.status = error.response?.status;
    enhancedError.errorCode = error.response?.data?.error_code;
    return Promise.reject(enhancedError);
  }
);

export const checkHealth = async () => {
  try {
    const res = await api.get('/health');
    return res.data;
  } catch (err) {
    console.warn('Backend health check warning:', err.message);
    return { status: 'offline', mode: 'offline' };
  }
};

export const extractPdfPreview = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/extract-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const analyzeResume = async ({
  file,
  resumeText,
  jobDescription,
  targetRole,
  customGeminiKey,
}) => {
  const formData = new FormData();
  if (file) {
    formData.append('resume_file', file);
  }
  if (resumeText) {
    formData.append('resume_text', resumeText);
  }
  formData.append('job_description', jobDescription);
  if (targetRole) {
    formData.append('target_role', targetRole);
  }
  if (customGeminiKey) {
    formData.append('custom_gemini_key', customGeminiKey);
  }

  const res = await api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const scoreResumeOnly = async ({ file, resumeText, jobDescription }) => {
  const formData = new FormData();
  if (file) {
    formData.append('resume_file', file);
  }
  if (resumeText) {
    formData.append('resume_text', resumeText);
  }
  formData.append('job_description', jobDescription);

  const res = await api.post('/score', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const optimizeBulletPoint = async ({ bullet, jobContext, targetRole }) => {
  const res = await api.post('/optimize-bullet', {
    bullet,
    job_context: jobContext || '',
    target_role: targetRole || '',
  });
  return res.data;
};

export default api;
