Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting TalentPulse HR Analytics & Prediction System" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "`n[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000"

Write-Host "[2/2] Starting Next.js Frontend on http://localhost:3000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`nServices started!" -ForegroundColor Yellow
Write-Host "  • Frontend Dashboard: http://localhost:3000" -ForegroundColor White
Write-Host "  • Backend API Docs:   http://127.0.0.1:8000/docs`n" -ForegroundColor White
