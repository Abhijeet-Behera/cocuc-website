export const metadata = {
  title: 'Monday Prayer | Church of Christ Union Church Bhubaneswar',
  description: 'Join us for our weekly corporate prayer meeting every Monday at 7:00 PM, featuring worship, prayer, Bible study on Revelation, and testimonies.',
}

export default function MondayPrayerPage() {
  const scheduleDetails = [
    { week: '1st Week', content: 'Worship, Meditation & Corporate Prayer' },
    { week: '2nd Week', content: 'Bible Study led by Rev. B.N. Satpathy (Series on the Book of Revelation)' },
    { week: '3rd Week', content: 'Bible Study led by Rev. B.N. Satpathy (Series on the Book of Revelation)' },
    { week: '4th Week', content: 'Testimony Time — Giving thanks to God for His everlasting Grace' }
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
            Monday Prayer
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
            Weekly corporate prayer and Bible study at the feet of the Lord.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
          
          {/* Schedule Summary */}
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
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Monday @ 7:00 PM</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Type</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Weekly Corporate Prayer Evening</p>
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
              The Church conducts a weekly prayer meeting <strong style={{ color: 'var(--color-text)' }}>every Monday at 7:00 PM</strong>. This dedicated time is spent in worship through songs, meditation, and prayer. It is conducted by our Associate Pastors, Deacons, or invited leaders.
            </p>

            <p>
              It is a wonderful opportunity to sit at the feet of the Lord in the presence of fellow believers and pray together. The Church Board has earmarked Monday Prayer as our weekly corporate prayer evening.
            </p>

            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              Unless a Church prays, we cannot see lives being changed; we cannot fulfill the Great Commission which the Lord has given to His people. Do come and join us as we pray in faith on various issues.
            </div>
          </div>

          {/* Week wise breakdown */}
          <h2
            style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              marginBottom: '1.5rem',
            }}
          >
            Monthly Program Schedule
          </h2>

          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
              marginBottom: '2rem'
            }}
          >
            {scheduleDetails.map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1.25rem 2rem',
                  borderBottom: idx < scheduleDetails.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: idx % 2 === 0 ? 'transparent' : 'rgba(128,0,0,0.015)',
                }}
              >
                <span
                  style={{
                    width: '100px',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    flexShrink: 0
                  }}
                >
                  {s.week}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{s.content}</span>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
