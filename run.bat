@echo off
echo ========================================================
echo   Starting TalentPulse HR Analytics and Prediction System
echo ========================================================

cd /d "%~dp0"

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "HR Backend API" cmd /k "cd /d "%~dp0" && python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"

echo [2/2] Starting Next.js Frontend on http://localhost:3000 ...
start "HR Frontend Dashboard" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo   Both services are starting!
echo   Frontend Dashboard: http://localhost:3000
echo   Backend API Docs:   http://127.0.0.1:8000/docs
echo ========================================================
