'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, GeoJSON, Marker, Popup, useMap, TileLayer } from 'react-leaflet';
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
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
        
        let latOffset = 0.04;
        if (church.id === 3) {
          latOffset = isMobile ? 0.09 : 0.06;
        } else if (church.id === 1 || church.id === 2) {
          latOffset = isMobile ? 0.06 : 0.04;
        } else {
          latOffset = isMobile ? 0.05 : 0.035;
        }
        
        const targetLat = church.coords[0] + latOffset;
        const targetLng = church.coords[1];

        // Premium cinematic zoom-in effect
        map.flyTo([targetLat, targetLng], 12, {
          animate: true,
          duration: 1.0
        });
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
      // Wait for the flyTo animation to finish (1000ms) before opening the popup
      // This guarantees no "cropped while sliding" visual glitches!
      setTimeout(() => {
        if (markerRefs.current[activeChurchId]) {
          markerRefs.current[activeChurchId].openPopup();
        }
      }, 1000);
    }
  }, [activeChurchId]);

  useEffect(() => {
    fetch('/odisha.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(console.error);
  }, []);

  const icons = useMemo(() => {
    const iconMap = {};
    churches.forEach(church => {
      const isActive = church.id === activeChurchId;
      const isMission = church.type === 'mission';
      const markerColor = isMission ? '#e65100' : '#800000'; // Vibrant orange for mission, Maroon for satellite

      iconMap[church.id] = L.divIcon({
        className: styles.markerIcon,
        html: `
          <div class="${styles.markerLabel} ${isActive ? styles.hiddenLabel : ''}" style="color: ${markerColor}; border-color: ${markerColor};" title="click to get details">${church.name}</div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="${styles.pulsatingPin}" title="click to get details" alt="GPS Pin">
            <ellipse cx="50" cy="90" rx="20" ry="8" fill="#dce0e3" stroke="#333333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M50 88 C50 88, 20 55, 20 35 A30 30 0 1 1 80 35 C80 55, 50 88, 50 88 Z" fill="${markerColor}" stroke="#333333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="50" cy="35" r="12" fill="#dce0e3" stroke="#333333" stroke-width="4"/>
          </svg>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -45],
      });
    });
    return iconMap;
  }, [churches, activeChurchId]);

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
    opacity: 0.8,
    color: '#ffffff', // Clean white borders for internal separation
    fillOpacity: 0.55 // Transparent enough so base map district names are properly visible
  });

  const highlightFeature = (e) => {
    const layer = e.target;
    layer.setStyle({
      weight: 2.5,
      color: '#800000', // Strong theme color on hover
      fillOpacity: 0.8
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
        permanent: false,
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
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
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
              icon={icons[church.id]}
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
              <Popup className={`customPopup`} autoPan={false}>
                <div 
                  className={styles.popupHeader}
                  style={church.type === 'mission' ? { background: 'linear-gradient(135deg, #e65100 0%, #ff6600 60%, #ff8c00 100%)' } : {}}
                >
                  {church.name}
                </div>
                <div className={styles.popupBody}>
                  <p>{church.desc}</p>
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
