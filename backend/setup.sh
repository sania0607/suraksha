#!/bin/bash

# Suraksha Backend Setup Script
# This script sets up the development environment for the Suraksha backend

echo "🚀 Setting up Suraksha Backend..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo -e "${RED}❌ Python is not installed. Please install Python 3.8+ first.${NC}"
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
echo -e "${BLUE}🐍 Python version: $PYTHON_VERSION${NC}"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Creating virtual environment...${NC}"
    python -m venv venv
else
    echo -e "${GREEN}✅ Virtual environment already exists${NC}"
fi

# Activate virtual environment
echo -e "${YELLOW}🔧 Activating virtual environment...${NC}"
source venv/bin/activate

# Upgrade pip
echo -e "${YELLOW}⬆️ Upgrading pip...${NC}"
pip install --upgrade pip

# Install dependencies
echo -e "${YELLOW}📥 Installing dependencies...${NC}"
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${BLUE}ℹ️ Please edit .env file with your configuration${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Check if PostgreSQL is running (optional check)
if command -v pg_isready &> /dev/null; then
    if pg_isready -q; then
        echo -e "${GREEN}✅ PostgreSQL is running${NC}"
    else
        echo -e "${YELLOW}⚠️ PostgreSQL is not running. Please start PostgreSQL server.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ PostgreSQL client tools not found. Please install PostgreSQL.${NC}"
fi

# Check if Redis is running (optional check)
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo -e "${GREEN}✅ Redis is running${NC}"
    else
        echo -e "${YELLOW}⚠️ Redis is not running. Please start Redis server.${NC}"
    fi
else
    echo -e "${YELLOW}⚠️ Redis client tools not found. Please install Redis.${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Backend setup completed!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Edit .env file with your database and API keys"
echo -e "2. Start PostgreSQL and Redis servers"
echo -e "3. Run database migrations: ${YELLOW}alembic upgrade head${NC}"
echo -e "4. Start the development server: ${YELLOW}uvicorn app.main:app --reload${NC}"
echo ""
echo -e "${BLUE}🔗 Access points:${NC}"
echo -e "• API Documentation: ${BLUE}http://localhost:8000/docs${NC}"
echo -e "• Health Check: ${BLUE}http://localhost:8000/health${NC}"
echo ""