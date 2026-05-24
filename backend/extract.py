import sys
from html.parser import HTMLParser

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.in_body = False
        self.in_script = False
    
    def handle_starttag(self, tag, attrs):
        if tag == 'body':
            self.in_body = True
        if tag in ('script', 'style'):
            self.in_script = True
            
    def handle_endtag(self, tag):
        if tag == 'body':
            self.in_body = False
        if tag in ('script', 'style'):
            self.in_script = False

    def handle_data(self, data):
        if self.in_body and not self.in_script:
            cleaned = data.strip()
            if cleaned:
                self.text.append(cleaned)

import json
import os

with open(os.path.join(os.path.dirname(__file__), 'config.json'), 'r') as config_file:
    config = json.load(config_file)

parser = MyHTMLParser()
try:
    with open(config["INPUT_FILE_PATH"], "r", encoding="utf-8") as f:
        parser.feed(f.read())
    with open(config["OUTPUT_FILE_PATH"], "w", encoding="utf-8") as out:
        out.write("\n".join(parser.text))
    print("Extraction completed.")
except Exception as e:
    print(f"Error: Make sure the input file exists at {config['INPUT_FILE_PATH']}")
    print(e)
