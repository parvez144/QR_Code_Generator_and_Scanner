import http.server
import socketserver
import webbrowser
import threading
import socket
import sys

DEFAULT_PORT = 8000

def find_free_port(start_port):
    """Find a free TCP port to prevent startup address conflicts."""
    port = start_port
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            res = sock.connect_ex(('localhost', port))
            if res != 0:  # Port is free
                return port
            port += 1

def start_server(port):
    """Binds to 0.0.0.0 and starts serving current workspace files."""
    # Ensure standard console is flushed
    sys.stdout.flush()
    
    class SilentHandler(http.server.SimpleHTTPRequestHandler):
        # Silence successful request logs in terminal for a clean dashboard look
        def log_message(self, format, *args):
            try:
                # Standard request logs have 3 args where args[0] is requestline and args[1] is status code
                if len(args) >= 3 and isinstance(args[0], str) and isinstance(args[1], str):
                    if "GET" in args[0] and (args[1] == "200" or args[1] == "304"):
                        return
            except Exception:
                pass
            super().log_message(format, *args)

    try:
        with socketserver.TCPServer(("0.0.0.0", port), SilentHandler) as httpd:
            print(f"\n" + "=" * 54)
            print(f" SPK QR — Wifi QR Code Generator & Scanner")
            print(f" Local Web Server Running At: http://localhost:{port}")
            print(f" " + "_" * 52)
            print(f" Press Ctrl+C in this terminal window to stop the server")
            print(f"======================================================\n")
            sys.stdout.flush()
            
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping SPK QR server...")
        sys.exit(0)
    except Exception as e:
        print(f"\nServer failed to boot: {e}")
        sys.exit(1)

if __name__ == "__main__":
    free_port = find_free_port(DEFAULT_PORT)
    url = f"http://localhost:{free_port}"
    
    # Open default web browser after a small delay to ensure listener is fully bound
    threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    
    start_server(free_port)
