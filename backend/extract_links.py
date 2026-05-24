import re
import json
import os

with open(os.path.join(os.path.dirname(__file__), 'config.json'), 'r') as config_file:
    config = json.load(config_file)

try:
    with open(config["INPUT_FILE_PATH"], "r", encoding="utf-8") as f:
        content = f.read()
        
    pattern = re.compile(r'<a[^>]+href=["\'](.*?)["\'][^>]*>(.*?)</a>', re.IGNORECASE | re.DOTALL)
    matches = pattern.findall(content)
    
    results = []
    for href, text in matches:
        text_clean = re.sub(r'<[^>]+>', '', text).strip()
        text_clean = re.sub(r'\s+', ' ', text_clean)
        if text_clean and href and 'unionchurch.org.in' in href:
            results.append(f"{text_clean} -> {href}")
            
    with open(config["LINKS_OUTPUT_PATH"], "w", encoding="utf-8") as out:
        out.write("\n".join(set(results)))
    print("Links extracted.")
except Exception as e:
    print(f"Error: Make sure the input file exists at {config['INPUT_FILE_PATH']}")
    print(e)
