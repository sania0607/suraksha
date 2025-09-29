"""
Debug Supabase connection issues
This script helps troubleshoot database connection problems
"""

import os
from urllib.parse import urlparse, quote_plus
from dotenv import load_dotenv

load_dotenv()

def analyze_database_url():
    """Analyze and validate the DATABASE_URL"""
    
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("❌ DATABASE_URL not found")
        return None
    
    print(f"🔍 Current DATABASE_URL: {database_url}")
    
    try:
        # Parse the URL
        parsed = urlparse(database_url)
        
        print(f"📊 Connection Details:")
        print(f"  • Host: {parsed.hostname}")
        print(f"  • Port: {parsed.port}")
        print(f"  • Database: {parsed.path[1:]}")  # Remove leading /
        print(f"  • Username: {parsed.username}")
        print(f"  • Password: {'*' * len(parsed.password) if parsed.password else 'None'}")
        
        # Check for common issues
        if not parsed.password:
            print("❌ No password found in URL")
        elif len(parsed.password) < 8:
            print("⚠️ Password seems too short")
        else:
            print("✅ Password appears to be present")
        
        # Check for special characters that might need encoding
        if parsed.password and any(c in parsed.password for c in ['@', ':', '/', '?', '#', '[', ']']):
            print("⚠️ Password contains special characters that might need URL encoding")
            
            # URL encode the password
            encoded_password = quote_plus(parsed.password)
            new_url = f"postgresql://{parsed.username}:{encoded_password}@{parsed.hostname}:{parsed.port}{parsed.path}"
            
            print(f"🔧 Try this encoded URL:")
            print(f"DATABASE_URL={new_url}")
        
        return parsed
    
    except Exception as e:
        print(f"❌ Error parsing DATABASE_URL: {e}")
        return None

def suggest_fixes():
    """Suggest common fixes for connection issues"""
    
    print("\n🔧 Common Solutions:")
    print("1. **Double-check password**: Go to Supabase → Settings → Database")
    print("2. **Reset password**: Click 'Reset database password' if needed")
    print("3. **Check project status**: Make sure your Supabase project is active")
    print("4. **Try connection pooler**: Some connections work better with pooler")
    print("5. **Check network**: Ensure you're not behind a restrictive firewall")
    
    print("\n📝 Alternative connection formats to try:")
    
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        parsed = urlparse(database_url)
        
        if parsed.hostname and parsed.password:
            # Direct connection
            print(f"Direct: postgresql://postgres:{parsed.password}@{parsed.hostname}:5432/postgres")
            
            # With SSL
            print(f"With SSL: postgresql://postgres:{parsed.password}@{parsed.hostname}:5432/postgres?sslmode=require")
            
            # Connection pooler (if available)
            pooler_host = parsed.hostname.replace('db.', 'pooler.')
            print(f"Pooler: postgresql://postgres:{parsed.password}@{pooler_host}:6543/postgres")

if __name__ == "__main__":
    print("🔍 Suraksha - Database Connection Debugger")
    print("=" * 50)
    
    parsed_url = analyze_database_url()
    suggest_fixes()
    
    print("\n" + "=" * 50)
    print("💡 Next steps:")
    print("1. Verify your password in Supabase dashboard")
    print("2. Try the suggested connection strings above")
    print("3. Update your .env file with the working URL")
    print("4. Run test_supabase.py again")