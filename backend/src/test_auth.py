import urllib.request
import urllib.parse
import json

data = urllib.parse.urlencode({'username': 'admin', 'password': 'admin12321'}).encode()
req = urllib.request.Request('http://localhost:8080/token', data=data)

try:
    with urllib.request.urlopen(req) as response:
        res_data = response.read().decode()
        print("SUCCESS:")
        print(json.dumps(json.loads(res_data), indent=2))
except Exception as e:
    print(f"FAILED: {e}")
