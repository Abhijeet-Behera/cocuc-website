export const metadata = {
  title: 'Sunday School | Church of Christ Union Church Bhubaneswar',
  description:
    'Sunday school at Union Church nurtures children in the Word of God every Sunday morning, with classes running across all our worship centres.',
}

export default function SundaySchoolPage() {
  const teachers = [
    { name: 'Mr. Malaya Basanta Das', role: 'Sunday School Superintendent' },
    { name: 'Mr. Fanindra Behera', role: 'Senior Teacher & Mentor' },
    { name: 'Rev. Ayub Chhinchani', role: 'Associate Pastor & Overseer' },
    { name: 'Mr. Ashim Das', role: 'Overseer' },
    { name: 'Mr. Benjamin Peter', role: 'Overseer' },
  ]

  const programs = [
    'Sunday School Summer Camp',
    'Sunday School Annual Retreat',
    'World Sunday School Day',
    'Prize-giving Distribution & Christmas Celebrations (December)',
  ]

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1a0000 0%, var(--color-primary-dark) 50%, #7a2000 100%)',
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
            Sunday School
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
            Rooting our children in the Word of God from their very first years.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Timing banner */}
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
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Session Timing</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>8:00 AM – 9:45 AM</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Schedule</p>
              <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>Every Sunday Morning</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Centres</p>
              <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>Union Church · C.S. Pur · Kalinga Vihar</p>
            </div>
          </div>

          {/* Main text */}
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
              We have Sunday School for the children every Sunday morning before the English Service. The session starts around <strong style={{ color: 'var(--color-text)' }}>8:00 AM</strong> and winds up by <strong style={{ color: 'var(--color-text)' }}>9:30–9:45 AM</strong>. Every Sunday morning, our little children are taught Sunday school lessons and nurtured from the Word of God.
            </p>
            <p>
              Mr. Fanindra Behera has, over the years, been instrumental in shaping the little kids and teaching them valuable lessons of life. Together with our Associate Pastors and dedicated teachers, the Sunday School team ensures every child is cared for and guided in their spiritual journey.
            </p>

            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              &ldquo;Let the little children come to me.&rdquo; — Jesus Christ. Let us always remember these precious children in our daily Prayers.
            </div>

            <p>
              Sunday school teachers give their valuable experience and time in teaching the students. Do send your children to Sunday school every Sunday morning — they will be rooted in the Word of God from childhood, which will hold them in good stead as they grow up.
            </p>
          </div>

          {/* Leadership team */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Sunday School Leadership
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '3rem',
            }}
          >
            {teachers.map((t) => (
              <div
                key={t.name}
                style={{
                  background: 'var(--color-white)',
                  border: '1px solid rgba(128,0,0,0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem 1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <p style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>{t.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>{t.role}</p>
              </div>
            ))}
          </div>

          {/* Annual programs */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Annual Programs for Children
          </h2>
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: '2rem',
              border: '1px solid rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
            }}
          >
            {programs.map((p) => (
              <div
                key={p}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  color: 'var(--color-text-muted)',
                  fontSize: '1rem',
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
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
