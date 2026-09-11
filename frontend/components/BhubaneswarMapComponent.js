'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapComponent.module.css';

// Fix for default marker icon issues in Next.js/Leaflet
delete L.Icon.Default.prototype._getIconUrl;

function MapController({ activeZoneId, zones }) {
  const map = useMap();
  useEffect(() => {
    if (activeZoneId) {
      const zone = zones.find(z => z.id === activeZoneId);
      if (zone) {
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
        
        // Calculate offset so the marker is placed lower on the screen,
        // leaving perfect space for the popup card above it in the center.
        // For zoom 14, offsets are much smaller.
        const latOffset = isMobile ? 0.015 : 0.010; 
        const targetLat = zone.coords[0] + latOffset;
        const targetLng = zone.coords[1];

        // Premium cinematic zoom-in effect
        map.flyTo([targetLat, targetLng], 14, {
          animate: true,
          duration: 1.0
        });
      }
    }
  }, [activeZoneId, map, zones]);
  return null;
}

export default function BhubaneswarMapComponent({ zones = [], activeZoneId, onMarkerClick, onClosePopup }) {
  const bhubaneswarCenter = [20.2850, 85.8150];
  const markerRefs = useRef({});

  useEffect(() => {
    if (activeZoneId && markerRefs.current[activeZoneId]) {
      // Wait for the flyTo animation to finish (1000ms) before opening the popup
      // This guarantees no "cropped while sliding" visual glitches!
      setTimeout(() => {
        if (markerRefs.current[activeZoneId]) {
          markerRefs.current[activeZoneId].openPopup();
        }
      }, 1000);
    }
  }, [activeZoneId]);

  const icons = useMemo(() => {
    const iconMap = {};
    zones.forEach(zone => {
      const isActive = zone.id === activeZoneId;
      iconMap[zone.id] = L.divIcon({
        className: styles.markerIcon,
        html: `
          <div class="${styles.markerLabel} ${isActive ? styles.hiddenLabel : ''}" title="click to get details">${zone.name}</div>
          <img src="/map-pin.svg" class="${styles.pulsatingPin}" title="click to get details" alt="GPS Pin" />
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -50],
      });
    });
    return iconMap;
  }, [zones, activeZoneId]);

  const renderCoordinators = (coordinatorsStr, mobileStr) => {
    if (!coordinatorsStr) return null;
    const names = coordinatorsStr.split(',').map(s => s.trim());
    const mobiles = mobileStr ? mobileStr.split(',').map(s => s.trim()) : [];

    return names.map((name, index) => (
      <div key={index} className={styles.coordinatorItem}>
        <div className={styles.coordinatorName}>{name}</div>
        {mobiles[index] && mobiles[index].trim() !== '' && (
          <a href={`tel:${mobiles[index].replace(/[\\s-]/g, '')}`} className={styles.coordinatorPhone} style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginTop: '4px' }}>
            <span>📞</span> <span style={{ textDecoration: 'underline' }}>{mobiles[index]}</span>
          </a>
        )}
      </div>
    ));
  };

  const activeZone = zones.find(z => z.id === activeZoneId);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={bhubaneswarCenter}
        zoom={12}
        scrollWheelZoom={!isMobile}
        dragging={!isMobile}
        style={{ height: '100%', width: '100%', zIndex: 1, backgroundColor: '#f8f9fa' }}
        minZoom={11}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapController activeZoneId={activeZoneId} zones={zones} />

        {/* Selected Zone Area Highlight */}
        {activeZone && (
          <Circle
            center={activeZone.coords}
            radius={1000}
            pathOptions={{ color: '#800000', fillColor: '#800000', fillOpacity: 0.1, weight: 1.5, dashArray: '5, 5' }}
          />
        )}

        {zones.map((zone) => (
          <Marker
            key={zone.id}
            position={zone.coords}
            icon={icons[zone.id]}
            ref={(ref) => {
              if (ref) markerRefs.current[zone.id] = ref;
            }}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) onMarkerClick(zone.id);
              },
              popupclose: () => {
                if (onClosePopup) onClosePopup(zone.id);
              }
            }}
          >
            <Popup className="customPopup" autoPan={false}>
              <div className={styles.popupHeader}>
                {zone.name}
              </div>
              <div className={styles.popupBody}>
                <div className={styles.popupSection}>
                  <strong style={{ color: '#800000', display: 'block', marginBottom: '8px' }}>Coordinators</strong>
                  <div className={styles.coordinatorsList}>
                    {renderCoordinators(zone.coordinators, zone.mobile)}
                  </div>
                </div>

                <div className={styles.popupSection} style={{ marginTop: '15px' }}>
                  <strong style={{ color: '#800000', display: 'block', marginBottom: '5px' }}>Areas Covered</strong>
                  <p className={styles.areaList}>{zone.areas}</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
