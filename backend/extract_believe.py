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

parser = MyHTMLParser()
try:
    with open(r"C:\Users\PC\.gemini\antigravity\brain\5e338918-38ba-4ca4-bdfb-0b39b43bb88f\.system_generated\steps\256\content.md", "r", encoding="utf-8") as f:
        parser.feed(f.read())
    
    output = "\n".join(parser.text)
    print(output[output.find("What We Believe") : output.find("Need Prayer")])
except Exception as e:
    print(e)
