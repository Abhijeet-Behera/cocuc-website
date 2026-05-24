import re

try:
    with open(r"C:\Users\PC\.gemini\antigravity\brain\5e338918-38ba-4ca4-bdfb-0b39b43bb88f\.system_generated\steps\186\content.md", "r", encoding="utf-8") as f:
        content = f.read()
    
    pattern = re.compile(r'(aos-|wow|animate__|fade-|slide-|zoom-)', re.IGNORECASE)
    matches = pattern.finditer(content)
    
    found = set()
    for m in matches:
        start = max(0, m.start() - 20)
        end = min(len(content), m.end() + 20)
        found.add(content[start:end])
    
    for f in list(found)[:20]:
        print(f.replace('\n', ' '))
except Exception as e:
    print(e)
