@echo off
echo Starting Suraksha Backend Server...

cd /d "C:\Users\Sania Rajput\OneDrive\Desktop\suraksha\suraksha\backend"
echo Current directory: %CD%

echo Checking if app directory exists...
if exist "app" (
    echo ✅ App directory found
) else (
    echo ❌ App directory not found
    pause
    exit /b 1
)

echo Starting FastAPI server...
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause