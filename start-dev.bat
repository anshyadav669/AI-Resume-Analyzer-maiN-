@echo off
echo ========================================================
echo Starting AI Resume Analyzer & ATS Score Checker...
echo ========================================================
echo.

:: Start FastAPI Backend
start "Resume ATS Backend (FastAPI)" cmd /k "cd backend && venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

:: Start Vite Frontend
start "Resume ATS Frontend (React+Vite)" cmd /k "cd frontend && npm run dev"

echo Backend running on http://127.0.0.1:8000 (Docs: http://127.0.0.1:8000/docs)
echo Frontend running on http://localhost:5173
echo.
echo Press any key to exit this launcher window...
pause >nul
