export const metadata = {
  title: 'Sundarpada Worship Center | Church of Christ Union Church Bhubaneswar',
  description: 'Odia Worship Service held every Sunday morning at 9:30 AM in Sundarpada, Bhubaneswar.',
}

export default function SundarpadaPage() {
  const leaders = [
    { name: 'Bro. Ranjit Singh', role: 'Evangelist in Charge' },
    { name: 'Bro. Samuel Nayak', role: 'Worship Center Team Member' },
    { name: 'Bro. Jashobant Nag', role: 'Worship Center Team Member' },
    { name: 'Bro. Biswajit Mohanty', role: 'Caretaker (appointed Feb 2018)' },
    { name: 'Bro. Mosa Kumar', role: 'Caretaker (appointed Feb 2018)' }
  ]

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, #4a0000 60%, #1a0000 100%)',
          color: 'var(--color-white)',
          padding: '160px 0 110px 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '28rem',
            opacity: 0.04,
            fontWeight: 900,
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
            fontFamily: 'serif',
          }}
        >
          ✝
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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
            Satellite Churches
          </p>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              marginBottom: '1.2rem',
              letterSpacing: '-0.02em',
            }}
          >
            Sundarpada Worship Center
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
            Our third worship center, established on 26th February 2017.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
          
          {/* Quick Schedule Banner */}
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
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Worship Timing</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Sunday @ 9:30 AM</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Established</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>26th February, 2017</p>
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
              We are extremely happy to inform you that the Lord has enabled us to start a third worship centre at Sundarpada. The Worship is held <strong style={{ color: 'var(--color-text)' }}>every Sunday at 9:30 AM</strong> at Sundarpada.
            </p>

            <p>
              Both of our Pastors and other leaders share God&rsquo;s Word along with other guest speakers. Being the 3rd worship center in the city, we have the Lord&rsquo;s Supper on the <strong style={{ color: 'var(--color-text)' }}>4th Sunday of the month</strong>.
            </p>

            <p>
              Please pray that the Lord may use this new Worship center for His glory alone and let many people come to know Christ. All glory and majesty belongs to Him!
            </p>

            {/* Warning / Note Alert */}
            <div
              style={{
                background: 'rgba(128,0,0,0.04)',
                border: '1px solid rgba(128,0,0,0.1)',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-primary-dark)',
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              ⚠️ <strong>Kindly Note:</strong> On Christmas and Good Friday, there is no Service in the Sundarpada Worship center as the Special Service is held only in the main Church of Christ (Union Church).
            </div>
          </div>

          {/* Leaders Grid */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              marginBottom: '1.5rem',
            }}
          >
            Worship Center Leadership
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {leaders.map((l, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--color-white)',
                  border: '1px solid rgba(128,0,0,0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem 1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <p style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.4rem', fontSize: '1rem' }}>{l.name}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>{l.role}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
