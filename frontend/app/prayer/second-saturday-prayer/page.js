export const metadata = {
  title: 'Second Saturday Chain Prayer | Church of Christ Union Church Bhubaneswar',
  description: 'Join us for our monthly Chain and Fasting Prayer held every second Saturday from 7:00 AM to 12:00 PM at Union Church.',
}

export default function SecondSaturdayPrayerPage() {
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
            Second Saturday Chain Prayer
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
            Continuing steadfastly in prayer, joining hands to pray for salvation and healing.
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
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every 2nd Saturday @ 7:00 AM – 12:00 PM</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Prayer Type</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Fasting / Chain Prayer</p>
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
              There is a monthly Chain Prayer held in the Church for worshippers to come and spend time at the feet of the Lord Jesus. We pray for various needs, local concerns, and global situations, and God faithfully answers our prayers. It is a special time of fellowship with the Lord.
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
              Never forget: a believer on their knees has more power on their little index finger than all the powers of hell. Today, Churches need to be on their knees if they want the lost saved!
            </div>

            <p>
              Prayer, and only prayer, brings the spiritual power necessary to accomplish what God desires — to win souls for JESUS.
            </p>

            <p>
              In <strong style={{ color: 'var(--color-text)' }}>Acts 2:42</strong>, we see the secret of the early Church: <em>&ldquo;And they continued steadfastly in the apostles&rsquo; doctrine and fellowship, and in breaking of bread, and in prayer.&rdquo;</em> It&rsquo;s not just about praying; it&rsquo;s about continuing steadfastly in prayer.
            </p>

            <p>
              Come every second Saturday and let us join hands to pray for the needs of the people, and pray for the salvation of those who do not yet know the Lord Jesus.
            </p>

            <p>
              Our Associate Pastor, <strong style={{ color: 'var(--color-text)' }}>Rev. B.N. Satpathy</strong>, is the Convenor of the Prayer Committee and schedules slots for the various prayer groups. Since April 2017, the Church Board decided to host a Fasting/Chain Prayer from <strong style={{ color: 'var(--color-text)' }}>7:00 AM till 12:00 PM</strong>. Do join us when you are free. Pray and be blessed!
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
