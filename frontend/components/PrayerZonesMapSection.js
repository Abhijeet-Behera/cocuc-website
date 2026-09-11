'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Search, MapPin, Map } from 'lucide-react';

const PRAYER_ZONES = [
  { id: 1,  name: "Bethesda Zone",    coords: [20.2670, 85.8350], coordinators: "Mr. Biswajeet Samantaray, Mr. Santosh Nayak",                           mobile: "79786 19310, 99372 14214",              pincodes: "751009, 751001, 751022, 751013", areas: "Unit-1, Unit-2, Unit-3, Bapuji Nagar, Ashok Nagar, Kharavela Nagar, Unit-9, Acharya Vihar, RRL Colony, Chandrama Appt." },
  { id: 2,  name: "Ebenezer Zone",    coords: [20.2830, 85.8250], coordinators: "Mr. Asim Das, Mr. Prasant Das, Rev. Amos Chandra Pradhan",              mobile: "943730 69462, 63722 12253, 9438113974", pincodes: "751022, 751001, 751008",         areas: "Unit-4, Madhusudan Nagar, A G Colony (Old & New), Police Colony, 120 Battalion, MLA Colony" },
  { id: 3,  name: "Gethsemane Zone",  coords: [20.2600, 85.8150], coordinators: "Mr. Ashok Kumar Kar, Mr. Asit Mohanty, Mr. Sandeep Kumar, Ms. Nilima Nayak", mobile: "82801 65572, 99383 71901, 99370 03361, 89843 47495", pincodes: "751001, 751003, 751009, 751020", areas: "Unit-6, Surya Nagar, Airport Area, Ganga Nagar, OUAT Area, Forest Park, New Forest Park" },
  { id: 4,  name: "Hebron Zone",      coords: [20.2980, 85.8150], coordinators: "Prof. Anup Ku. Samantaray, Rev. Oriel Singh, Mr. Purnanada Pradhan (A)", mobile: "94373 07452 / 90900 80871, 99378 24639, 94392 63392", pincodes: "751012, 751015",         areas: "Nayapalli, VIP Colony, Rental Colony, IRC Village, Jayadev Vihar" },
  { id: 5,  name: "Golgotha Zone",    coords: [20.2950, 85.8420], coordinators: "Mrs. Reena Pradhan, Ms. Mita Sahu",                                     mobile: "93370 31389",                           pincodes: "751007, 751004",                  areas: "Sahid Nagar, Satya Nagar, Vani Vihar" },
  { id: 6,  name: "Sinai Zone",       coords: [20.2780, 85.8050], coordinators: "Mr. Ratan Kumar Das, Mr. Sanjeeb Kumar Das, Mr. Sanjeeb Ch Pradhan",   mobile: "94391 92703, 76060 87764",              pincodes: "751008, 751003",                  areas: "Stewart School Area, BRIT Colony, DAV School Area, Unit-8, Raj Bhavan Colony, Behera Sahi, Baramunda" },
  { id: 7,  name: "Bethel Zone",      coords: [20.2520, 85.8450], coordinators: "Er. Michael Rajesh Behera, Mr. Rajballabh Supakar, Mr. Swarajya Jena, Mr. Samuel Pradhan", mobile: "94399 19188, 88954 35749, 94372 61383, 73810 23430", pincodes: "751018, 751006, 751014", areas: "Badagada BRIT Colony, Kalpana Area, Cuttack-Puri Road, BJB Nagar, Lewis Road, Buddha Nagar, Gautam Nagar, Jharpada, Canal Road" },
  { id: 8,  name: "Emmaus Zone",      coords: [20.2350, 85.8350], coordinators: "Mr. Santanu Kumar Rout, Mr. J C Pal, Mr. Gourab Bardhan",              mobile: "94370 26699, 94370 52547",              pincodes: "751002",                          areas: "Old Town Area, Samantarapur, Rabi Talkies Area, Bramheswarpatna, Satyasai Temple Area" },
  { id: 9,  name: "Bethany Zone",     coords: [20.2200, 85.8150], coordinators: "Mr. Rajesh Ku. Mohapatra, Mr. Alekh Chandra Das, Mr. Prafulla Kumar Dash", mobile: "63709 68169, 94398 75527",           pincodes: "751002",                          areas: "Sundarpada, Lingaraj Raod Station Area, Kapila Prasad" },
  { id: 10, name: "Sophia Zone",      coords: [20.3150, 85.8220], coordinators: "Mrs. Ranjeeta Kumar, Mr. Deba Ranjan Pani, Mr. Daniel Digal",           mobile: "89176 91909, 88951 86975",              pincodes: "751013, 751016, 751017, 751023",  areas: "NALCO Nagar, Samanta Vihar, OSAP, Maitri Vihar, BDA Colony, BDA Basti, Gajapati Nagar - B, (Press Chhaka)" },
  { id: 11, name: "Horeb Zone",       coords: [20.2950, 85.8600], coordinators: "Mr. Bibhuti Ranjan Sen, Mr. V L S S Raj, Mr. Ranjan Gan",              mobile: "94395 58510, 94398 00281 / 97771 05840, 93372 61878", pincodes: "751010, 751025", areas: "GGP Colony, Phulnakhara, Kesura, Rasulgarh" },
  { id: 12, name: "Mizpah Zone",      coords: [20.3550, 85.8180], coordinators: "Mr. Amon Chandra Nag, Rev. Satya Ranjan Singh, Mr. Suranjan Thomas, Mr. Ashok Kumar Nanda", mobile: "94379 64773, 96688 09337, 94385 68600, 89175 97757", pincodes: "751016, 751017, 751021, 751024, 751031", areas: "Patia, KIIT Campus, Niladri Vihar, Saileshree Vihar, Kanan Vihar, City Commercial Centre, Prasanti Vihar, Nandan Vihar" },
  { id: 13, name: "Hermon Zone",      coords: [20.2750, 85.7750], coordinators: "Mr. Sandeep Mohanty",                                                    mobile: "94373 53081",                           pincodes: "751003, 751030",                  areas: "Kalinga Studio Area, Kalinga Nagar, SUM Hospital Area, Khandagiri Bari, Malipada, Ghatikia, Bharatpur" },
  { id: 14, name: "Nazareth Zone",    coords: [20.2450, 85.7600], coordinators: "Mr. K Tulasi Rao, Mr. Braja Kishore Das",                               mobile: "94373 87127, 84569 83222",              pincodes: "751019, 751030, 752054",         areas: "Tamando, Kalinga Vihar, Patrapada, Udayagiri Vihar, Alu Godam, Satyasai Enclave, Tata Ariana, Khandagiri" },
  { id: 15, name: "Zion Zone",        coords: [20.3250, 85.8450], coordinators: "Dr. Happy Born Nayak, Mr. Arup Das, Mr. Abhijeet Mohapatra",            mobile: "94370 51610, 94393 39794",              pincodes: "751007, 751013, 751016, 751017",  areas: "VSS Nagar, Gajapati Nagar - A (Near Saink School), Rangamatia, Mancheswar Railway Colony, IT Colony, Chakeisiani, Netaji Enclave" },
  { id: 16, name: "Elim Zone",        coords: [20.2500, 85.7950], coordinators: "Mr. Chinmay Muduli, Mr. Amrut Jena, Mr. Adit Kumar Jena",               mobile: "99370 03507, 98612 82886, 95830 66358", pincodes: "751019, 751020, 751030",         areas: "Pokhariput, Jagamara, Jagamohan Nagar, Ganesh Nagar, Krishna Garden, Dharma Vihar, Satabdi Nagar, Dumduma, Soubhagya Nagar, Khandagiri, Cosmopolis, DN Oxypark, Sai Enclave & Aiginia" },
];

const PINCODE_AREAS = {
  "751001": "AG / AG Area, Bhubaneswar G.P.O. Area, Bhubaneswar Secretariat, Secretariat Area, Orissa Assembly / Odisha Legislative Assembly Area, MLA Colony, Bhauma Nagar, Unit-3, Unit-4 (parts), Unit-5 (parts), Unit-6 (parts), Master Canteen Area, Industrial Area, Railway Yard & Washing Line, Labour Colony, Ekamra Vihar, Ekamra Hat Area, RBI Colony, Giridurga / Giridurg Area, CG Colony / C.G. Colony, Janpath / B.R. Patel Marg Area, Madhusudan Marg Area, OFDC Colony, NAC Colony, IAS & MLA Quarters, Government Quarters / VR Quarters, Unit-4 Market Street Area, Kharavela Nagar / Kharabela Nagar Market / Master Canteen Chowk Area, Chandrama Complex / Chandrama Apartment, Suka Vihar, Government / Secretariat Quarters and Central Administrative Area, Unit-6, Ganga Nagar, Unit-6 Market / Central Unit-6 Area, Raj Bhavan-side Central-Government Addresses",
  "751002": "Old Town, Santarapur / Samantarapur, Rabi Talkies Area, Brahmeswarpatna / Brahmeswar Bagh, Satyasai Temple Area (Old Town-side), Sundarpada, Lingaraj Road / Lingaraj Road Station Area, Kapila Prasad, Kapileswar, Bhimatangi, Bankual, Gopinathpur, Harachandi Sahi, Ittipur, Kalyanpur Sasan, Kausalyaganga, Kedargouri / Kedar Gouri, Kuha, Sisupalgarh, Lingipur, Mausima Area, Lingaraj Nagar, Court Area (Old Town-side), Sriram Nagar, Ratha Road, Ebaranga, Botanda, Nageswar Tangi, Lewis Road (Old Town / Buxi Jagabandhu Road Side), Tankapani Road (Old Townside), Ratnakar Bag, Samantarapur Patna, Bhoi Sahi, Jena Sahi, Sahaspur, Radhamohanpur, Nuagaon, Bikipur, Gangeswarpur Sasan, K.P. Sasan Nuasahi, Raghunath Nagar, Santha Vihar, Taila Sahi, Vijay Vihar, Kesura / Kesura Road",
  "751003": "Baramunda Colony S.O., Baramunda, Baramunda Housing Colony, Bharatpur, Ghatikia, Malipada, Andharua, Surya Nagar (Suryanagar S.O.), OUAT Area / OUAT Campus, Kalinga Studio Area, Kalinga Nagar, SUM Hospital Area / Sijua-Patrapada Corridor",
  "751004": "Utkal University, Vani Vihar, Utkal University Campus / University Way, Utkala Nagar, Sachivalaya Marg (Utkal University Stretch), Zoology Road (Utkal University Stretch)",
  "751006": "Kalpana Square / Kalpana Area, Laxmisagar / Laxmi Sagar, Buddha Nagar, Jharapada / Jharpada, Canal Road, Budheswari Colony, Chintamaniswar-side Locality, Cuttack-Puri Road (Kalpana - Laxmisagar Stretch)",
  "751007": "Saheed Nagar / Sahid Nagar, Satyanagar / Satya Nagar, V S S Nagar, VSS Nagar Housing Board Area, Dhirukuti Sahi, Hotel Management Area, Bira Surendra Sahi Park Area, Patra Sahi Slum (part)",
  "751008": "Raj Bhavan S.O., Raj Bhavan Colony, Unit-8 / Gopabandhu Nagar (Raj Bhavan-side Addresses), Stewart School / Stewart-Paika Nagar Road",
  "751009": "Ashok Nagar, Bapujee Nagar / Bapuji Nagar, Bhubaneswar R.S., Udyan Marg, Unit-1, Unit-2, Bhubaneswar Railway Station-side Area, Forest Park, New Forest Park",
  "751010": "Rasulgarh / Rasulgarh S.O., GGP Colony / G.G.P. Colony (Rasulgarh), GGP Village, GGP Enclaves, GGP Colony Road, Rasulgarh Industrial Estate, IDCO Colony, Mancheswar Industrial Estate Sector A, Pandra, Koradakanta, Jagannath Nagar, Palasuni / Palasuni Hata, Mahadev Nagar, Dayanandnagar, Bomikhal, Parida Colony, Satya Vihar, Nuasahi, Chatta Krushak Bazar Area, Chakeisiani",
  "751012": "Nayapalli / Nayapalli S.O. Area, Old Nayapalli, Nayapalli Nuasahi, BRIT Colony / Nilakantha Nagar, DAV School Area / CRP-DAV Road / DAV Unit-8 Area, Behera Sahi, Unit-8 / Gopabandhu Nagar (Nayapalli-side), CBI Quarters / CBI Office Area, OCC Basti, OCC Ltd Area, Sitapur Basti, Upper Sahi, Jagannath Basti, Natha Basti, Sports Colony, Energy Police Station Area, Nayapalli College Area, Delta Quarters, Etype-Quarters, 2RA Quarters, Lane Nos. 2-12 / Nayapalli Lanes, Akhandalamani Mandir Lane, Dr. B.D. Nayak Lane, Santosh(i) Mandir Lane, PPT Guest House Road, NH-5 / NH16-side (Nayapalli Stretch), BDA NICCO Park Area, NHPC Area, OSCSC Area, ICWAI Campus Area, Ananda Vihar, Kanchan Vihar / Kanchan Villa Area, Krishna Tower Area, Mahabir Complex Area, IRC Village-side Addresses, Baramunda-side Addresses using Nayapalli PO, Pragati / Office and Institutional Pockets within Nayapalli S.O.",
  "751013": "Regional Research Laboratory (RRL) / RRL Colony, Gajapati Nagar / Gajapati Nagar - A / Gajapati Nagar - B, Jayadev Vihar, Nalco Bhawan / NALCO Office Area, Samantapur / Samanta Vihar-side Addresses, New Government Colony, Kalinga Hospital / Fortune Tower Vicinity",
  "751014": "B.J.B. Nagar S.O., BJB Nagar, Bhubaneswar Court Area, Gautam Nagar, Lewis Road (BJB-side Addresses), Cuttack-Puri Road (BJB-side Sections)",
  "751015": "Nayapalli",
  "751016": "Chandra Sekhar Pur / Chandrasekharpur, BDA Colony (Chandrasekharpur), Housing Board Colony / C.S. Pur HB Colony, Prachi Enclave, Niladri Vihar Sector I-II, District Centre / Commercial Centre Area, Damana Hat, DAV School Area, Acharya Harihar College Area, Gadakana, Netaji Enclave, NABARD Colony, Nalco Phase-II, Nilamadhab Basti, BDA Basti",
  "751017": "Mancheswar, Mancheswar R.S., Mancheswar Railway Colony, OSAP / OSAP Campus, Rangamatia / Rangamatia, Mancheswar, Railway Colony Area, Mancheswar Industrial Estate (parts / nearby), Bhotapada, IT Colony (Mancheswar-side)",
  "751018": "Badagarh Brit Colony S.O., Badagada BRIT Colony, Badagada, Pandav Nagar, BRIT Colony / Badagada Area, Cuttack-Puri Road (Badagada Sections)",
  "751019": "Patrapada, Kalinga Vihar / Kalinga Vihar B.O., Kalinga Vihar Phase Areas, Dumduma Housing Board Colony, Dumduma, Aiginia / Aiginia B.O., Soubhagya Nagar, DN Oxypark, Sai Enclave, Udayagiri Vihar, Alu Godam, Satyasai Enclave, Tata Ariana, AIIMS / AIIMS ND Area, Kolathia / Kolathia Housing Board, Sarakantara, Jadupur, Mahavir Nagar, Gangapatana, Khandagiri Vihar-side Areas",
  "751020": "Aerodrome Area, Airport Area / Airport S.O., Biju Patnaik International Airport, Pokhariput / Pokhariput S.O., Airport Road / Aerodrome Area",
  "751021": "Sailashree Vihar / Saileshree Vihar",
  "751022": "Acharya Vihar, Bhoinagar / Bhoi Nagar, Madhusudan Nagar (Khorda), Old AG Colony / AG Colony, Unit-4 Old AG Colony, New AG Colony, Unit-9 (parts), Baya Baba Matha Lane / Unit-9 Area, Gridco Colony, OPTCL Colony, Anand Bazar Area, Bhoinagar Basti, Acharya Vihar Baya Baba Matha Road Area, DM School Road / New AG Colony Area, Parthasarathi Lane / Old AG Colony, Patel Marg / AG Colony, Sachivalaya Marg / Old AG Colony & OPTCL Colony, Unit-4 Main Street / Old AG Colony, Rama Devi College Road / Gridco-OPTCL-Unit-9 Stretch, Service Road / Bhoi Nagar-Gridco Colony Stretch, Rajendra Narain Singh Deo Marg / Acharya Vihar, IPICOL Road / Unit-9 Area, Central School Road / Unit-9-Satya Nagar Side, Road No. 4, Road No. 5, Road No. 6, Road No. 7 and Road No. 8, Asian Highway 45 / Acharya Vihar Stretch",
  "751023": "NALCO Nagar, Maitri Vihar, S.E. Railway Project Complex, Rail Vihar, Chandrasekharpur-side Residential / Institutional Pockets",
  "751024": "Patia / Patia GDS, KIIT / KIIT Campus / KIIT Hostel, Kalarahanga / Kalarahanga Area, Prasanti Vihar, Nandan Vihar, Kanan Vihar, Shree Vihar, Damana, Info City / Infocity, Aryapalli, Maruti Vihar, Trishna Enclave, Adarsha Vihar, Sikharchandi Area, Western Apartment Area, Patia Big Bazaar Area, Basundhara Colony, Bajrang Vihar, Jaganath Vihar, Mahaveer Nagar, Mahavinayak Puram, Surya Vihar, Gayatri Vihar, Laxmi Vihar, Star City Area, Munda Sahi, Nandan Kanan Road-side Patia Area",
  "751025": "Rasulgarh-side GGP Colony Addresses (Postal Sub-pocket)",
  "751030": "Khandagiri / Khandagiri S.O., Khandagiri Bari, Khandagiri Hills-side Locality, Khandagiri Square Area, Jagamara / Jagamara Housing & Residential Pockets, Jagamara Road-side Localities, Jagamohan Nagar, Ganesh Nagar, Krishna Garden, Dharma Vihar, Cosmopolis, Satabdi Nagar",
  "751031": "Patia",
  "752054": "Tamando / Tamando B.O., Madanpur, Kaimatia, Kantabad, Gangapada, Garidipanchana-side Corridor, Paikerapur, Palaspur, Reta R.S., Bhuasuni-side Rural/Peripheral Localities, Chandaka-side Peripheral Villages",
  "754001": "Phulnakhara, Phulnakhara Junction"
};

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
  const [pincodeQuery, setPincodeQuery]       = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mapContainerRef = useRef(null);
  const sectionRef      = useRef(null);
  const headingRef      = useRef(null);
  const searchRef       = useRef(null);
  const listColRef      = useRef(null);

  const filteredZones = useMemo(() => {
    if (!searchQuery && !pincodeQuery) return PRAYER_ZONES;
    
    const normalizeText = (text) => {
      if (!text) return '';
      return text.replace(/[.,\-]/g, '').replace(/\s+/g, '').toLowerCase();
    };

    const q = normalizeText(searchQuery);
    const pq = normalizeText(pincodeQuery);

    return PRAYER_ZONES.filter(z => {
      let extendedAreasStr = '';
      if (z.pincodes) {
        const pinArray = z.pincodes.split(',').map(p => p.trim());
        extendedAreasStr = pinArray.map(pin => PINCODE_AREAS[pin] || '').join(' ');
      }
      
      const matchName = normalizeText(z.name).includes(q);
      const matchAreas = normalizeText(z.areas).includes(q);
      const matchExtended = normalizeText(extendedAreasStr).includes(q);
      
      const matchAreaQuery = q ? (matchName || matchAreas || matchExtended) : false;
      const matchPincodeQuery = pq ? (z.pincodes && normalizeText(z.pincodes).includes(pq)) : false;
      
      if (q && pq) return matchAreaQuery || matchPincodeQuery;
      if (q) return matchAreaQuery;
      if (pq) return matchPincodeQuery;
      return true;
    });
  }, [searchQuery, pincodeQuery]);

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
      <div ref={searchRef} style={{ maxWidth: '800px', margin: '0 auto 2rem auto', position: 'relative', zIndex: 50, opacity: 0 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {/* Area Search */}
          <div className="search-bar-wrapper" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#fff', border: '1px solid #e8e8e8',
            borderRadius: '50px', padding: '0.7rem 1.25rem',
            boxShadow: '0 4px 20px rgba(128,0,0,0.07)',
            transition: 'all 0.25s ease',
            flex: '1 1 300px'
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

          <div style={{ fontWeight: '700', color: '#999', fontSize: '0.9rem', flexShrink: 0, padding: '0 5px' }}>OR</div>

          {/* Pincode Search */}
          <div className="search-bar-wrapper" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#fff', border: '1px solid #e8e8e8',
            borderRadius: '50px', padding: '0.7rem 1.25rem',
            boxShadow: '0 4px 20px rgba(128,0,0,0.07)',
            transition: 'all 0.25s ease',
            flex: '0 1 200px'
          }}>
            <MapPin size={18} color={THEME_COLOR} style={{ flexShrink: 0, opacity: 0.75 }} />
            <input
              type="text"
              placeholder="Enter PIN Code…"
              value={pincodeQuery}
              onChange={(e) => { setPincodeQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              style={{
                border: 'none', outline: 'none', width: '100%',
                fontSize: '0.95rem', fontFamily: 'var(--font-body)',
                color: '#333', background: 'transparent',
              }}
            />
            {pincodeQuery && (
              <button
                onClick={() => { setPincodeQuery(''); setShowSuggestions(false); }}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#aaa', fontSize: '1.1rem', lineHeight: 1, padding: '0 2px' }}
              >×</button>
            )}
          </div>
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && (searchQuery || pincodeQuery) && (
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
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>No zones found for your search.</p>
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
