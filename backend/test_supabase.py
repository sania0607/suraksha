"""
Test Supabase connection for Suraksha Backend
Run this script to verify your Supabase configuration is working
"""

import os
import asyncio
import asyncpg
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_database_connection():
    """Test PostgreSQL database connection"""
    print("🔄 Testing Supabase PostgreSQL connection...")
    
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("❌ DATABASE_URL not found in .env file")
        return False
    
    if "[YOUR-PASSWORD]" in database_url:
        print("❌ Please replace [YOUR-PASSWORD] in DATABASE_URL with your actual password")
        return False
    
    try:
        # Connect to Supabase PostgreSQL
        conn = await asyncpg.connect(database_url, server_settings={'application_name': 'suraksha_test'})
        
        # Test query
        result = await conn.fetchrow("""
            SELECT 
                version() as pg_version,
                current_database() as database,
                current_user as user,
                now() as timestamp
        """)
        
        print("✅ Successfully connected to Supabase PostgreSQL!")
        print(f"📊 Database: {result['database']}")
        print(f"👤 User: {result['user']}")
        print(f"🕐 Server Time: {result['timestamp']}")
        print(f"🗄️ PostgreSQL Version: {result['pg_version']}")
        
        # Test if we can create tables (important for migrations)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS connection_test (
                id SERIAL PRIMARY KEY,
                test_message TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)
        
        await conn.execute("""
            INSERT INTO connection_test (test_message) 
            VALUES ('Suraksha Backend Connection Test')
        """)
        
        test_count = await conn.fetchval("SELECT COUNT(*) FROM connection_test")
        print(f"✅ Database write test successful! ({test_count} test records)")
        
        # Clean up test table
        await conn.execute("DROP TABLE IF EXISTS connection_test")
        print("✅ Database cleanup successful!")
        
        await conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("\n🔧 Please check:")
        print("1. DATABASE_URL has the correct password")
        print("2. Supabase project is running")
        print("3. Your internet connection is stable")
        print("4. Your firewall isn't blocking the connection")
        return False

def test_api_keys():
    """Test if API keys are configured"""
    print("\n🔄 Testing Supabase API configuration...")
    
    supabase_url = os.getenv("SUPABASE_URL")
    anon_key = os.getenv("SUPABASE_ANON_KEY")
    service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not supabase_url:
        print("❌ SUPABASE_URL not found")
        return False
    
    if "[GET-FROM-SUPABASE-DASHBOARD]" in str(anon_key):
        print("❌ Please replace SUPABASE_ANON_KEY with actual key from dashboard")
        return False
    
    if "[GET-FROM-SUPABASE-DASHBOARD]" in str(service_key):
        print("❌ Please replace SUPABASE_SERVICE_ROLE_KEY with actual key from dashboard")
        return False
    
    print(f"✅ SUPABASE_URL: {supabase_url}")
    print(f"✅ SUPABASE_ANON_KEY: {'*' * 20}...{anon_key[-10:] if anon_key else 'Not set'}")
    print(f"✅ SUPABASE_SERVICE_ROLE_KEY: {'*' * 20}...{service_key[-10:] if service_key else 'Not set'}")
    
    return True

def test_other_config():
    """Test other configuration"""
    print("\n🔄 Testing other configuration...")
    
    openweather_key = os.getenv("OPENWEATHER_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    secret_key = os.getenv("SECRET_KEY")
    
    if openweather_key == "your-openweather-api-key-here":
        print("⚠️  OpenWeather API key is still default - weather features won't work")
    else:
        print(f"✅ OpenWeather API key configured: {openweather_key[:10]}...")
    
    if gemini_key and gemini_key != "your-gemini-api-key-here":
        print(f"✅ Gemini API key configured: {gemini_key[:10]}...")
    else:
        print("⚠️  Gemini API key not configured - AI features limited")
    
    if secret_key == "your-super-secret-key-change-this-in-production":
        print("⚠️  SECRET_KEY is still default - please change for security")
    else:
        print("✅ SECRET_KEY configured")
    
    return True

async def main():
    """Run all tests"""
    print("🚀 Suraksha Backend - Supabase Configuration Test")
    print("=" * 50)
    
    # Test API keys configuration
    api_keys_ok = test_api_keys()
    
    # Test database connection
    db_ok = await test_database_connection()
    
    # Test other configuration
    config_ok = test_other_config()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"{'✅' if api_keys_ok else '❌'} API Keys Configuration")
    print(f"{'✅' if db_ok else '❌'} Database Connection")
    print(f"{'✅' if config_ok else '❌'} Other Configuration")
    
    if db_ok and api_keys_ok:
        print("\n🎉 All tests passed! Your Supabase configuration is ready!")
        print("\nNext steps:")
        print("1. Run migrations: alembic upgrade head")
        print("2. Start the backend: uvicorn app.main:app --reload")
    else:
        print("\n⚠️  Some tests failed. Please fix the issues above.")

if __name__ == "__main__":
    asyncio.run(main())