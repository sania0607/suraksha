"""
Quick test script to verify API functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_api_endpoints():
    print("🧪 Testing Suraksha API Endpoints")
    print("=" * 50)
    
    try:
        # Test health endpoint
        print("1. Testing health endpoint...")
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        if response.status_code == 200:
            print("   ✅ Health check passed")
        else:
            print(f"   ❌ Health check failed: {response.status_code}")
            
        # Test registration
        print("\n2. Testing user registration...")
        register_data = {
            "email": "test@suraksha.edu",
            "password": "test123",
            "name": "Test User",
            "role": "STUDENT",
            "student_id": "TEST001",
            "department": "Computer Science"
        }
        
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data, timeout=10)
        if response.status_code in [200, 201]:
            print("   ✅ Registration successful")
            user_data = response.json()
            access_token = user_data.get('access_token')
            
            if access_token:
                # Test protected endpoint
                print("\n3. Testing protected endpoint...")
                headers = {"Authorization": f"Bearer {access_token}"}
                response = requests.get(f"{BASE_URL}/modules/", headers=headers, timeout=10)
                if response.status_code == 200:
                    modules = response.json()
                    print(f"   ✅ Modules endpoint working ({len(modules)} modules found)")
                else:
                    print(f"   ❌ Modules endpoint failed: {response.status_code}")
        else:
            print(f"   ❌ Registration failed: {response.status_code}")
            if response.content:
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data.get('detail', 'Unknown error')}")
                except:
                    print(f"   Raw response: {response.text}")
        
        # Test emergency endpoints
        print("\n4. Testing emergency contacts...")
        response = requests.get(f"{BASE_URL}/emergency/contacts", timeout=10)
        if response.status_code == 200:
            contacts = response.json()
            print(f"   ✅ Emergency contacts endpoint working ({len(contacts)} contacts)")
        else:
            print(f"   ❌ Emergency contacts failed: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API server!")
        print("💡 Make sure the FastAPI server is running on http://localhost:8000")
        print("💡 Run: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")

if __name__ == "__main__":
    test_api_endpoints()