export const metadata = {
  title: 'C.E Union | Church of Christ Union Church Bhubaneswar',
  description:
    'The Christian Endeavour Union meets every Tuesday at 7 PM for devotion, prayer, and fellowship. Discover their vibrant programs and annual schedule.',
}

export default function CEUnionPage() {
  const schedule = [
    { date: '26 November 2022', event: 'Annual Sports Day' },
    { date: '27 November 2022', event: 'Symposium — Group B to E' },
    { date: '04 December 2022', event: 'Bible Quiz — Group A to E' },
    { date: '06 December 2022', event: 'Essay — Group B to E' },
    { date: '11 December 2022', event: 'Bible Memory Verse — Group A to E' },
    { date: '18 December 2022', event: 'Devotional Song Competition — All Groups' },
    { date: '20 December 2022', event: 'Disguise Competition & Christmas Annual Prize-giving Ceremony' },
    { date: '1 January 2023', event: 'Musical Night Celebrations' },
  ]

  const competitions = [
    'Sports', 'Symposium', 'Essay', 'Songs', 'Bible Quiz', 'Bible Memory Verse',
  ]

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0a0018 0%, #3d0055 50%, var(--color-primary-dark) 100%)',
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
            C.E Union
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              opacity: 0.85,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            The Christian Endeavour Union — our vibrant youth fellowship serving the Lord every week.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Meeting info banner */}
          <div
            style={{
              background: 'linear-gradient(90deg, #3d0055 0%, var(--color-primary-dark) 100%)',
              color: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 2rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.5rem',
              marginBottom: '3rem',
              boxShadow: '0 8px 24px rgba(61,0,85,0.3)',
            }}
          >
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Meeting Day</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Tuesday</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Time</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>7:00 PM</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Venue</p>
              <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>Union Church</p>
            </div>
          </div>

          {/* Main description */}
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
              marginBottom: '2.5rem',
            }}
          >
            <p>
              The <strong style={{ color: 'var(--color-text)' }}>Christian Endeavour Union (C.E)</strong> meets in the church every <strong style={{ color: 'var(--color-text)' }}>Tuesday at 7 PM</strong>. They have devotional sessions and Prayer, and they invite speakers to preach every week — Pastors, Church leaders, and people from our Church and other places too.
            </p>
            <p>
              These youths are an asset to the Church through their help and support in various activities. During the Christmas season, the C.E. Union organises a range of programs and competitions, where children from all age groups take part very keenly. Besides their local activities, they also hold their annual Conventions and Retreats.
            </p>
            <p>
              On New Year&rsquo;s evening in 2023, they had their cultural Musical Program in the Church. Please do keep C.E. Union in your Prayers as they continue to serve the Lord diligently.
            </p>
          </div>

          {/* Competition categories */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Christmas Program Categories
          </h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '3rem',
            }}
          >
            {competitions.map((c) => (
              <span
                key={c}
                style={{
                  display: 'inline-block',
                  padding: '0.45rem 1.1rem',
                  borderRadius: '50px',
                  background: 'rgba(128,0,0,0.07)',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  border: '1px solid rgba(128,0,0,0.15)',
                }}
              >
                {c}
              </span>
            ))}
          </div>

          {/* 2022-23 Schedule */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            2022–23 Christmas &amp; New Year Schedule
          </h2>
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            {schedule.map((item, i) => (
              <div
                key={item.date}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  padding: '1rem 1.5rem',
                  borderBottom: i < schedule.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(128,0,0,0.018)',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    padding: '0.3rem 0.75rem',
                    borderRadius: '6px',
                    background: 'var(--color-primary)',
                    color: '#fff',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap',
                    marginTop: '0.1rem',
                  }}
                >
                  {item.date}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{item.event}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
