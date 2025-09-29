import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(path, description):
    try:
        response = requests.get(f"{BASE_URL}{path}", timeout=10)
        return {
            "endpoint": description,
            "path": path,
            "status": response.status_code,
            "success": response.status_code in [200, 201],
            "data": response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text
        }
    except Exception as e:
        return {
            "endpoint": description,
            "path": path,
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    print("🔬 Testing Suraksha Backend Endpoints...")
    print("=" * 50)
    
    endpoints = [
        ("/health", "Health Check"),
        ("/api/emergency/contacts", "Emergency Contacts"),
        ("/docs", "API Documentation"),
        ("/api/modules/", "Disaster Modules")
    ]
    
    for path, description in endpoints:
        result = test_endpoint(path, description)
        status = "✅" if result["success"] else "❌"
        print(f"{status} {description}")
        print(f"   Path: {path}")
        
        if result["success"]:
            print(f"   Status: {result['status']}")
            if path == "/emergency/contacts" and "data" in result:
                print(f"   Data: {len(result['data']) if isinstance(result['data'], list) else 'Not a list'} contacts")
        else:
            if "error" in result:
                print(f"   Error: {result['error']}")
            else:
                print(f"   Status: {result.get('status', 'Unknown')}")
        
        print()