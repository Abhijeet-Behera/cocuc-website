export const metadata = {
  title: 'Morning Prayer | Church of Christ Union Church Bhubaneswar',
  description: 'Join us for morning prayer every Monday through Saturday from 7:00 AM to 8:00 AM at Union Church.',
}

export default function MorningPrayerPage() {
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
            Morning Prayer
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
            Starting each day with prayer and seeking God’s guidance.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
          
          {/* Timing Banner */}
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
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Prayer Timing</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Monday – Saturday @ 7:00 AM – 8:00 AM</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Convenor</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Rev. B.N. Satpathy</p>
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
            }}
          >
            <p>
              Every morning, from Monday through Saturday, there is Morning Prayer in our Church from <strong style={{ color: 'var(--color-text)' }}>7:00 AM to 8:00 AM</strong>. Only on Sundays, there is no morning prayer.
            </p>

            <p>
              A faithful group of worshippers gathers daily to pray for personal and collective needs, as well as for our State and the Nation. Even Jesus set an example for us as He used to pray early in the morning to His Father in Heaven.
            </p>

            <p>
              As a Church, we place the utmost importance on prayer in these days. To face trials and challenges in the future, we need power from above, and that power can only be received when we are on our knees.
            </p>

            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
                fontSize: '1.15rem',
                fontWeight: 500,
              }}
            >
              &ldquo;He who kneels the most, stands the best.&rdquo; — D.L. Moody
            </div>

            <p>
              We encourage you as a congregation to make yourself available for this Morning Prayer whenever it is convenient. <strong style={{ color: 'var(--color-text)' }}>Rev. B.N. Satpathy</strong> is the convenor of this prayer group. Both of our pastors, deacons, and other members of the Church share God&rsquo;s Word during this prayer time. Those who come regularly are thoroughly blessed.
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
