#!/usr/bin/env python3

import http.server
import socketserver
import sys
import os

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='/home/user/webapp', **kwargs)
    
    def log_message(self, format, *args):
        sys.stdout.write(f"{self.log_date_time_string()} - {format%args}\n")
        sys.stdout.flush()

if __name__ == "__main__":
    PORT = 8000
    
    print(f"Запуск веб-сервера на порту {PORT}")
    print(f"Рабочая директория: {os.getcwd()}")
    sys.stdout.flush()
    
    with socketserver.TCPServer(('0.0.0.0', PORT), MyHTTPRequestHandler) as httpd:
        print(f"Сервер доступен по адресу: http://0.0.0.0:{PORT}")
        sys.stdout.flush()
        httpd.serve_forever()