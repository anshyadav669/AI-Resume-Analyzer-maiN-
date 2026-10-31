# PowerShell Start Script for AI Resume Analyzer
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting AI Resume Analyzer & ATS Score Checker..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`nBackend API: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Swagger Docs: http://127.0.0.1:8000/docs" -ForegroundColor Green
Write-Host "Frontend App: http://localhost:5173`n" -ForegroundColor Green
