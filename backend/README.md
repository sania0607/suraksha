# Suraksha Backend - Digital Disaster Preparedness Platform

This is the backend API for the Suraksha disaster preparedness platform built with FastAPI.

## Features

- **Authentication & Authorization** with JWT tokens
- **User Management** (Students & Administrators)
- **Disaster Module Management** with progress tracking
- **Real-time Emergency Alerts** system
- **Weather Integration** with OpenWeatherMap
- **SOS Emergency System** with notifications
- **Campus Map Management** with safety features
- **Analytics & Reporting** for administrators
- **WebSocket Support** for real-time updates

## Tech Stack

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **JWT** - Authentication tokens
- **WebSockets** - Real-time communication
- **Celery** - Background tasks
- **Alembic** - Database migrations

## Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/suraksha

# Security
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# External APIs
OPENWEATHER_API_KEY=your-openweather-key
GEMINI_API_KEY=your-gemini-key

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Redis
REDIS_URL=redis://localhost:6379
```

## API Documentation

Once running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── api/           # API endpoints
│   ├── core/          # Core configuration
│   ├── models/        # Database models
│   ├── services/      # Business logic
│   └── main.py        # FastAPI app
├── alembic/           # Database migrations
├── requirements.txt   # Dependencies
└── README.md
```