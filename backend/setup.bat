@echo off
REM Suraksha Backend Setup Script for Windows
REM This script sets up the development environment for the Suraksha backend

echo 🚀 Setting up Suraksha Backend...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Display Python version
for /f "tokens=2" %%i in ('python --version') do echo 🐍 Python version: %%i

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
) else (
    echo ✅ Virtual environment already exists
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate

REM Upgrade pip
echo ⬆️ Upgrading pip...
python -m pip install --upgrade pip

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Check if .env file exists
if not exist ".env" (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ℹ️ Please edit .env file with your configuration
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Backend setup completed!
echo.
echo Next steps:
echo 1. Edit .env file with your database and API keys
echo 2. Start PostgreSQL and Redis servers
echo 3. Run database migrations: alembic upgrade head
echo 4. Start the development server: uvicorn app.main:app --reload
echo.
echo 🔗 Access points:
echo • API Documentation: http://localhost:8000/docs
echo • Health Check: http://localhost:8000/health
echo.

pause