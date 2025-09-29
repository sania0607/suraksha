import requests
import json

BASE_URL = "http://localhost:8001"

def test_auth_and_endpoints():
    print("🔐 Testing Authentication and Endpoints")
    print("=" * 50)
    
    # First, try to register a test user
    print("1. Registering test user...")
    try:
        register_data = {
            "name": "Test User",
            "email": "test@example.com",
            "password": "test123",  # Shorter password
            "role": "student"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/register", json=register_data, timeout=10)
        if response.status_code == 201:
            print("   ✅ User registered successfully!")
            user_data = response.json()
            token = user_data.get("access_token")
        elif response.status_code == 400:
            # User might already exist, try to login
            print("   ℹ️ User might already exist, trying login...")
            login_data = {
                "username": register_data["email"],
                "password": register_data["password"]
            }
            response = requests.post(f"{BASE_URL}/api/auth/login", data=login_data, timeout=10)
            if response.status_code == 200:
                print("   ✅ Logged in successfully!")
                user_data = response.json()
                token = user_data.get("access_token")
            else:
                print(f"   ❌ Login failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return
        else:
            print(f"   ❌ Registration failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return
            
    except Exception as e:
        print(f"   ❌ Auth error: {e}")
        return
    
    # Test authenticated endpoints
    print("\n2. Testing authenticated endpoints...")
    headers = {"Authorization": f"Bearer {token}"}
    
    endpoints = [
        ("/api/emergency/contacts", "Emergency Contacts"),
        ("/api/modules/", "Disaster Modules"),
    ]
    
    for path, description in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{path}", headers=headers, timeout=10)
            status = "✅" if response.status_code == 200 else "❌"
            print(f"   {status} {description}")
            print(f"      Status: {response.status_code}")
            
            if response.status_code == 200 and path == "/api/emergency/contacts":
                try:
                    data = response.json()
                    print(f"      Contacts found: {len(data)}")
                except:
                    print("      Response is not JSON")
        except Exception as e:
            print(f"   ❌ {description}: {e}")

if __name__ == "__main__":
    test_auth_and_endpoints()