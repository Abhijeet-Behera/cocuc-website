'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const SATELLITE_CHURCHES = [
  { id: 4, name: "Sundarpada",       coords: [20.2177, 85.8055], desc: "Coordinator: Evg. Ranjit Singh",               type: 'satellite' },
  { id: 5, name: "Chandrasekharpur", coords: [20.3100, 85.8150], desc: "Coordinator: Amon Chandra Nag",                type: 'satellite' },
  { id: 6, name: "Kalinga Vihar",    coords: [20.2520, 85.7663], desc: "Local satellite church serving Kalinga Vihar.", type: 'satellite' },
];

const MISSION_FIELDS = [
  // { id: 1, name: "Jagatsinghpur", coords: [20.2644, 86.1666], desc: "Our mission field in Jagatsinghpur district.", type: 'mission' },
  // { id: 2, name: "Nayagarh",      coords: [20.1255, 85.1066], desc: "Our mission field in Nayagarh district.",      type: 'mission' },
  // { id: 3, name: "Baripada",      coords: [21.9320, 86.7265], desc: "Our mission field in Baripada (Mayurbhanj).",  type: 'mission' },
];

const ALL_CHURCHES = [...SATELLITE_CHURCHES]; // ...MISSION_FIELDS removed for now

// ── Unified warm palette ──
const SATELLITE_COLOR = '#800000'; // deep maroon
const MISSION_COLOR   = '#e65100'; // vibrant deep orange per user request

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '550px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', borderRadius: '16px' }}>
      <div className="jumping-dots"><span></span><span></span><span></span></div>
    </div>
  )
});

export default function ChurchesMapSection() {
  const [activeChurchId, setActiveChurchId] = useState(null);
  const mapContainerRef = useRef(null);
  const sectionRef      = useRef(null);
  const headingRef      = useRef(null);
  const col1Ref         = useRef(null);
  const col2Ref         = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 88%', once: true } }
      );
      gsap.fromTo([col1Ref.current /*, col2Ref.current*/],
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.14, ease: 'power2.out',
          scrollTrigger: { trigger: col1Ref.current, start: 'top 84%', once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleClosePopup = (churchId) => {
    setActiveChurchId((prev) => (prev === churchId ? null : prev));
  };

  const handleChurchClick = (churchId) => {
    setActiveChurchId(churchId);
    if (window.innerWidth <= 992 && mapContainerRef.current) {
      setTimeout(() => {
        const bodyRect    = document.body.getBoundingClientRect().top;
        const elementRect = mapContainerRef.current.getBoundingClientRect().top;
        window.scrollTo({ top: elementRect - bodyRect - 80, behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <section ref={sectionRef} className="section container" style={{ padding: '60px 20px' }}>
      <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '2.5rem', opacity: 0 }}>
        <h2 className="section-title-elegant">
          <span className="title-normal">Satellite Churches</span>
          <em className="title-italic"> &amp; Mission Fields</em>
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '10px', fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
          Find our extended church family locations and mission fields across the state.
        </p>
      </div>

      <div className="sc-content-grid">
        {/* Map */}
        <div ref={mapContainerRef} className="sc-map-item" style={{ width: '100%', minHeight: '600px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '4px solid #fff', zIndex: 10 }}>
          <MapComponent
            churches={ALL_CHURCHES}
            activeChurchId={activeChurchId}
            onMarkerClick={setActiveChurchId}
            onClosePopup={handleClosePopup}
          />
        </div>

        {/* Satellite Churches */}
        <div ref={col1Ref} className="sc-list-col" style={{ opacity: 0 }}>
          <ListHeader label="Satellite Churches" color={SATELLITE_COLOR} />
          <div className="sc-list custom-scrollbar">
            {SATELLITE_CHURCHES.map((church) => (
              <ChurchCard
                key={church.id}
                church={church}
                themeColor={SATELLITE_COLOR}
                isActive={activeChurchId === church.id}
                onClick={() => handleChurchClick(church.id)}
              />
            ))}
          </div>
        </div>

        {/* Mission Fields */}
        {/* <div ref={col2Ref} className="sc-list-col" style={{ opacity: 0 }}>
          <ListHeader label="Mission Fields" color={MISSION_COLOR} />
          <div className="sc-list custom-scrollbar">
            {MISSION_FIELDS.map((church) => (
              <ChurchCard
                key={church.id}
                church={church}
                themeColor={MISSION_COLOR}
                isActive={activeChurchId === church.id}
                onClick={() => handleChurchClick(church.id)}
              />
            ))}
          </div>
        </div> */}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ccc; }

        .sc-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 600px;
          overflow-y: auto;
          padding-top: 4px;
          padding-right: 4px;
          padding-bottom: 10px;
        }
        .sc-list-col { display: flex; flex-direction: column; }
        .sc-content-grid { display: flex; flex-direction: column-reverse; gap: 30px; }

        @media (min-width: 992px) {
          .sc-content-grid {
            display: grid;
            /* grid-template-columns: 2fr 1fr 1fr; */
            grid-template-columns: 2fr 1fr;
            align-items: start;
            gap: 20px;
          }
          .sc-map-item { position: sticky; top: 100px; }
        }
      `}</style>
    </section>
  );
}

/* ── Column heading ── */
function ListHeader({ label, color }) {
  return (
    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '3px', height: '22px', background: color, borderRadius: '2px', flexShrink: 0 }} />
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ opacity: 0.75, flexShrink: 0 }}
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
      <h3 style={{
        fontSize: '0.75rem', fontWeight: '700', color, margin: 0,
        fontFamily: 'var(--font-heading)', letterSpacing: '0.12em', textTransform: 'uppercase'
      }}>{label}</h3>
    </div>
  );
}

/* ── Location card — no background overlay, border+shadow drive the states ── */
function ChurchCard({ church, isActive, onClick, themeColor }) {
  const cardRef = useRef(null);

  const handleClick = () => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { scale: 0.97 },
        { scale: 1, duration: 0.3, ease: 'back.out(2.5)' }
      );
    }
    onClick();
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={handleClick}
      whileHover={{ y: -2, transition: { type: 'spring', stiffness: 420, damping: 26 } }}
      style={{
        flexShrink: 0,
        borderRadius: '10px',
        padding: '12px 14px',
        cursor: 'pointer',
        background: isActive ? `${themeColor}0a` : '#fff',
        border: isActive
          ? `1.5px solid ${themeColor}55`
          : '1.5px solid #f0f0f0',
        boxShadow: isActive
          ? `0 6px 20px ${themeColor}1a`
          : '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = `${themeColor}08`;
          e.currentTarget.style.borderColor = `${themeColor}30`;
          e.currentTarget.style.boxShadow = `0 4px 14px ${themeColor}14`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = '#fff';
          e.currentTarget.style.borderColor = '#f0f0f0';
          e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
        }
      }}
    >
      {/* Active left accent */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="bar"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: '3px', background: themeColor,
              transformOrigin: 'top', borderRadius: '3px 0 0 3px',
            }}
          />
        )}
      </AnimatePresence>

      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        paddingLeft: isActive ? '4px' : '0',
        transition: 'padding 0.22s ease'
      }}>
        {/* Icon */}
        <motion.div
          animate={{
            background: isActive ? themeColor : '#f5f5f5',
            boxShadow: isActive ? `0 3px 10px ${themeColor}30` : 'none',
          }}
          transition={{ duration: 0.22 }}
          style={{ width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
            fill="none" stroke={isActive ? '#fff' : '#b0b0b0'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </motion.div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h4 style={{
            margin: '0 0 2px 0', fontSize: '0.92rem', fontWeight: '700',
            fontFamily: 'var(--font-heading)',
            color: isActive ? themeColor : '#1a1a1a',
            transition: 'color 0.2s ease', lineHeight: 1.25,
          }}>{church.name}</h4>
          <p style={{
            margin: 0, fontSize: '0.75rem', color: '#9a9a9a',
            fontFamily: 'var(--font-body)', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{church.desc}</p>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ x: isActive ? 2 : 0, opacity: isActive ? 1 : 0.25 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0 }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke={isActive ? themeColor : '#ccc'}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}
