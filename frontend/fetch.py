import urllib.request
import json
import ssl

url = 'https://raw.githubusercontent.com/geohacker/india/master/district/india_district.geojson'
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

print("Downloading India GeoJSON...")
try:
    response = urllib.request.urlopen(url, context=ctx)
    data = json.loads(response.read().decode('utf-8'))
    
    print("Filtering for Odisha...")
    odisha_features = []
    for feature in data['features']:
        props = feature.get('properties', {})
        state = str(props.get('st_nm', '')).lower()
        state2 = str(props.get('NAME_1', '')).lower()
        if 'odisha' in state or 'orissa' in state or 'odisha' in state2 or 'orissa' in state2:
            odisha_features.append(feature)
            
    if not odisha_features:
        print("Could not find Odisha features.")
        if data['features']:
            print("First feature properties:", data['features'][0]['properties'])
    else:
        odisha_geojson = {
            "type": "FeatureCollection",
            "features": odisha_features
        }
        with open('public/odisha.json', 'w') as f:
            json.dump(odisha_geojson, f)
        print("Saved to public/odisha.json")
except Exception as e:
    print("Error:", e)
