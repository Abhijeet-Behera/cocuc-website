export const metadata = {
  title: "Women's Fellowship | Church of Christ Union Church Bhubaneswar",
  description:
    "Learn about our Mahila Sabha (Women\u2019s Fellowship) \u2014 a prayerful ministry dedicated to the spiritual growth, fellowship, and service of the women of the Church of Christ (Union Church), Bhubaneswar.",
}

export default function WomensFellowshipPage() {
  const committee = [
    { name: 'Mrs. Manaharoni Muduli', role: 'President' },
    { name: 'Mrs. Minakhi Rout', role: 'Vice President' },
    { name: 'Mrs. Tarangini Pradhan', role: 'Secretary' },
    { name: 'Mrs. Itishree Das', role: 'Joint Secretary' },
    { name: 'Mrs. Elizabeth Moharana', role: 'Treasurer' },
  ]

  const services = [
    'Devotional songs and worship',
    'Sharing of God\u2019s Word',
    'Testimonies and prayers',
    'Intercessory prayer for the Church, families, and the community',
    'Fellowship and spiritual encouragement among women',
    "Women\u2019s Retreats and Mahila Divas celebrations",
    'Christmas celebrations and special programmes',
    'Visiting and praying for the sick and those in need',
    'Encouraging women to grow spiritually and actively participate in the life and ministry of the Church',
  ]

  const satelliteCentres = [
    { location: 'Sundarpada', coordinator: 'Mrs. Sasmita Pradhan' },
    { location: 'Kalinga Vihar', coordinator: 'Mrs. Reena Samal' },
    { location: 'Chandrasekharpur', coordinator: 'Mrs. Pratima Tandi' },
  ]

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section
        style={{
          background:
            'linear-gradient(135deg, var(--color-primary-dark) 0%, #4a0000 60%, #1a0000 100%)',
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
            Women&rsquo;s Fellowship
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
            Mahila Sabha &mdash; nurturing women in their walk with Christ through prayer, fellowship, and service.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Meeting Info Banner */}
          <div
            style={{
              background:
                'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
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
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Meeting Day</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Saturday</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Time</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>4:30 PM</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Venue</p>
              <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>Amenity Hall (Ground Floor), Union Church</p>
            </div>
          </div>

          {/* Winter Note */}
          <div
            style={{
              background: 'rgba(128,0,0,0.04)',
              border: '1px solid rgba(128,0,0,0.12)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.5rem',
              color: 'var(--color-primary-dark)',
              fontSize: '0.95rem',
              fontWeight: 500,
              marginBottom: '3rem',
            }}
          >
            ⏰ <strong>Winter Season Notice:</strong> The fellowship is preponed to <strong>4:00 PM</strong> during the winter season.
          </div>

          {/* About Section */}
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
              The <strong style={{ color: 'var(--color-text)' }}>Mahila Sabha (Women&rsquo;s Fellowship)</strong> of the Church of Christ (Union Church), Bhubaneswar, is a prayerful ministry dedicated to the spiritual growth, fellowship, and service of the women of the Church.
            </p>
            <p>
              Recognising that mothers and women are the backbone of every family and play a significant role in strengthening the Church through prayer and service, the Mahila Sabha seeks to nurture women in their walk with Christ and encourage them to become faithful disciples and servants of God.
            </p>
            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              Please keep our Mahila Samiti (Women&rsquo;s Fellowship) in your prayers always.
            </div>
          </div>

          {/* Services & Activities */}
          <h2
            style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              marginBottom: '1.5rem',
            }}
          >
            Services &amp; Activities
          </h2>
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: '2rem 2.5rem',
              border: '1px solid rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
              marginBottom: '3.5rem',
            }}
          >
            {services.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.9rem',
                  color: 'var(--color-text-muted)',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    marginTop: '0.55rem',
                    flexShrink: 0,
                  }}
                />
                <span>{s}</span>
              </div>
            ))}
          </div>

          {/* Office Bearers */}
          <h2
            style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              marginBottom: '0.5rem',
            }}
          >
            Mahila Samiti Office Bearers (2023–2026)
          </h2>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-text-muted)',
              marginBottom: '1.5rem',
            }}
          >
            Elected on <strong>6th September 2023</strong>
          </p>

          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
              marginBottom: '3.5rem',
            }}
          >
            {committee.map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem 2rem',
                  borderBottom:
                    i < committee.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(128,0,0,0.015)',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{c.name}</span>
                <span
                  style={{
                    padding: '0.2rem 0.75rem',
                    borderRadius: '50px',
                    background: 'rgba(128,0,0,0.08)',
                    color: 'var(--color-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {c.role}
                </span>
              </div>
            ))}
          </div>

          {/* Satellite Fellowship Centres */}
          <h2
            style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              marginBottom: '1rem',
            }}
          >
            Satellite Fellowship Centres
          </h2>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.75,
              marginBottom: '1.5rem',
            }}
          >
            To ensure that every woman can actively participate in fellowship, prayer, and spiritual growth without being hindered by distance and travel time, the Mahila Sabha conducts fellowship meetings in three satellite churches at <strong style={{ color: 'var(--color-text)' }}>4:30 PM on every 1st, 2nd, 4th and 5th Saturday</strong>.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2.5rem',
            }}
          >
            {satelliteCentres.map((c, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--color-white)',
                  border: '1px solid rgba(128,0,0,0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem 1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <p
                  style={{
                    fontWeight: 700,
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.4rem',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {c.location} Women&rsquo;s Fellowship
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Coordinator:</span> {c.coordinator}
                </p>
              </div>
            ))}
          </div>

          {/* 3rd Saturday Combined Meeting */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(128,0,0,0.05) 0%, rgba(128,0,0,0.02) 100%)',
              border: '1px solid rgba(128,0,0,0.12)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 2.5rem',
              marginBottom: '1rem',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}
            >
              Combined Monthly Gathering
            </p>
            <p
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-primary-dark)',
                marginBottom: '0.75rem',
              }}
            >
              3rd Saturday Bible Study &mdash; Amenity Hall, Union Church
            </p>
            <p style={{ fontSize: '0.97rem', color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
              On the third Saturday of every month, all women from the main Church and the three satellite fellowships — Sundarpada, Kalinga Vihar, and Chandrasekharpur — gather together at the Amenity Hall (Ground Floor), Church of Christ (Union Church), Bhubaneswar, for a special Bible Study session. These sessions are conducted by our Pastors or Guest speakers, promoting unity, learning, and spiritual enrichment in Christ.
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
