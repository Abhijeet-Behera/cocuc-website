export const metadata = {
  title: 'Counselling Ministry | Church of Christ Union Church Bhubaneswar',
  description: 'Our Church provides supportive counselling services led by our Associate Pastors and dedicated evangelists to guide you through life’s challenges.',
}

export default function CounsellingPage() {
  const counselors = [
    { name: 'Rev. Ayub Chhinchani', role: 'Associate Pastor (Resident on Campus)' },
    { name: 'Rev. B.N. Satpathy', role: 'Associate Pastor (Resident on Campus)' },
    { name: 'Bro. Sandeep Giri', role: 'Full-time Evangelist & Counselor' },
    { name: 'Bro. Pratap Sahoo', role: 'Full-time Evangelist & Counselor' },
    { name: 'Bro. Ranjit Singh', role: 'Full-time Evangelist & Counselor' }
  ]

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, #3a0000 60%, #110000 100%)',
          color: 'var(--color-white)',
          padding: '160px 0 110px 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20rem',
              height: '30rem',
              opacity: 0.04,
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: -1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              viewBox="0 0 24 36"
              style={{
                width: '100%',
                height: '100%',
                fill: 'currentColor',
              }}
            >
              <path d="M 9,0 H 15 V 9 H 24 V 15 H 15 V 36 H 9 V 15 H 0 V 9 H 9 Z" />
            </svg>
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              opacity: 0.7,
              marginBottom: '1rem',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Activities
          </p>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              marginBottom: '1.2rem',
              letterSpacing: '-0.02em',
            }}
          >
            Counselling Ministry
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              opacity: 0.85,
              maxWidth: '580px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Providing guidance, comfort, and biblical truth to those in need of counseling.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
          
          {/* Counselling Center Timing */}
          <div
            style={{
              background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
              color: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 2rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.5rem',
              marginBottom: '3rem',
              boxShadow: '0 8px 24px rgba(128,0,0,0.2)',
            }}
          >
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Counselling Center Schedule</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Wednesday @ 6:00 PM onwards</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Eligibility</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Open to anyone, any age group</p>
            </div>
          </div>

          {/* Main Description */}
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              border: '1px solid rgba(0,0,0,0.05)',
              fontSize: '1.05rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.85,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              marginBottom: '3.5rem',
            }}
          >
            <p>
              The Holy Spirit is the best Counselor, we all know. But we also have to do our part as believers. Our calling is to witness for the Lord and support those who are seeking the truth, bringing light and answers to a dark and morbid world.
            </p>

            <p>
              Our Church provides Counselling to those who need it. Both of our Associate Pastors reside on the church campus and are readily available. In addition to our pastors, we have three full-time evangelists – <strong style={{ color: 'var(--color-text)' }}>Bro. Sandeep Giri</strong>, <strong style={{ color: 'var(--color-text)' }}>Bro. Pratap Sahoo</strong>, and <strong style={{ color: 'var(--color-text)' }}>Bro. Ranjit Singh</strong>. Along with them, we have other dedicated individuals in our congregation who share a deep passion and burden for the lost and are involved in active counselling.
            </p>

            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              If there are others in the congregation who want to help in the counselling ministry, please feel free to speak with either of the Associate Pastors or the Church Secretary. Be a blessing to others.
            </div>

            <p>
              A dedicated <strong style={{ color: 'var(--color-text)' }}>Counselling Center</strong> has been functioning in our church since Wednesday, 24th August 2018. Any person, belonging to any age group, can consult our counselors in the church from <strong style={{ color: 'var(--color-text)' }}>6:00 PM onwards every Wednesday</strong>.
            </p>
          </div>

          {/* Counselors Grid */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}
          >
            Our Counseling &amp; Pastoral Support Team
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {counselors.map((c, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--color-white)',
                  border: '1px solid rgba(128,0,0,0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem 1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.4rem', fontSize: '1rem' }}>{c.name}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>{c.role}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
