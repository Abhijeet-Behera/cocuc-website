'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Search, MapPin, Map } from 'lucide-react';

const PRAYER_ZONES = [
  { id: 1,  name: "Bethesda Zone",    coords: [20.2670, 85.8350], coordinators: "Mr. Biswajeet Samantaray, Mr. Santosh Nayak",                           mobile: "79786 19310, 99372 14214",              areas: "Unit-1, Unit-2, Unit-3, Bapuji Nagar, Ashok Nagar, Kharavela Nagar, Unit-9, Acharya Vihar, RRL Colony, Chandrama Appt." },
  { id: 2,  name: "Ebenezer Zone",    coords: [20.2830, 85.8250], coordinators: "Mr. Asim Das, Mr. Prasant Das, Rev. Amos Chandra Pradhan",              mobile: "943730 69462, 63722 12253, 9438113974", areas: "Unit-4, Madhusudan Nagar, A G Colony, Police Colony, 120 Battalion, MLA Colony" },
  { id: 3,  name: "Gethsemane Zone",  coords: [20.2600, 85.8150], coordinators: "Mr. Ashok Kumar Kar, Mr. Asit Mohanty, Mr. Sandeep Kumar, Ms. Nilima Nayak", mobile: "82801 65572, 99383 71901, 99370 03361, 89843 47495", areas: "Unit-6, Surya Nagar, Airport Area, Ganga Nagar, OUAT Area, Forest Park, New Forest Park" },
  { id: 4,  name: "Hebron Zone",      coords: [20.2980, 85.8150], coordinators: "Prof. Anup Ku. Samantaray, Rev. Oriel Singh, Mr. Purnanada Pradhan (A)", mobile: "94373 07452, 99378 24639, 94392 63392",  areas: "Nayapalli, VIP Colony, Rental Colony, IRC Village, Jayadev Vihar" },
  { id: 5,  name: "Golgotha Zone",    coords: [20.2950, 85.8420], coordinators: "Mrs. Reena Pradhan, Ms. Mita Sahu",                                     mobile: "93370 31389",                           areas: "Sahid Nagar, Satya Nagar, Vani Vihar" },
  { id: 6,  name: "Sinai Zone",       coords: [20.2780, 85.8050], coordinators: "Mr. Ratan Kumar Das, Mr. Sanjeeb Kumar Das, Mr. Sanjeeb Ch Pradhan",   mobile: "94391 92703, 76060 87764",              areas: "Stewart School Area, BRIT Colony, DAV School Area, Unit-8, Raj Bhavan Colony, Behera Sahi, Baramunda" },
  { id: 7,  name: "Bethel Zone",      coords: [20.2520, 85.8450], coordinators: "Er. Michael Rajesh Behera, Mr. Rajballabh Supakar, Mr. Swarajya Jena, Mr. Samuel Pradhan", mobile: "94399 19188, 88954 35749, 94372 61383, 73810 23430", areas: "Badagada BRIT Colony, Kalpana Area, Cuttack-Puri Road, BJB Nagar, Lewis Road, Buddha Nagar, Gautam Nagar, Jharpada, Canal Road" },
  { id: 8,  name: "Emmaus Zone",      coords: [20.2350, 85.8350], coordinators: "Mr. Santanu Kumar Rout, Mr. J C Pal, Mr. Gourab Bardhan",              mobile: "94370 26699, 94370 52547",              areas: "Old Town Area, Samantarapur, Rabi Talkies Area, Bramheswarpatna, Satyasai Temple Area" },
  { id: 9,  name: "Bethany Zone",     coords: [20.2200, 85.8150], coordinators: "Mr. Rajesh Ku. Mohapatra, Mr. Alekh Chandra Das, Mr. Prafulla Kumar Dash", mobile: "63709 68169, 94398 75527",           areas: "Sundarpada, Lingaraj Raod Station Area, Kapila Prasad" },
  { id: 10, name: "Sophia Zone",      coords: [20.3150, 85.8220], coordinators: "Mrs. Ranjeeta Kumar, Mr. Deba Ranjan Pani, Mr. Daniel Digal",           mobile: "89176 91909, 88951 86975",              areas: "NALCO Nagar, Samanta Vihar, OSAP, Maitri Vihar, BDA Colony, BDA Basti, Gajapati Nagar - B" },
  { id: 11, name: "Horeb Zone",       coords: [20.2950, 85.8600], coordinators: "Mr. Bibhuti Ranjan Sen, Mr. V L S S Raj, Mr. Ranjan Gan",              mobile: "94395 58510, 94398 00281, 93372 61878", areas: "GGP Colony, Phulnakhara, Kesura, Rasulgarh" },
  { id: 12, name: "Mizpah Zone",      coords: [20.3550, 85.8180], coordinators: "Mr. Amon Chandra Nag, Rev. Satya Ranjan Singh, Mr. Suranjan Thomas, Mr. Ashok Kumar Nanda", mobile: "94379 64773, 96688 09337, 94385 68600, 89175 97757", areas: "Patia, KIIT Campus, Niladri Vihar, Saileshree Vihar, Kanan Vihar, City Commercial Centre, Prasanti Vihar, Nandan Vihar" },
  { id: 13, name: "Hermon Zone",      coords: [20.2750, 85.7750], coordinators: "Mr. Sandeep Mohanty, Mr. Jitendra Jena, Mr. Parag Ranjan Pradhan",     mobile: "94373 53081, , ",                       areas: "Kalinga Studio Area, Kalinga Nagar, SUM Hospital Area, Khandagiri Bari, Malipada, Ghatikia, Bharatpur" },
  { id: 14, name: "Nazareth Zone",    coords: [20.2450, 85.7600], coordinators: "Mr. K Tulasi Rao, Mr. Braja Kishore Das",                               mobile: "94373 87127, 84569 83222",              areas: "Tamando, Kalinga Vihar, Patrapada, Udayagiri Vihar, Alu Godam, Satyasai Enclave, Tata Ariana, Khandagiri" },
  { id: 15, name: "Zion Zone",        coords: [20.3250, 85.8450], coordinators: "Dr. Happy Born Nayak, Mr. Arup Das, Mr. Abhijeet Mohapatra",            mobile: "94370 51610, 94393 39794",              areas: "VSS Nagar, Gajapati Nagar - A, Rangamatia, Mancheswar Railway Colony, IT Colony, Chakeisiani, Netaji Enclave" },
  { id: 16, name: "Elim Zone",        coords: [20.2500, 85.7950], coordinators: "Mr. Chinmay Muduli, Mr. Amrut Jena, Mr. Adit Kumar Jena",               mobile: "99370 03507, 98612 82886, 95830 66358", areas: "Pokhariput, Jagamara, Jagamohan Nagar, Ganesh Nagar, Krishna Garden, Dharma Vihar, Satabdi Nagar, Dumduma, Soubhagya Nagar, Khandagiri, Cosmopolis, DN Oxypark, Sai Enclave & Aiginia" },
];

const THEME_COLOR = '#800000'; // consistent maroon throughout

const BhubaneswarMapComponent = dynamic(() => import('./BhubaneswarMapComponent'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '550px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', borderRadius: '16px' }}>
      <div className="jumping-dots"><span></span><span></span><span></span></div>
    </div>
  )
});

export default function PrayerZonesMapSection() {
  const [activeZoneId, setActiveZoneId]       = useState(null);
  const [searchQuery, setSearchQuery]         = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mapContainerRef = useRef(null);
  const sectionRef      = useRef(null);
  const headingRef      = useRef(null);
  const searchRef       = useRef(null);
  const listColRef      = useRef(null);

  const filteredZones = useMemo(() => {
    if (!searchQuery) return PRAYER_ZONES;
    const q = searchQuery.toLowerCase();
    return PRAYER_ZONES.filter(z =>
      z.name.toLowerCase().includes(q) || z.areas.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 88%', once: true } }
      );
      gsap.fromTo(searchRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, delay: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: searchRef.current, start: 'top 88%', once: true } }
      );
      gsap.fromTo(listColRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out',
          scrollTrigger: { trigger: listColRef.current, start: 'top 82%', once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleClosePopup = (zoneId) => {
    setActiveZoneId((prev) => (prev === zoneId ? null : prev));
  };

  const handleZoneClick = (zoneId) => {
    setActiveZoneId(zoneId);
    setShowSuggestions(false);
    if (window.innerWidth <= 992 && mapContainerRef.current) {
      setTimeout(() => {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = mapContainerRef.current.getBoundingClientRect().top;
        window.scrollTo({ top: elementRect - bodyRect - offset, behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <section ref={sectionRef} className="section container" style={{ padding: '60px 20px' }}>

      {/* Heading */}
      <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '2rem', opacity: 0 }}>
        <h2 className="section-title-elegant">
          <span className="title-normal">COCUC, </span>
          <em className="title-italic">Prayer Zones</em>
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '10px', fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
          Find your local prayer zone by searching your area or selecting on the map.
        </p>
      </div>

      {/* Search Bar */}
      <div ref={searchRef} style={{ maxWidth: '600px', margin: '0 auto 2rem auto', position: 'relative', zIndex: 50, opacity: 0 }}>
        <div className="search-bar-wrapper" style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: '#fff', border: '1px solid #e8e8e8',
          borderRadius: '50px', padding: '0.7rem 1.25rem',
          boxShadow: '0 4px 20px rgba(128,0,0,0.07)',
          transition: 'all 0.25s ease',
        }}>
          <Search size={18} color={THEME_COLOR} style={{ flexShrink: 0, opacity: 0.75 }} />
          <input
            type="text"
            placeholder="Search by area or zone name…"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => setShowSuggestions(true)}
            style={{
              border: 'none', outline: 'none', width: '100%',
              fontSize: '0.95rem', fontFamily: 'var(--font-body)',
              color: '#333', background: 'transparent',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setShowSuggestions(false); }}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#aaa', fontSize: '1.1rem', lineHeight: 1, padding: '0 2px' }}
            >×</button>
          )}
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                background: '#fff', borderRadius: '16px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                border: '1px solid #f0f0f0',
                maxHeight: '320px', overflowY: 'auto',
                zIndex: 100,
              }}
            >
              {filteredZones.length > 0 ? filteredZones.map((zone, i) => (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, ease: 'easeOut' }}
                  onClick={() => handleZoneClick(zone.id)}
                  style={{
                    padding: '11px 18px', cursor: 'pointer',
                    borderBottom: i < filteredZones.length - 1 ? '1px solid #f5f5f5' : 'none',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fdf6f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <MapPin size={16} color={THEME_COLOR} style={{ flexShrink: 0, opacity: 0.7 }} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '0.95rem', fontFamily: 'var(--font-heading)' }}>{zone.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px', fontFamily: 'var(--font-body)' }}>
                      {zone.areas.length > 60 ? zone.areas.substring(0, 60) + '…' : zone.areas}
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontFamily: 'var(--font-body)' }}>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>No zones found for "{searchQuery}"</p>
                  <p style={{ fontSize: '0.82rem', marginTop: '4px', color: '#aaa' }}>Contact a pastor or leader for your prayer zone.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pz-content-grid">
        {/* Map */}
        <div ref={mapContainerRef} className="pz-map-item" style={{ width: '100%', minHeight: '600px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', border: '4px solid #fff', zIndex: 10 }}>
          <BhubaneswarMapComponent
            zones={PRAYER_ZONES}
            activeZoneId={activeZoneId}
            onMarkerClick={setActiveZoneId}
            onClosePopup={handleClosePopup}
          />
        </div>

        {/* Zone list */}
        <div ref={listColRef} style={{ display: 'flex', flexDirection: 'column', opacity: 0 }}>
          <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '3px', height: '28px', background: THEME_COLOR, borderRadius: '2px', flexShrink: 0 }} />
            <Map size={16} color={THEME_COLOR} style={{ opacity: 0.8 }} />
            <h3 style={{
              fontSize: '0.82rem', fontWeight: '700', color: THEME_COLOR,
              fontFamily: 'var(--font-heading)', letterSpacing: '0.1em',
              textTransform: 'uppercase', margin: 0,
            }}>Find on Map</h3>
          </div>

          <div className="pz-list-scroll custom-scrollbar">
            {PRAYER_ZONES.map((zone) => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                isActive={activeZoneId === zone.id}
                onClick={() => handleZoneClick(zone.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ccc; }

        .search-bar-wrapper:hover {
          border-color: rgba(128,0,0,0.3) !important;
          box-shadow: 0 6px 24px rgba(128,0,0,0.12) !important;
          transform: translateY(-2px);
        }
        .search-bar-wrapper:focus-within {
          border-color: #800000 !important;
          box-shadow: 0 6px 24px rgba(128,0,0,0.15), 0 0 0 3px rgba(128,0,0,0.1) !important;
          transform: translateY(-2px);
        }

        .pz-list-scroll {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 600px;
          overflow-y: auto;
          padding-top: 4px;
          padding-right: 4px;
          padding-bottom: 10px;
        }

        .pz-content-grid {
          display: flex;
          flex-direction: column-reverse;
          gap: 30px;
        }

        @media (min-width: 992px) {
          .pz-content-grid {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            align-items: start;
            gap: 30px;
          }
          .pz-map-item {
            position: sticky;
            top: 100px;
          }
        }
      `}</style>
    </section>
  );
}

/* ── Zone card ── */
function ZoneCard({ zone, isActive, onClick }) {
  const cardRef = useRef(null);

  const handleClick = () => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { scale: 0.97 },
        { scale: 1, duration: 0.35, ease: 'back.out(2)' }
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
          background: isActive ? 'rgba(128,0,0,0.04)' : '#fff',
          borderRadius: '10px',
          padding: '12px 14px',
          cursor: 'pointer',
          border: isActive
            ? '1.5px solid rgba(128,0,0,0.35)'
            : '1.5px solid #f0f0f0',
          boxShadow: isActive
            ? '0 6px 20px rgba(128,0,0,0.1)'
            : '0 1px 4px rgba(0,0,0,0.04)',
          transition: 'background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'rgba(128,0,0,0.03)';
            e.currentTarget.style.borderColor = 'rgba(128,0,0,0.2)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(128,0,0,0.08)';
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
      {/* Active left accent bar */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: '3px', background: THEME_COLOR,
              transformOrigin: 'top', borderRadius: '3px 0 0 3px',
            }}
          />
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: isActive ? '4px' : '0', transition: 'padding 0.22s ease' }}>
        <motion.div
          animate={{
            background: isActive ? THEME_COLOR : '#f3f4f6',
            boxShadow: isActive ? `0 4px 14px rgba(128,0,0,0.3)` : '0 0 0 transparent',
          }}
          transition={{ duration: 0.25 }}
          style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <MapPin size={18} color={isActive ? '#fff' : '#9ca3af'} strokeWidth={2} />
        </motion.div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h4 style={{
            margin: 0,
            color: isActive ? THEME_COLOR : '#1a1a1a',
            fontSize: '0.95rem', fontWeight: '700',
            fontFamily: 'var(--font-heading)',
            lineHeight: 1.2, marginBottom: '3px',
            transition: 'color 0.2s ease',
          }}>{zone.name}</h4>
          <p style={{
            margin: 0, fontSize: '0.75rem', color: '#8a8a8a',
            fontFamily: 'var(--font-body)', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{zone.areas}</p>
        </div>

        <motion.div
          animate={{ x: isActive ? 2 : 0, opacity: isActive ? 1 : 0.3 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0 }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke={isActive ? THEME_COLOR : '#ccc'}
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}
