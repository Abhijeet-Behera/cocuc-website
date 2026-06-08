'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CHURCHES = [
  { id: 1, name: "Jagatsinghpur", coords: [20.2644, 86.1666], desc: "Our satellite church in Jagatsinghpur district." },
  { id: 2, name: "Nayagarh", coords: [20.1255, 85.1066], desc: "Our satellite church in Nayagarh district." },
  { id: 3, name: "Baripada", coords: [21.9320, 86.7265], desc: "Our satellite church in Baripada (Mayurbhanj)." },
  { id: 4, name: "Sundarpada", coords: [20.2177, 85.8055], desc: "Local satellite church serving the Sundarpada area." },
  { id: 5, name: "CSPUR", coords: [20.3100, 85.8150], desc: "Local satellite church serving Chandrasekharpur." },
  { id: 6, name: "Kalinga Vihar", coords: [20.2520, 85.7663], desc: "Local satellite church serving Kalinga Vihar." },
];

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
  const [hoveredChurchId, setHoveredChurchId] = useState(null);

  const mapContainerRef = useRef(null);
  const listContainerRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current,
        { opacity: 0, y: 20 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'all'
        }
      );
    }
  }, { scope: listContainerRef });

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
        <h2 className="section-title">Our Satellite Churches</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>Find our extended church family locations across the region.</p>
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
            churches={CHURCHES}
            activeChurchId={activeChurchId}
            onMarkerClick={setActiveChurchId}
            onClosePopup={handleClosePopup}
          />
        </div>

        {/* Location List Cards */}
        <div ref={listContainerRef} style={{ display: 'flex', flexDirection: 'column' }}>
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
            Find on map
          </h3>

          <div className="sc-list custom-scrollbar">
            {CHURCHES.map((church, index) => {
              const isActive = activeChurchId === church.id;
              const isHovered = hoveredChurchId === church.id && !isActive;

              return (
                <div
                  ref={el => cardsRef.current[index] = el}
                  key={church.id}
                  className="church-card"
                  style={{
                    background: isActive ? '#fffbfa' : '#fff',
                    borderRadius: '24px',
                    padding: '18px 20px',
                    cursor: 'pointer',
                    border: `1px solid ${isActive ? 'rgba(128,0,0,0.25)' : (isHovered ? 'rgba(128,0,0,0.1)' : 'rgba(0,0,0,0.05)')}`,
                    boxShadow: isActive
                      ? '0 12px 30px rgba(128,0,0,0.12)'
                      : (isHovered ? '0 10px 24px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.03)'),
                    transform: isActive ? 'translateY(-4px)' : (isHovered ? 'translateY(-4px)' : 'translateY(0)'),
                    transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                    position: 'relative',
                    overflow: 'visible' // Allow tooltip to show outside
                  }}
                  onClick={() => handleChurchClick(church.id)}
                  onMouseEnter={() => setHoveredChurchId(church.id)}
                  onMouseLeave={() => setHoveredChurchId(null)}
                >
                  {/* Background Overlay */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(to right, #fff4f4, #ffffff)',
                    transformOrigin: 'left', transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                    zIndex: 0, borderRadius: 'inherit'
                  }}></div>

                  {/* Tooltip */}
                  <div style={{
                    position: 'absolute', top: '50%', right: '15px', marginTop: '-15px',
                    background: 'rgba(128,0,0,0.9)', color: '#fff', padding: '6px 14px',
                    borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(128,0,0,0.2)', backdropFilter: 'blur(4px)',
                    opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateX(0)' : 'translateX(10px)',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    zIndex: 10, pointerEvents: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    View Map
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative', zIndex: 1, transition: 'padding 0.3s ease' }}>
                    {/* Elegant circular icon */}
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                      background: isActive ? '#800000' : (isHovered ? 'rgba(128,0,0,0.08)' : '#f5f5f5'),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: isActive ? '0 4px 12px rgba(128,0,0,0.3)' : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#fff' : (isHovered ? '#800000' : '#777')} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={{
                        margin: 0,
                        color: isActive ? '#800000' : (isHovered ? '#600000' : '#222'),
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
                      background: isActive ? 'rgba(128,0,0,0.08)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      transform: isActive ? 'translateX(2px)' : 'translateX(0)'
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#800000' : '#bbb'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )
            })}
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

        .sc-content-grid {
          display: flex;
          flex-direction: column-reverse;
          gap: 30px;
        }

        @media (min-width: 992px) {
          .sc-content-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            align-items: start;
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
