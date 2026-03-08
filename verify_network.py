import requests
import socket
import sys

def check_port(host, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(2)
    result = sock.connect_ex((host, port))
    sock.close()
    return result == 0

def get_ip_address():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def test_api():
    local_ip = get_ip_address()
    print(f"Detected Local IP: {local_ip}")
    
    # Check port first
    if not check_port("127.0.0.1", 8000):
        print("ERROR: Port 8000 is not listening on 127.0.0.1. Is the backend running?")
        sys.exit(1)
        
    if not check_port(local_ip, 8000):
        print(f"WARNING: Port 8000 is open on 127.0.0.1 but NOT on {local_ip}. Check firewall or binding (host=0.0.0.0).")
    else:
        print(f"Port 8000 is listening on {local_ip}.")

    # Test Health Check
    try:
        url = f"http://{local_ip}:8000/"
        print(f"Testing Health Check: {url}")
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            print(f"SUCCESS: Health check passed. Server is reachable.")
            print(f"Response: {resp.json()}")
        else:
            print(f"WARNING: Health check returned {resp.status_code}")
    except requests.exceptions.Timeout:
        print(f"ERROR: Connection timed out to {url}. Likely a Firewall issue blocking incoming connections.")
    except Exception as e:
        print(f"ERROR: Failed to connect: {e}")

    # Test API Endpoint (Upload - simulated via simple GET to check 405 Method Not Allowed or 404 Not Found)
    # The endpoint is POST /api/v1/analysis/upload
    # A GET request should return 405 Method Not Allowed if the route exists, or 404 if it doesn't.
    try:
        url = f"http://{local_ip}:8000/api/v1/analysis/upload"
        print(f"Testing API Route Existence: {url}")
        resp = requests.get(url, timeout=5)
        if resp.status_code == 405:
            print("SUCCESS: Route exists (Method Not Allowed is expected for GET).")
        elif resp.status_code == 404:
            print("ERROR: Route NOT found (404). Check URL path or router registration.")
        else:
            print(f"Unexpected status: {resp.status_code}")
    except Exception as e:
        print(f"ERROR: API check failed: {e}")

if __name__ == "__main__":
    test_api()
