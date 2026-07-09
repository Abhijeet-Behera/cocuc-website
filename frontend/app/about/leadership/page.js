"use client";

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

const DEACONS_DATA = [
  { id: 101, name: "Mr. Asish Baran Parida", role: "Elder", category: "Elder", gender: "male", image: "/images/leadership/asish_baran_parida.png" },
  { id: 102, name: "Mr. Biren Kumar Pradhan", role: "Elder", category: "Elder", gender: "male", image: "/images/leadership/biren_kumar_pradhan.png" },
  { id: 103, name: "Mr. Pradip Kumar Roul", role: "Elder", category: "Elder", gender: "male", image: "/images/leadership/pradip_kumar_roul.png" },
  { id: 104, name: "Mr. Sarat Kumar Singh", role: "Elder", category: "Elder", gender: "male", image: "/images/leadership/sarat_kumar_singh.png" },
  { id: 105, name: "Mr. Sishir Baran Puri", role: "Elder", category: "Elder", gender: "male", image: "/images/leadership/sishir_baran_puri.png" },
  { id: 1, name: "Mr. Michael Rajesh Behera", role: "Secretary", category: "Secretary", gender: "male", image: "/images/leadership/michael_rajesh_behera.png" },
  { id: 2, name: "Mr. Smruti Ranjan Nayak", role: "Joint secretary", category: "Office Bearers", gender: "male", image: "/images/leadership/smruti_ranjan_nayak.png" },
  { id: 3, name: "Mr. Suranjan Thomas", role: "Treasurer", category: "Office Bearers", gender: "male", image: "/images/leadership/suranjan_thomas.png" },
  { id: 4, name: "Mr. Adit Jena", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/adit_jena.png" },
  { id: 5, name: "Mr. Amrut Kumar Jena", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/amrut_kumar_jena.png" },
  { id: 6, name: "Mr. Benjamin Peter", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/benjamin_peter.png" },
  { id: 7, name: "Mr. Bipra Charan Digal", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/bipra_charan_digal.png" },
  { id: 8, name: "Mr. Gokula Chandra Pradhan", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/gokula_chandra_pradhan.png" },
  { id: 9, name: "Mr. Manas Ranjan Behera", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/manas_ranjan_behera.png" },
  { id: 10, name: "Mr. Prafulla Kumar Dash", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/prafulla_kumar_dash.png" },
  { id: 11, name: "Mr. Pravat Kumar Chand", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/pravat_chand.png" },
  { id: 12, name: "Mr. Rajsekhar Sahu", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/rajsekhar_sahu.png" },
  { id: 13, name: "Mr. Ranjan Gan", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/ranjan_gan.png" },
  { id: 14, name: "Mr. Santosh Kumar Nayak", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/santosh_kumar_nayak.png" },
  { id: 15, name: "Mr. Satya Ranjan Singh", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/satya_ranjan_singh.png" },
  { id: 16, name: "Mr. Sudhir Kumar Swain", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/sudhir_kumar_swain.png" },
  { id: 17, name: "Ms. Swarnamayee Patra", role: "Deaconess", category: "Deaconess", gender: "female", image: "/images/leadership/swarnamayee_patra.png" },
  { id: 18, name: "Ms. Madhuleeta Samantaray", role: "Deaconess", category: "Deaconess", gender: "female", image: "/images/leadership/madhuleeta_samantaray.png" }
];

const CATEGORIES = ["All", "Secretary", "Office Bearers", "Elders", "Deacons & Deaconesses"];

export default function LeadershipPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const sectionsToRender = useMemo(() => {
    // First, filter by search query
    const searched = DEACONS_DATA.filter((deacon) => {
      return (
        deacon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deacon.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    const configs = [
      { key: "Secretary", title: "Secretary", filterKey: "Secretary", categories: ["Secretary"] },
      { key: "Office Bearers", title: "Office Bearers", filterKey: "Office Bearers", categories: ["Office Bearers"] },
      { key: "Elder", title: "Elders", filterKey: "Elders", categories: ["Elder"] },
      { key: "Deacons & Deaconesses", title: "Deacons & Deaconesses", filterKey: "Deacons & Deaconesses", categories: ["Deacon", "Deaconess"] }
    ];

    return configs
      .map((config) => {
        const members = searched.filter((d) => config.categories.includes(d.category));
        return { ...config, members };
      })
      .filter((section) => {
        if (activeCategory !== "All" && activeCategory !== section.filterKey) {
          return false;
        }
        return section.members.length > 0;
      });
  }, [searchQuery, activeCategory]);

  return (
    <div>
      <PageHeader
        category="About"
        title="Leadership Team"
        description="Meet the dedicated individuals serving our congregation."
      />

      {/* Main Content Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          
          {/* Pastoral Team */}
          <div style={{ marginBottom: '6rem' }}>
            <h2 className="section-title-elegant" style={{ marginBottom: '3rem' }}>
              <span className="title-normal">Pastoral </span>
              <em className="title-italic">Team</em>
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
              {[
                { name: "Rev. Dr. Ayub Chhinchani", role: "Pastor", phone: "9437418423", image: "/images/pastors-note/pastors-note-01.jpg" },
                { name: "Rev. Songram Keshari Singh", role: "Pastor", phone: "9437284415", image: "/images/pastors-note/pastors-note-02.jpg" },
                { name: "Rev. Satish Kumar Pani", role: "Pastor", phone: "9438518776", image: "/images/pastors-note/pastors-note-03.jpg" }
              ].map((pastor, index) => (
                <div key={index} className="card" style={{ backgroundColor: 'var(--color-white)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ height: '260px', overflow: 'hidden', position: 'relative', backgroundColor: '#e2e8f0' }}>
                    <img 
                      src={pastor.image} 
                      alt={pastor.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                    />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', padding: '0.35rem 0.85rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {pastor.role}
                    </div>
                  </div>
                  <div style={{ padding: '1.75rem', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--color-text)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>{pastor.name}</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <span>📞</span> <a href={`tel:+91${pastor.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{pastor.phone}</a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Church Board (Deacons) */}
          <div style={{ marginBottom: '6rem' }}>
            <div className="deacon-badge-container">
              <span className="deacon-badge">Church Board (2026-29)</span>
            </div>

            <h2 className="section-title-elegant" style={{ marginBottom: '1rem' }}>
              <span className="title-normal">Meet the </span>
              <em className="title-italic">leadership team</em>
            </h2>
            
            <p className="deacon-section-desc">
              The selection was held on 21st & 23rd January, 2026, by the five-member Supervisory Committee of the Church.
            </p>

            {/* Interactive Filters Panel */}
            <div className="deacon-search-wrapper">
              <input 
                type="text" 
                placeholder="Search deacons by name or designation..." 
                className="deacon-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="deacon-search-icon" size={18} />
            </div>

            <div className="deacon-filters">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`deacon-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Deacon Cards Grid grouped by section */}
            <div>
              {sectionsToRender.length > 0 ? (
                sectionsToRender.map((section) => (
                  <div key={section.key} style={{ marginBottom: '3.5rem' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      marginBottom: '1.5rem',
                      marginTop: '3rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      borderBottom: '1px solid rgba(0,0,0,0.06)',
                      paddingBottom: '0.5rem'
                    }}>
                      <span>{section.title}</span>
                      <span style={{
                        fontSize: '0.85rem',
                        background: 'rgba(128, 0, 0, 0.08)',
                        color: 'var(--color-primary)',
                        padding: '2px 10px',
                        borderRadius: '20px',
                        fontWeight: 600
                      }}>
                        {section.members.length}
                      </span>
                    </h3>

                    <div className="deacon-grid">
                      {section.members.map((deacon) => {
                        const imageSrc = deacon.image || (deacon.gender === 'female' 
                          ? '/images/deacon-female-placeholder.png' 
                          : '/images/deacon-male-placeholder.png');
                        
                        return (
                          <div key={deacon.id} className="deacon-card">
                            {deacon.category === 'Elder' && (
                              <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-white)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '50px',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                zIndex: 2,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                              }}>
                                Elder
                              </div>
                            )}

                            <div className="deacon-img-container">
                              <img 
                                src={imageSrc} 
                                alt={deacon.name} 
                                className="deacon-img"
                              />
                            </div>
                            
                            <div className="deacon-info-overlay">
                              <span className="deacon-name">{deacon.name}</span>
                              <span className="deacon-role">{deacon.role}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="deacon-no-results">
                  <h3>No members found</h3>
                  <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>Try adjusting your search query or switching filters.</p>
                </div>
              )}
            </div>

            {/* Stand-by Members */}
            <div style={{ marginTop: '4.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '3rem', textAlign: 'center' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1.5rem' }}>
                Stand-by Members
              </h4>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                {[
                  { name: "Mr. Samir Kumar Patro" },
                  { name: "Prof. Anup Kumar Samantaray" },
                  { name: "Ms. Madhusmita Rout", }
                ].map((member, index) => (
                  <div key={index} style={{ background: 'var(--color-white)', padding: '0.85rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 6px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-primary-light)' }}></div>
                    <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{member.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: '20px', fontWeight: 500 }}>{member.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Evangelists Section */}
          <div style={{ marginBottom: '3.5rem', marginTop: '5rem' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              paddingBottom: '0.5rem'
            }}>
              <span>Evangelists</span>
              <span style={{
                fontSize: '0.85rem',
                background: 'rgba(128, 0, 0, 0.08)',
                color: 'var(--color-primary)',
                padding: '2px 10px',
                borderRadius: '20px',
                fontWeight: 600
              }}>
                2
              </span>
            </h3>

            <div className="deacon-grid">
              {[
                { name: "Evg. Pratap Kumar Sahoo", role: "Evangelist" },
                { name: "Evg. Ranjit Singh", role: "Evangelist" },
                // { name: "Evg. Gobinda Sahoo", role: "Evangelist" },
                // { name: "Evg. Sujit Bishoi", role: "Evangelist" },
                // { name: "Evg. Christopher Surya", role: "Evangelist" }
              ].map((evg, idx) => {
                const imageSrc = '/images/deacon-male-placeholder.png';
                return (
                  <div key={idx} className="deacon-card">
                    <div className="deacon-img-container">
                      <img 
                        src={imageSrc} 
                        alt={evg.name} 
                        className="deacon-img"
                      />
                    </div>
                    <div className="deacon-info-overlay">
                      <span className="deacon-name">{evg.name}</span>
                      <span className="deacon-role">{evg.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Support Staff Section */}
          <div style={{ marginBottom: '3.5rem' }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              paddingBottom: '0.5rem'
            }}>
              <span>Support Staff</span>
              <span style={{
                fontSize: '0.85rem',
                background: 'rgba(128, 0, 0, 0.08)',
                color: 'var(--color-primary)',
                padding: '2px 10px',
                borderRadius: '20px',
                fontWeight: 600
              }}>
                2
              </span>
            </h3>

            <div className="deacon-grid">
              {[
                { name: "Mr. Sobhajan Pradhan", role: "Caretaker" },
                { name: "Mr. Krushna Chandra Digal", role: "Assistant Caretaker" }
              ].map((staff, idx) => {
                const imageSrc = '/images/deacon-male-placeholder.png';
                return (
                  <div key={idx} className="deacon-card">
                    <div className="deacon-img-container">
                      <img 
                        src={imageSrc} 
                        alt={staff.name} 
                        className="deacon-img"
                      />
                    </div>
                    <div className="deacon-info-overlay">
                      <span className="deacon-name">{staff.name}</span>
                      <span className="deacon-role">{staff.role}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
