#!/usr/bin/env python3
"""
Test database connectivity
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.core.database import engine
    from sqlalchemy import text
    
    print("Testing database connection...")
    
    with engine.connect() as conn:
        result = conn.execute(text('SELECT 1 as test'))
        test_value = result.scalar()
        print(f"✅ Database connection successful! Test query result: {test_value}")
        
        # Test if tables exist
        tables_result = conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """))
        
        tables = [row[0] for row in tables_result.fetchall()]
        print(f"📋 Available tables: {tables}")
        
        if tables:
            print("✅ Database has tables - schema is initialized")
        else:
            print("⚠️ Database has no tables - may need migration")
            
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    print(f"Error type: {type(e).__name__}")
    sys.exit(1)