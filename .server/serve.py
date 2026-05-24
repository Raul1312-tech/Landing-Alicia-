from functools import partial
from http.server import SimpleHTTPRequestHandler
from pathlib import Path
from socketserver import TCPServer

ROOT = Path(r"C:\Users\light\Documents\Landing Alicia")
PORT = 4173


class ReusableTCPServer(TCPServer):
    allow_reuse_address = True


handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))

with ReusableTCPServer(("127.0.0.1", PORT), handler) as httpd:
    httpd.serve_forever()
