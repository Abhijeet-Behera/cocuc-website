const fs = require('fs');

async function processGeoJSON() {
  console.log('Reading local india.geojson...');
  const text = fs.readFileSync('india.geojson', 'utf8');
  try {
    const data = JSON.parse(text);
    console.log('Filtering for Odisha...');
    const odishaFeatures = data.features.filter(f => 
      f.properties.NAME_1 === 'Orissa' || f.properties.NAME_1 === 'Odisha' || 
      f.properties.st_nm === 'Odisha' || f.properties.st_nm === 'Orissa' ||
      f.properties.STATE === 'ORISSA' || f.properties.STATE === 'ODISHA'
    );
    
    if (odishaFeatures.length === 0) {
      console.log('No features found. Properties of first feature:', data.features[0].properties);
      return;
    }

    const odishaGeoJSON = {
      type: 'FeatureCollection',
      features: odishaFeatures
    };
    fs.writeFileSync('public/odisha.json', JSON.stringify(odishaGeoJSON));
    console.log('Saved to public/odisha.json with', odishaFeatures.length, 'districts');
  } catch(e) {
    console.error('Failed to parse');
    console.error(e);
  }
}

processGeoJSON().catch(console.error);
