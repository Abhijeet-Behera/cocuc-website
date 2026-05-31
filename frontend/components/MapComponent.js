'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapComponent.module.css';

// Fix for default marker icon issues in Next.js/Leaflet
delete L.Icon.Default.prototype._getIconUrl;

function MapController({ activeChurchId, churches }) {
  const map = useMap();
  useEffect(() => {
    if (activeChurchId) {
      const church = churches.find(c => c.id === activeChurchId);
      if (church) {
        // Calculate offset dynamically to prevent popups from cropping at the top
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
        let latOffset = 0.04;
        
        if (church.id === 3) {
          // Baripada (northern edge): large offset needed on mobile to push the pin down
          latOffset = isMobile ? 0.09 : 0.06;
        } else if (church.id === 1 || church.id === 2) {
          // Jagatsinghpur / Nayagarh: slight adjustment for mobile
          latOffset = isMobile ? 0.06 : 0.04;
        } else {
          latOffset = isMobile ? 0.05 : 0.04;
        }
        
        map.flyTo([church.coords[0] + latOffset, church.coords[1]], 11, { animate: true, duration: 1.5 });
      }
    }
  }, [activeChurchId, map, churches]);
  return null;
}

export default function MapComponent({ churches = [], activeChurchId, onMarkerClick, onClosePopup }) {
  const odishaCenter = [20.8, 85.3]; // Adjusted center for a better fit of Odisha
  const [geoData, setGeoData] = useState(null);
  const markerRefs = useRef({});

  useEffect(() => {
    if (activeChurchId && markerRefs.current[activeChurchId]) {
      // Small delay to allow flyTo to start before opening popup
      setTimeout(() => {
        if (markerRefs.current[activeChurchId]) {
          markerRefs.current[activeChurchId].openPopup();
        }
      }, 300);
    }
  }, [activeChurchId]);

  useEffect(() => {
    fetch('/odisha.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(console.error);
  }, []);

  // Create a custom icon using a div to allow CSS animations
  const createCustomIcon = (name, id) => {
    const isBaripada = id === 3;
    return L.divIcon({
      className: styles.markerIcon,
      html: `
        <div class="${styles.markerLabel}" title="click to get details">${name}</div>
        <img src="/map-pin.svg" class="${styles.pulsatingPin}" title="click to get details" alt="GPS Pin" />
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40], // Anchor to the bottom tip of the pin
      popupAnchor: isBaripada ? [0, 45] : [0, -45], // Baripada opens below, others above
    });
  };

  // Predefined pleasant pastel colors for districts
  const districtColors = [
    '#e6f2ff', '#e6ffe6', '#ffe6e6', '#fff2e6', '#f2e6ff', 
    '#e6ffff', '#ffe6ff', '#f2ffe6', '#e6e6ff', '#ffffe6',
    '#d9edf7', '#dff0d8', '#f2dede', '#fcf8e3', '#e1bee7'
  ];
  
  const getFeatureColor = (featureName) => {
    if (!featureName) return '#d6d6da';
    let hash = 0;
    for (let i = 0; i < featureName.length; i++) {
      hash = featureName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % districtColors.length;
    return districtColors[index];
  };

  const getGeoJsonStyle = (feature) => ({
    fillColor: getFeatureColor(feature?.properties?.NAME_2),
    weight: 1.5,
    opacity: 1,
    color: '#ffffff', // White borders for districts
    fillOpacity: 0.85
  });

  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 2.5,
      color: '#666',
      fillOpacity: 1
    });
  };

  const resetHighlight = (e) => {
    const layer = e.target;
    layer.setStyle(getGeoJsonStyle(layer.feature));
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
    // Optional: Add tooltip with district name
    if (feature.properties && feature.properties.NAME_2) {
      layer.bindTooltip(feature.properties.NAME_2, {
        permanent: true,
        direction: 'center',
        className: 'district-tooltip'
      });
    }
  };

  return (
    <div className={styles.mapContainer}>
      {geoData ? (
        <MapContainer 
          center={[20.8, 85.3]} 
          zoom={7.6} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%', zIndex: 1, backgroundColor: '#f8f9fa' }}
          minZoom={6}
          zoomControl={true}
          attributionControl={false}
        >
          <GeoJSON 
            data={geoData} 
            style={getGeoJsonStyle}
            onEachFeature={onEachFeature}
          />
          
          <MapController activeChurchId={activeChurchId} churches={churches} />

          {churches.map((church) => (
            <Marker 
              key={church.id} 
              position={church.coords} 
              icon={createCustomIcon(church.name, church.id)}
              ref={(ref) => {
                if (ref) markerRefs.current[church.id] = ref;
              }}
              eventHandlers={{
                click: () => {
                  if (onMarkerClick) onMarkerClick(church.id);
                },
                popupclose: () => {
                  if (onClosePopup) onClosePopup(church.id);
                }
              }}
            >
              <Popup className={`customPopup ${church.id === 3 ? styles.popupDown : ''}`}>
                <div className={styles.popupHeader}>
                  {church.name}
                </div>
                <div className={styles.popupBody}>
                  <p>{church.desc}</p>
                  <button className={styles.viewDetailsBtn}>View Details</button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="jumping-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      )}
    </div>
  );
}
