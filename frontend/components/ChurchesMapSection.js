'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CHURCHES = [
  { id: 7, name: "COCUC, Bhubaneswar", coords: [20.2961, 85.8245], desc: "Union Church Bhubaneswar, the mother church serving the heart of the city." },
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

  useGSAP(() => {
    gsap.fromTo('.church-list-item', 
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.1
      }
    );
  }, { scope: listContainerRef });

  const handleClosePopup = (churchId) => {
    setActiveChurchId((prev) => (prev === churchId ? null : prev));
  };

  const handleChurchClick = (churchId) => {
    setActiveChurchId(churchId);
    // On smaller screens, scroll down to the map so the user can see the zoomed-in effect
    if (window.innerWidth <= 768 && mapContainerRef.current) {
      setTimeout(() => {
        // We use an offset of 120px to account for the fixed Navbar at the top
        // so the map and its popup don't get hidden underneath it.
        const offset = 120; 
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = mapContainerRef.current.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 150);
    }
  };

  return (
    <section className="section container">
      <h2 className="section-title" style={{ marginBottom: '3rem' }}>Our Satellite Churches</h2>
      
      <div ref={listContainerRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', alignItems: 'stretch' }}>
        {/* Sidebar List */}
        <div style={{ 
          flex: '1 1 300px', 
          backgroundColor: '#ffffff', 
          borderRadius: '16px', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)', 
          padding: '24px',
          maxHeight: '550px',
          overflowY: 'auto',
          border: '1px solid #eaeaea'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            color: 'var(--color-primary, #800000)', 
            marginBottom: '1.5rem', 
            borderBottom: '2px solid #f4f4f4', 
            paddingBottom: '12px',
            fontFamily: 'var(--font-heading, sans-serif)'
          }}>
            Church of Christ, Union Church
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#777', marginTop: '6px', fontWeight: '400', textTransform: 'none', letterSpacing: 'normal' }}>(click the location to explore on map)</span>
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {CHURCHES.map((church) => {
              const isActive = activeChurchId === church.id;
              const isHovered = hoveredChurchId === church.id && !isActive;

              return (
              <li className="church-list-item" key={church.id} title="click here to get details" style={{ 
                padding: '16px 20px', 
                backgroundColor: isActive ? 'var(--color-primary, #800000)' : (isHovered ? '#fff4f4' : '#ffffff'), 
                borderRadius: '12px', 
                border: `1px solid ${isActive ? 'transparent' : (isHovered ? '#e8e8e8' : '#f0f0f0')}`,
                boxShadow: isActive ? '0 8px 24px rgba(128,0,0,0.25)' : (isHovered ? '0 8px 20px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.03)'),
                transform: isActive ? 'scale(1.02) translateY(-2px)' : (isHovered ? 'scale(1.01) translateY(-2px)' : 'none'),
                transition: 'all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
                cursor: 'pointer'
              }}
              onClick={() => handleChurchClick(church.id)}
              onMouseEnter={() => setHoveredChurchId(church.id)}
              onMouseLeave={() => setHoveredChurchId(null)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '42px', 
                    height: '42px', 
                    backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : '#fff4f4', 
                    borderRadius: '50%', 
                    flexShrink: 0,
                    boxShadow: isActive ? 'inset 0 0 10px rgba(255,255,255,0.1)' : '0 2px 8px rgba(128,0,0,0.05)',
                    transition: 'all 0.3s ease'
                  }}>
                    <img src="/map-pin.svg" alt="Pin" style={{ width: '22px', height: '22px', filter: isActive ? 'brightness(0) invert(1) drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'drop-shadow(0 2px 4px rgba(128,0,0,0.2))', transition: 'all 0.3s ease' }} />
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '1.1rem', color: isActive ? '#ffffff' : '#1a1a1a', marginBottom: '6px', fontFamily: 'var(--font-heading, sans-serif)', transition: 'color 0.3s ease' }}>
                      {church.name}
                    </strong>
                    <span style={{ fontSize: '0.9rem', color: isActive ? 'rgba(255,255,255,0.85)' : '#666', lineHeight: '1.5', display: 'block', fontFamily: 'var(--font-body, sans-serif)', transition: 'color 0.3s ease' }}>
                      {church.desc}
                    </span>
                  </div>
                </div>
              </li>
            )})}
          </ul>
        </div>

        {/* Map Container */}
        <div ref={mapContainerRef} style={{ flex: '2 1 600px', minHeight: '550px' }}>
          <MapComponent 
            churches={CHURCHES} 
            activeChurchId={activeChurchId} 
            onMarkerClick={setActiveChurchId} 
            onClosePopup={handleClosePopup}
          />
        </div>
      </div>
    </section>
  );
}
