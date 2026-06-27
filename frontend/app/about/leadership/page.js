"use client";

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

const DEACONS_DATA = [
  { id: 101, name: "Mr. Asish Baran Parida", role: "Elder", category: "Elder", gender: "male", image: "/images/leadership/asish_baran_parida.jpg" },
  { id: 102, name: "Mr. Biren Kumar Pradhan", role: "Elder", category: "Elder", gender: "male", image: "/images/leadership/biren_kumar_pradhan.png" },
  { id: 103, name: "Mr. Pradip Kumar Roul", role: "Elder", category: "Elder", gender: "male", image: "/images/leadership/pradip_kumar_roul.png" },
  { id: 104, name: "Mr. Sarat Kumar Singh", role: "Elder", category: "Elder", gender: "male", image: "/images/leadership/sarat_kumar_singh.png" },
  { id: 105, name: "Mr. Sishir Baran Puri", role: "Elder", category: "Elder", gender: "male", image: "/images/leadership/sishir_baran_puri.jpg" },
  { id: 1, name: "Mr. Michael Rajesh Behera", role: "Secretary", category: "Incharge", gender: "male", image: "/images/leadership/michael_rajesh_behera.png" },
  { id: 2, name: "Mr. Smruti Ranjan Nayak", role: "Joint secretary", category: "Incharge", gender: "male", image: "/images/leadership/smruti_ranjan_nayak.png" },
  { id: 3, name: "Mr. Suranjan Thomas", role: "Treasurer", category: "Incharge", gender: "male", image: "/images/leadership/suranjan_thomas.png" },
  { id: 4, name: "Mr. Adit Jena", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/adit_jena.png" },
  { id: 5, name: "Mr. Amrut Kumar Jena", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/amrut_kumar_jena.jpg" },
  { id: 6, name: "Mr. Benjamin Peter", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/benjamin_peter.jpg" },
  { id: 7, name: "Mr. Bipra Charan Digal", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/bipra_charan_digal.jpg" },
  { id: 8, name: "Mr. Gokula Chandra Pradhan", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/gokula_chandra_pradhan.png" },
  { id: 9, name: "Mr. Manas Ranjan Behera", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/manas_ranjan_behera.png" },
  { id: 10, name: "Mr. Prafulla Kumar Dash", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/prafulla_kumar_dash.jpg" },
  { id: 11, name: "Mr. Pravat Kumar Chand", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/pravat_chand.png" },
  { id: 12, name: "Mr. Rajsekhar Sahu", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/rajsekhar_sahu.png" },
  { id: 13, name: "Mr. Ranjan Gan", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/ranjan_gan.png" },
  { id: 14, name: "Mr. Santosh Kumar Nayak", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/santosh_kumar_nayak.png" },
  { id: 15, name: "Mr. Satya Ranjan Singh", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/satya_ranjan_singh.jpg" },
  { id: 16, name: "Mr. Sudhir Kumar Swain", role: "Deacon", category: "Deacon", gender: "male", image: "/images/leadership/sudhir_kumar_swain.png" },
  { id: 17, name: "Ms. Swarnamayee Patra", role: "Deaconess", category: "Deaconess", gender: "female", image: "/images/leadership/swarnamayee_patra.jpg" },
  { id: 18, name: "Ms. Madhuleeta Samantaray", role: "Deaconess", category: "Deaconess", gender: "female", image: "/images/leadership/madhuleeta_samantaray.jpg" }
];

const CATEGORIES = ["All", "Elders", "Incharge", "Deacons", "Deaconesses"];

export default function LeadershipPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredDeacons = useMemo(() => {
    return DEACONS_DATA.filter((deacon) => {
      const matchesSearch = 
        deacon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deacon.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      if (activeCategory === "All") return true;
      if (activeCategory === "Elders") return deacon.category === "Elder";
      if (activeCategory === "Incharge") return deacon.category === "Incharge";
      if (activeCategory === "Deacons") return deacon.category === "Deacon";
      if (activeCategory === "Deaconesses") return deacon.category === "Deaconess";
      return true;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div>
      {/* Banner Section */}
      <section style={{ backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-white)', padding: '150px 0 100px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Leadership Team</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto', fontFamily: 'var(--font-body)' }}>
            Meet the dedicated individuals serving our congregation.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          
          {/* Pastoral Team */}
          <div style={{ marginBottom: '6rem' }}>
            <h2 className="section-title-elegant" style={{ marginBottom: '3rem' }}>
              Pastoral <span className="title-italic">Team</span>
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
                      <span>📞</span> {pastor.phone}
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
              Meet the <span className="title-italic">leadership team</span>
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

            {/* Deacon Cards Grid */}
            <div className="deacon-grid">
              {filteredDeacons.length > 0 ? (
                filteredDeacons.map((deacon) => {
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
                })
              ) : (
                <div className="deacon-no-results">
                  <h3>No members found</h3>
                  <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>Try adjusting your search query or switching filters.</p>
                </div>
              )}
            </div>

            {/* Stand-by Members */}
            <div style={{ marginTop: '4.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '3rem', textAlign: 'center' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '1.5rem' }}>
                Stand-by Members
              </h4>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                {[
                  { name: "Mr. Samir Kumar Patro", role: "Stand-by" },
                  { name: "Prof. Anup Kumar Samantaray", role: "Stand-by" },
                  { name: "Ms. Madhusmita Rout", role: "Stand-by Deaconess" }
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

          {/* Sunday School & Mahila Samiti */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginBottom: '6rem' }}>
            {/* Sunday School Card */}
            <div style={{ background: 'var(--color-white)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', borderBottom: '2px solid rgba(128, 0, 0, 0.08)', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                Sunday School
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
                  <strong>Superintendent:</strong>
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(128,0,0,0.03)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(128,0,0,0.05)', fontWeight: 600, color: 'var(--color-primary-dark)', width: 'fit-content' }}>
                  👤 Mr. Asim Das
                </div>
              </div>
            </div>

            {/* Mahila Samiti Card */}
            <div style={{ background: 'var(--color-white)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', borderBottom: '2px solid rgba(128, 0, 0, 0.08)', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                Mahila Samiti (Maa Sabha)
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { label: "President", name: "Mrs. Manoharini Muduli" },
                  { label: "Secretary", name: "Mrs. Tarangini Pradhan" },
                  { label: "Asst. Secretary", name: "Mrs. Itishree Das" },
                  { label: "Treasurer", name: "Mrs. Elizabeth Moharana" }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: 'var(--color-surface)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CE Union */}
          <div style={{ background: 'var(--color-white)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', borderBottom: '2px solid rgba(128, 0, 0, 0.08)', paddingBottom: '0.75rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)', textAlign: 'center', fontWeight: 700 }}>
              Christian Endeavour Union (CE)
            </h2>
            <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
              Newly elected CE board members for the year 2026 to 2028
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {[
                { label: "President", name: "Dr Purnananda Pradhan" },
                { label: "Vice President", name: "Santanu Kumar Rout" },
                { label: "Secretary", name: "Rev Amos Pradhan" },
                { label: "Asst Secy", name: "Samuel K Pradhan" },
                { label: "Treasurer", name: "Benjamin Chouhan" },
                { label: "Lookout Com Secy", name: "Smrutirekha Pradhan" },
                { label: "Lookout Asst Secy", name: "Kalpita Pradhan" },
                { label: "Social Com Secy", name: "Kabita Das" },
                { label: "Social Com Secy", name: "Sudipta Pradhan" },
                { label: "Boithak Secy", name: "John Augustin Nayak" },
                { label: "Programme Com Secy", name: "Sujoy kumar" },
                { label: "Auditor", name: "Ratan Dash" }
              ].map((item, idx) => (
                <div key={idx} style={{ background: 'linear-gradient(135deg, rgba(128,0,0,0.01) 0%, rgba(128,0,0,0.03) 100%)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(128,0,0,0.04)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)' }}>{item.name}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)', textAlign: 'center', fontWeight: 700 }}>CE Union Advisers</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
                {[
                  "Rev Songram K. Singh",
                  "Rev. Dr. Ayub Chhinchani",
                  "Rev. Satish Kumar Pani",
                  "Joachim Manas Ranjan",
                  "Asit Kumar Mohanty",
                  "Asish Das",
                  "Ranjan Kumar Nayak"
                ].map((adviser, idx) => (
                  <span key={idx} style={{ background: 'var(--color-surface)', border: '1px solid rgba(0,0,0,0.05)', padding: '0.5rem 1.25rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>
                    🎓 {adviser}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Evangelists & Support Staff */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {/* Evangelists Card */}
            <div style={{ background: 'var(--color-white)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', borderBottom: '2px solid rgba(128, 0, 0, 0.08)', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                Evangelists
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  "Evg. Pratap Kumar Sahoo",
                  "Evg. Ranjit Singh",
                  "Evg. Gobinda Sahoo",
                  "Evg. Sujit Bishoi",
                  "Evg. Christopher Surya"
                ].map((evg, idx) => (
                  <li key={idx} style={{ padding: '0.75rem 1rem', background: 'var(--color-surface)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.02)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    📖 {evg}
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Staff Card */}
            <div style={{ background: 'var(--color-white)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', borderBottom: '2px solid rgba(128, 0, 0, 0.08)', paddingBottom: '0.75rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                Support Staff
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: "Caretaker", name: "Mr. Sobhajan Pradhan" },
                  { label: "Assistant Caretaker", name: "Mr. Krushna Chandra Digal" }
                ].map((staff, idx) => (
                  <li key={idx} style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(128,0,0,0.01) 0%, rgba(128,0,0,0.03) 100%)', borderRadius: '12px', border: '1px solid rgba(128,0,0,0.04)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>{staff.label}</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)' }}>{staff.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
