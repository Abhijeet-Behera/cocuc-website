const fs = require('fs');

// Try a direct GeoJSON for Odisha
const url = 'https://raw.githubusercontent.com/shuklaneerajdev/IndiaStateTopojsonFiles/master/Odisha.geojson';

async function fetchGeoJSON() {
  console.log('Fetching Odisha GeoJSON directly...');
  const res = await fetch(url);
  const text = await res.text();
  
  if (text.trim().startsWith('{')) {
    fs.writeFileSync('public/odisha.json', text);
    console.log('Saved to public/odisha.json');
  } else {
    console.error('Invalid JSON received');
  }
}

fetchGeoJSON().catch(console.error);
