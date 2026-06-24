export const metadata = {
  title: 'Kalinga Vihar Worship Center | Church of Christ Union Church Bhubaneswar',
  description: 'Odia Worship Service held every Sunday morning at 9:30 AM in Kalinga Vihar, Bhubaneswar.',
}

export default function KalingaViharPage() {

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
            Kalinga Vihar Worship Center
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
            A growing congregation in Kalinga Vihar, established in July 2015.
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
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>12th July, 2015</p>
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
              We have an Odia Worship Service held here <strong style={{ color: 'var(--color-text)' }}>every Sunday morning at 9:30 AM</strong>. This worship center was started in <strong style={{ color: 'var(--color-text)' }}>HIG-219, K5, Kalinga Vihar</strong> on 12th July, 2015.
            </p>

            <p>
              The Church has been growing numerically with every passing day. We had a wonderful congregation and continued worship there till April 2017. In May 2017, the center shifted to a new house in the same area and has been worshiping there since then.
            </p>

            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              The Lord&rsquo;s Supper is served every 3rd Sunday of the month. It is given by either of our Pastors.
            </div>

            <p>
              Besides the Pastors and Deacons, preachers from within and outside the city are invited to speak in the different Worship Services. Guest speakers are also invited to preach on special occasions.
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
              ⚠️ <strong>Kindly Note:</strong> On Christmas and Good Friday, there is no Service in the Kalinga Vihar Worship center as the Special Service is held only in the main Church of Christ (Union Church).
            </div>
          </div>



        </div>
      </section>
    </div>
  )
}
