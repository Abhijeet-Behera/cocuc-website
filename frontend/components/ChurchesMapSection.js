'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const SATELLITE_CHURCHES = [
  { id: 4, name: "Sundarpada", coords: [20.2177, 85.8055], desc: "Coordinator: Evg. Ranjit Singh", type: 'satellite' },
  { id: 5, name: "Chandrasekharpur", coords: [20.3100, 85.8150], desc: "Coordinator: Amon Chandra Nag", type: 'satellite' },
  { id: 6, name: "Kalinga Vihar", coords: [20.2520, 85.7663], desc: "Local satellite church serving Kalinga Vihar.", type: 'satellite' },
];

const MISSION_FIELDS = [
  { id: 1, name: "Jagatsinghpur", coords: [20.2644, 86.1666], desc: "Our mission field in Jagatsinghpur district.", type: 'mission' },
  { id: 2, name: "Nayagarh", coords: [20.1255, 85.1066], desc: "Our mission field in Nayagarh district.", type: 'mission' },
  { id: 3, name: "Baripada", coords: [21.9320, 86.7265], desc: "Our mission field in Baripada (Mayurbhanj).", type: 'mission' },
];

const ALL_CHURCHES = [...SATELLITE_CHURCHES, ...MISSION_FIELDS];

// Dynamically import the map to disable SSR (Server Side Rendering)
// because Leaflet relies on the window object
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '550px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', borderRadius: '16px' }}>
      <div className="jumping-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
});

export default function ChurchesMapSection() {
  const [activeChurchId, setActiveChurchId] = useState(null);

  const mapContainerRef = useRef(null);

  const handleClosePopup = (churchId) => {
    setActiveChurchId((prev) => (prev === churchId ? null : prev));
  };

  const handleChurchClick = (churchId) => {
    setActiveChurchId(churchId);
    if (window.innerWidth <= 992 && mapContainerRef.current) {
      setTimeout(() => {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = mapContainerRef.current.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <section className="section container" style={{ padding: '60px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="section-title-elegant">
          <span className="title-normal">Satellite Churches</span>
          <em className="title-italic"> & Mission Fields</em>
        </h2>
        <p style={{ color: '#666', marginTop: '10px' }}>Find our extended church family locations and mission fields across the state.</p>
      </div>

      <div className="sc-content-grid">

        {/* Map Container */}
        <div
          ref={mapContainerRef}
          className="sc-map-item"
          style={{
            width: '100%',
            minHeight: '600px',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            border: '4px solid #fff',
            zIndex: 10
          }}
        >
          <MapComponent
            churches={ALL_CHURCHES}
            activeChurchId={activeChurchId}
            onMarkerClick={setActiveChurchId}
            onClosePopup={handleClosePopup}
          />
        </div>

        {/* Location List Cards for Satellite Churches */}
        <div className="sc-list-col">
          <h3 style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.4rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #800000, #a30000)',
              boxShadow: '0 4px 12px rgba(128,0,0,0.3)', flexShrink: 0
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" x2="9" y1="3" y2="18"/>
                <line x1="15" x2="15" y1="6" y2="21"/>
              </svg>
            </span>
            Satellite Churches
          </h3>

          <div className="sc-list custom-scrollbar">
            {SATELLITE_CHURCHES.map((church) => (
              <ChurchCard 
                key={church.id}
                church={church}
                isActive={activeChurchId === church.id}
                onClick={() => handleChurchClick(church.id)}
              />
            ))}
          </div>
        </div>

        {/* Location List Cards for Mission Fields */}
        <div className="sc-list-col">
          <h3 style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.4rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
              boxShadow: '0 4px 12px rgba(46,125,50,0.3)', flexShrink: 0
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                <line x1="9" x2="9" y1="3" y2="18"/>
                <line x1="15" x2="15" y1="6" y2="21"/>
              </svg>
            </span>
            Mission Fields
          </h3>

          <div className="sc-list custom-scrollbar">
            {MISSION_FIELDS.map((church) => (
              <ChurchCard 
                key={church.id}
                church={church}
                isActive={activeChurchId === church.id}
                onClick={() => handleChurchClick(church.id)}
              />
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f5f5f5; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ccc; }

        .sc-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 600px;
          overflow-y: auto;
          padding-right: 4px;
          padding-bottom: 10px;
        }
        
        .sc-list-col {
          display: flex;
          flex-direction: column;
        }

        .sc-content-grid {
          display: flex;
          flex-direction: column-reverse;
          gap: 30px;
        }

        @media (min-width: 992px) {
          .sc-content-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            align-items: start;
            gap: 20px;
          }
          .sc-map-item {
            position: sticky;
            top: 100px;
          }
        }
      `}</style>
    </section>
  );
}

function ChurchCard({ church, isActive, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverState = isHovered && !isActive;
  
  const isMission = church.type === 'mission';
  const themeColor = isMission ? '#2e7d32' : '#800000';
  const themeColorHover = isMission ? '#1b5e20' : '#600000';
  const themeColorLight = isMission ? 'rgba(46,125,50,0.08)' : 'rgba(128,0,0,0.08)';
  const themeColorBorderActive = isMission ? 'rgba(46,125,50,0.25)' : 'rgba(128,0,0,0.25)';
  const themeColorBorderHover = isMission ? 'rgba(46,125,50,0.2)' : 'rgba(128,0,0,0.2)';
  const themeColorShadowActive = isMission ? 'rgba(46,125,50,0.12)' : 'rgba(128,0,0,0.12)';
  const themeColorShadowHover = isMission ? 'rgba(46,125,50,0.12)' : 'rgba(128,0,0,0.12)';

  return (
    <div
      className="church-card"
      style={{
        background: isActive ? '#fffbfa' : '#fff',
        borderRadius: '14px',
        padding: '16px 18px 16px 16px',
        cursor: 'pointer',
        border: `1px solid ${isActive ? themeColorBorderActive : (hoverState ? themeColorBorderHover : 'rgba(0,0,0,0.06)')}`,
        boxShadow: isActive
          ? `0 12px 30px ${themeColorShadowActive}`
          : (hoverState ? `0 8px 24px ${themeColorShadowHover}` : '0 2px 8px rgba(0,0,0,0.03)'),
        transform: hoverState ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        position: 'relative',
        overflow: 'visible'
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Overlay */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: isMission ? 'linear-gradient(to right, #edf5eb, #ffffff)' : 'linear-gradient(to right, #fff0f0, #ffffff)',
        opacity: hoverState ? 1 : 0,
        transition: 'opacity 0.3s ease',
        zIndex: 0, borderRadius: '14px'
      }}></div>

      {/* Clean inner content wrapper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative', zIndex: 1, transition: 'padding 0.3s ease' }}>
        {/* Elegant circular icon */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
          background: isActive ? themeColor : (hoverState ? themeColorLight : '#f5f5f5'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isActive ? `0 4px 12px ${themeColorShadowActive}` : 'none',
          transition: 'all 0.3s ease'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#fff' : (hoverState ? themeColor : '#777')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
          </svg>
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h4 style={{
            margin: 0,
            color: isActive ? themeColor : (hoverState ? themeColorHover : '#222'),
            fontSize: '1rem',
            fontWeight: '700',
            letterSpacing: '0.01em',
            lineHeight: 1.2,
            marginBottom: '4px',
            transition: 'color 0.2s ease'
          }}>{church.name}</h4>
          <p style={{
            margin: 0, fontSize: '0.8rem', color: '#777',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>{church.desc}</p>
        </div>

        {/* Arrow indicator */}
        <div style={{
          flexShrink: 0,
          width: '24px', height: '24px',
          borderRadius: '50%',
          background: isActive ? themeColorLight : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s ease',
          transform: isActive ? 'translateX(2px)' : 'translateX(0)'
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isActive ? themeColor : '#bbb'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
