export const metadata = {
  title: 'Thursday Cottage Prayer | Church of Christ Union Church Bhubaneswar',
  description: 'Learn about our 14 different prayer zones across Bhubaneswar and join our cottage prayer meetings every Thursday evening at 7:00 PM.',
}

export default function ThursdayCottagePrayerPage() {
  const worshipPattern = [
    { duration: '15 Minutes', activity: 'Praise & Worship', desc: 'Starting the evening with praises and worship through songs.' },
    { duration: '20 Minutes', activity: 'Word of God', desc: 'Meditating on God’s Holy Word shared by invited speakers.' },
    { duration: '20–25 Minutes', activity: 'Devoted to Prayer', desc: 'Offering prayers for local fellowship, families, and various needs.' }
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
            Prayer Time
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
            Thursday Cottage Prayer
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
            Gathering in families across 14 zones for local fellowship and prayer.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
          
          {/* Quick Stats banner */}
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
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Prayer Day &amp; Time</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Thursday @ 7:00 PM</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Prayer Zones</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>14 Zones City-Wide</p>
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
              Church of Christ (Union Church) is divided into <strong style={{ color: 'var(--color-text)' }}>14 different prayer zones</strong> spreading across the city of Bhubaneswar. These prayer zones are managed by dedicated Area Prayer Coordinators in their respective localities.
            </p>

            <p>
              Every <strong style={{ color: 'var(--color-text)' }}>Thursday evening at 7:00 PM</strong>, cottage prayer meetings are hosted by different families in their respective zones. It is a wonderful time of fellowship among believers living in a particular area, bringing people closer to support and encourage one another.
            </p>

            <p>
              During these meetings, we have times of worship, sharing testimonies, meditating on God&rsquo;s Word, and offering prayers for various needs. Speakers are invited by the Prayer Coordinators in advance as they plan out the schedule for every 3 to 6 months.
            </p>

            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              Please get in touch with your respective zone Coordinator and kindly make it convenient to attend these weekly prayer meetings whenever possible.
            </div>
          </div>

          {/* Worship Pattern */}
          <h2
            style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}
          >
            Typical Worship Pattern
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {worshipPattern.map((p, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--color-white)',
                  border: '1px solid rgba(128,0,0,0.1)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem 1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.2rem 0.75rem',
                    background: 'rgba(128,0,0,0.08)',
                    color: 'var(--color-primary)',
                    borderRadius: '50px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    marginBottom: '0.75rem',
                  }}
                >
                  {p.duration}
                </span>
                <p style={{ fontWeight: 800, color: 'var(--color-text)', fontSize: '1.15rem', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                  {p.activity}
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
