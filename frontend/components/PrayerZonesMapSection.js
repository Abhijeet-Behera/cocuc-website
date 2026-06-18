'use client';

import React, { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Map } from 'lucide-react';

const PRAYER_ZONES = [
  { id: 1, name: "Bethesda Zone", coords: [20.2670, 85.8350], coordinators: "Mr. Biswajeet Samantaray, Mr. Santosh Nayak", mobile: "79786 19310, 99372 14214", areas: "Unit-1, Unit-2, Unit-3, Bapuji Nagar, Ashok Nagar, Kharavela Nagar, Unit-9, Acharya Vihar, RRL Colony, Chandrama Appt." },
  { id: 2, name: "Ebenezer Zone", coords: [20.2830, 85.8250], coordinators: "Mr. Asim Das, Mr. Prasant Das, Rev. Amos Chandra Pradhan", mobile: "943730 69462, 63722 12253, 9438113974", areas: "Unit-4, Madhusudan Nagar, A G Colony, Police Colony, 120 Battalion, MLA Colony" },
  { id: 3, name: "Gethsemane Zone", coords: [20.2600, 85.8150], coordinators: "Mr. Ashok Kumar Kar, Mr. Asit Mohanty, Mr. Sandeep Kumar, Ms. Nilima Nayak", mobile: "82801 65572, 99383 71901, 99370 03361, 89843 47495", areas: "Unit-6, Surya Nagar, Airport Area, Ganga Nagar, OUAT Area, Forest Park, New Forest Park" },
  { id: 4, name: "Hebron Zone", coords: [20.2980, 85.8150], coordinators: "Prof. Anup Ku. Samantaray, Rev. Oriel Singh, Mr. Purnanada Pradhan (A)", mobile: "94373 07452, 99378 24639, 94392 63392", areas: "Nayapalli, VIP Colony, Rental Colony, IRC Village, Jayadev Vihar" },
  { id: 5, name: "Golgotha Zone", coords: [20.2950, 85.8420], coordinators: "Mrs. Reena Pradhan, Ms. Mita Sahu", mobile: "93370 31389", areas: "Sahid Nagar, Satya Nagar, Vani Vihar" },
  { id: 6, name: "Sinai Zone", coords: [20.2780, 85.8050], coordinators: "Mr. Ratan Kumar Das, Mr. Sanjeeb Kumar Das, Mr. Sanjeeb Ch Pradhan", mobile: "94391 92703, 76060 87764", areas: "Stewart School Area, BRIT Colony, DAV School Area, Unit-8, Raj Bhavan Colony, Behera Sahi, Baramunda" },
  { id: 7, name: "Bethel Zone", coords: [20.2520, 85.8450], coordinators: "Er. Michael Rajesh Behera, Mr. Rajballabh Supakar, Mr. Swarajya Jena, Mr. Samuel Pradhan", mobile: "94399 19188, 88954 35749, 94372 61383, 73810 23430", areas: "Badagada BRIT Colony, Kalpana Area, Cuttack-Puri Road, BJB Nagar, Lewis Road, Buddha Nagar, Gautam Nagar, Jharpada, Canal Road" },
  { id: 8, name: "Emmaus Zone", coords: [20.2350, 85.8350], coordinators: "Mr. Santanu Kumar Rout, Mr. J C Pal, Mr. Gourab Bardhan", mobile: "94370 26699, 94370 52547", areas: "Old Town Area, Samantarapur, Rabi Talkies Area, Bramheswarpatna, Satyasai Temple Area" },
  { id: 9, name: "Bethany Zone", coords: [20.2200, 85.8150], coordinators: "Mr. Rajesh Ku. Mohapatra, Mr. Alekh Chandra Das, Mr. Prafulla Kumar Dash", mobile: "63709 68169, 94398 75527", areas: "Sundarpada, Lingaraj Raod Station Area, Kapila Prasad" },
  { id: 10, name: "Sophia Zone", coords: [20.3150, 85.8220], coordinators: "Mrs. Ranjeeta Kumar, Mr. Deba Ranjan Pani, Mr. Daniel Digal", mobile: "89176 91909, 88951 86975", areas: "NALCO Nagar, Samanta Vihar, OSAP, Maitri Vihar, BDA Colony, BDA Basti, Gajapati Nagar - B" },
  { id: 11, name: "Horeb Zone", coords: [20.2950, 85.8600], coordinators: "Mr. Bibhuti Ranjan Sen, Mr. V L S S Raj, Mr. Ranjan Gan", mobile: "94395 58510, 94398 00281, 93372 61878", areas: "GGP Colony, Phulnakhara, Kesura, Rasulgarh" },
  { id: 12, name: "Mizpah Zone", coords: [20.3550, 85.8180], coordinators: "Mr. Amon Chandra Nag, Rev. Satya Ranjan Singh, Mr. Suranjan Thomas, Mr. Ashok Kumar Nanda", mobile: "94379 64773, 96688 09337, 94385 68600, 89175 97757", areas: "Patia, KIIT Campus, Niladri Vihar, Saileshree Vihar, Kanan Vihar, City Commercial Centre, Prasanti Vihar, Nandan Vihar" },
  { id: 13, name: "Hermon Zone", coords: [20.2750, 85.7750], coordinators: "Mr. Sandeep Mohanty, Mr. Jitendra Jena, Mr. Parag Ranjan Pradhan", mobile: "94373 53081, , ", areas: "Kalinga Studio Area, Kalinga Nagar, SUM Hospital Area, Khandagiri Bari, Malipada, Ghatikia, Bharatpur" },
  { id: 14, name: "Nazareth Zone", coords: [20.2450, 85.7600], coordinators: "Mr. K Tulasi Rao, Mr. Braja Kishore Das", mobile: "94373 87127, 84569 83222", areas: "Tamando, Kalinga Vihar, Patrapada, Udayagiri Vihar, Alu Godam, Satyasai Enclave, Tata Ariana, Khandagiri" },
  { id: 15, name: "Zion Zone", coords: [20.3250, 85.8450], coordinators: "Dr. Happy Born Nayak, Mr. Arup Das, Mr. Abhijeet Mohapatra", mobile: "94370 51610, 94393 39794", areas: "VSS Nagar, Gajapati Nagar - A, Rangamatia, Mancheswar Railway Colony, IT Colony, Chakeisiani, Netaji Enclave" },
  { id: 16, name: "Elim Zone", coords: [20.2500, 85.7950], coordinators: "Mr. Chinmay Muduli, Mr. Amrut Jena, Mr. Adit Kumar Jena", mobile: "99370 03507, 98612 82886, 95830 66358", areas: "Pokhariput, Jagamara, Jagamohan Nagar, Ganesh Nagar, Krishna Garden, Dharma Vihar, Satabdi Nagar, Dumduma, Soubhagya Nagar, Khandagiri, Cosmopolis, DN Oxypark, Sai Enclave & Aiginia" },
];

const BhubaneswarMapComponent = dynamic(() => import('./BhubaneswarMapComponent'), {
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

export default function PrayerZonesMapSection() {
  const [activeZoneId, setActiveZoneId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mapContainerRef = useRef(null);

  const filteredZones = useMemo(() => {
    if (!searchQuery) return PRAYER_ZONES;
    const lowerQuery = searchQuery.toLowerCase();
    return PRAYER_ZONES.filter(zone =>
      zone.name.toLowerCase().includes(lowerQuery) ||
      zone.areas.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

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
          <span className="title-normal">COCUC, </span>
          <em className="title-italic">Prayer Zones</em>
        </h2>
        <p style={{ color: '#666', marginTop: '10px' }}>Find your local prayer zone by searching your area or selecting on the map.</p>
      </div>

      {/* Search Bar */}
      <div style={{ maxWidth: '600px', margin: '0 auto 2rem auto', position: 'relative', zIndex: 50 }}>
        <div className="search-bar-wrapper">
          <Search size={20} color="#800000" style={{ marginRight: '10px', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by area (e.g., Patia, Unit-1) or Zone Name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '1rem',
              fontFamily: 'var(--font-body, sans-serif)',
              color: '#333'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#999', fontSize: '1.2rem', padding: '0 5px' }}
            >
              &times;
            </button>
          )}
        </div>

        {/* Search Suggestions Dropdown */}
        {showSuggestions && searchQuery && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            marginTop: '10px',
            maxHeight: '350px',
            overflowY: 'auto',
            border: '1px solid #eaeaea',
            overflow: 'hidden'
          }}>
            {filteredZones.length > 0 ? (
              filteredZones.map(zone => (
                <div
                  key={zone.id}
                  onClick={() => handleZoneClick(zone.id)}
                  style={{
                    padding: '12px 20px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff4f4'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <MapPin size={18} color="#800000" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: '600', color: '#333', fontSize: '1rem' }}>{zone.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '2px' }}>
                      {zone.areas.length > 60 ? zone.areas.substring(0, 60) + '...' : zone.areas}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                <p style={{ margin: 0 }}>No zones found for "{searchQuery}"</p>
                <p style={{ fontSize: '0.85rem', marginTop: '5px' }}>Contact a pastor or leader for your prayer zone.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pz-content-grid">

        {/* Map Container */}
        <div
          ref={mapContainerRef}
          className="pz-map-item"
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
          <BhubaneswarMapComponent
            zones={PRAYER_ZONES}
            activeZoneId={activeZoneId}
            onMarkerClick={setActiveZoneId}
            onClosePopup={handleClosePopup}
          />
        </div>

        {/* Location List Cards */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.4rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #800000, #a30000)',
              boxShadow: '0 4px 12px rgba(128,0,0,0.3)', flexShrink: 0
            }}>
              <Map size={18} color="#fff" />
            </span>
            Find on map
          </h3>

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
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f5f5f5; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ccc; }

        .pz-list-scroll {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 600px;
          overflow-y: auto;
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

function ZoneCard({ zone, isActive, onClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverState = isHovered && !isActive;

  return (
    <div
      className="zone-card"
      style={{
        background: isActive ? '#fffbfa' : '#fff',
        borderRadius: '14px',
        padding: '16px 18px 16px 16px',
        cursor: 'pointer',
        border: `1px solid ${isActive ? 'rgba(128,0,0,0.25)' : (hoverState ? 'rgba(128,0,0,0.1)' : 'rgba(0,0,0,0.06)')}`,
        boxShadow: isActive
          ? '0 12px 30px rgba(128,0,0,0.12)'
          : (hoverState ? '0 8px 24px rgba(128,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.03)'),
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
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
        background: 'linear-gradient(to right, #fff4f4, #ffffff)',
        opacity: hoverState ? 1 : 0,
        transition: 'opacity 0.3s ease',
        zIndex: 0, borderRadius: '14px'
      }}></div>

      {/* Clean inner content wrapper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative', zIndex: 1, transition: 'padding 0.3s ease' }}>
        {/* Elegant circular icon */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
          background: isActive ? '#800000' : (hoverState ? 'rgba(128,0,0,0.08)' : '#f5f5f5'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isActive ? '0 4px 12px rgba(128,0,0,0.3)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <MapPin size={22} color={isActive ? '#fff' : (hoverState ? '#800000' : '#777')} strokeWidth={2} />
        </div>

        <div style={{ minWidth: 0, flex: 1 }}>
          <h4 style={{
            margin: 0,
            color: isActive ? '#800000' : (hoverState ? '#600000' : '#222'),
            fontSize: '1rem',
            fontWeight: '700',
            letterSpacing: '0.01em',
            lineHeight: 1.2,
            marginBottom: '4px',
            transition: 'color 0.2s ease'
          }}>{zone.name}</h4>
          <p style={{
            margin: 0, fontSize: '0.8rem', color: '#777',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>{zone.areas}</p>
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
  );
}
