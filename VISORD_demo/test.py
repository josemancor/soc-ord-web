import json
import re

try:
    with open("data/payload_data.js", "r") as f:
        text = f.read()
        
    json_str = text.split("window.VISORD_PAYLOAD = ")[1].rsplit(";", 1)[0]
    payload = json.loads(json_str)

    targetId = '1'
    metaG = 'A'
    timePattern = '([abc])'
    metaC = '1'
    regex = re.compile(f'^{targetId}{metaG}{timePattern}{metaC}$')

    matches = []
    for key, val in payload['subjects'].items():
        m = regex.match(key)
        if m:
            matches.append((m.group(1), val['coords']))

    print("Matches found:", len(matches))
    print("Example:", matches[0] if matches else "None")

except Exception as e:
    print("Error:", e)
