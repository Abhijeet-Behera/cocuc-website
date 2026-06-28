export const metadata = {
  title: 'Sunday School | Church of Christ Union Church Bhubaneswar',
  description:
    'The Sunday School Ministry of the Church of Christ (Union Church), Bhubaneswar — imparting biblical values and Christian teachings to children every Sunday morning.',
}

import PageHeader from '@/components/PageHeader'

export default function SundaySchoolPage() {
  const advisors = [
    { name: 'Rev. Songram Keshari Singh', phone: '9437226415' },
    { name: 'Rev. Dr. Ayub Chinchani', phone: '9437418423' },
    { name: 'Rev. Satish Pani', phone: '9438518776' },
    { name: 'Smt. Ellen Pramanik', phone: '9437519609' },
  ]

  const programs = [
    'Sunday School Annual Picnic',
    'Sunday School Annual Retreat',
    'World Sunday School Day Celebration',
    'Sunday School Prize-Giving Distribution and Christmas Celebrations',
  ]

  const classDistribution = [
    { age: '3–5 years',   sciClass: 'UKG – Class 1',    ssClass: 'Beginner'     },
    { age: '6–9 years',   sciClass: 'Class 2–4',         ssClass: 'Primary'      },
    { age: '10–13 years', ssClass: 'Junior',             sciClass: 'Class 5–7'   },
    { age: '14–16 years', ssClass: 'Intermediate',       sciClass: 'Class 8–9'   },
    { age: '17+ years',   ssClass: 'Senior',             sciClass: 'Class 10 onwards' },
  ]

  return (
    <div>
      <PageHeader
        category="Activities"
        title="Sunday School"
        description="Rooting our children in the Word of God from their very first years."
      />


      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Timing Banner */}
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
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Regular Sunday School</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>8:00 AM – 9:45 AM</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Extended English Sunday School</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>10:00 AM onwards</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Schedule</p>
              <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>Every Sunday Morning</p>
            </div>
          </div>

          {/* About */}
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
              The <strong style={{ color: 'var(--color-text)' }}>Sunday School Ministry</strong> of the Church of Christ (Union Church), Bhubaneswar, is a vibrant and nurturing ministry dedicated to imparting biblical values and Christian teachings to children from an early age. The ministry aims to help children know God personally, understand His Word, develop Christian character, and grow into faithful followers of Jesus Christ.
            </p>
            <p>
              Every Sunday, children gather in an atmosphere of love, learning, and fellowship where they are taught Bible stories, memory verses, Christian songs, and prayers that help them apply God&rsquo;s teachings in their daily lives. The Sunday School serves as a foundation for the spiritual growth of children, encouraging them to build a lifelong relationship with Christ and actively participate in the life of the Church.
            </p>
            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              &ldquo;Train up a child in the way he should go, and when he is old he will not depart from it.&rdquo; &mdash; Proverbs 22:6
            </div>
            <p>
              Separate Sunday School classes are also conducted at the <strong style={{ color: 'var(--color-text)' }}>Chandrasekharpur</strong> and <strong style={{ color: 'var(--color-text)' }}>Kalinga Vihar</strong> Worship Centres, extending the ministry&rsquo;s reach and ensuring that children from different locations receive sound biblical instruction.
            </p>
            <p>
              As an expression of Christian love and care, <strong style={{ color: 'var(--color-text)' }}>refreshments are provided to the Sunday School children every Sunday</strong> after the classes. This time of fellowship nourishes the children physically and encourages friendship, sharing, and a sense of belonging within the church family.
            </p>
          </div>

          {/* Class Distribution */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Sunday School Class Distribution
          </h2>
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
            {/* Header Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.4fr 1.4fr',
                background: 'rgba(128,0,0,0.06)',
                padding: '0.85rem 2rem',
                borderBottom: '2px solid rgba(128,0,0,0.12)',
              }}
            >
              {['Age', 'School Class', 'Sunday School Class'].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    color: 'var(--color-primary-dark)',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
            {/* Data Rows */}
            {classDistribution.map((row, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.4fr 1.4fr',
                  padding: '1rem 2rem',
                  borderBottom: i < classDistribution.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(128,0,0,0.015)',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '50px',
                    background: 'rgba(128,0,0,0.07)',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: '1px solid rgba(128,0,0,0.12)',
                    width: 'fit-content',
                  }}
                >
                  {row.age}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                  {row.sciClass}
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.3rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(128,0,0,0.06)',
                    color: 'var(--color-primary-dark)',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    width: 'fit-content',
                  }}
                >
                  {row.ssClass}
                </span>
              </div>
            ))}
          </div>

          {/* Examinations */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Examinations
          </h2>
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: '2rem 2.5rem',
              border: '1px solid rgba(0,0,0,0.05)',
              fontSize: '1rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.8,
              marginBottom: '3.5rem',
            }}
          >
            <p>
              To encourage regular learning and spiritual growth, the Sunday School conducts examinations <strong style={{ color: 'var(--color-text)' }}>twice a year</strong>. Students appear for both <strong style={{ color: 'var(--color-text)' }}>Half-Yearly</strong> and <strong style={{ color: 'var(--color-text)' }}>Annual</strong> Sunday School Examinations, which assess their understanding of Bible lessons, memory verses, and biblical knowledge taught throughout the year.
            </p>
            <p style={{ marginTop: '1rem' }}>
              The examinations help children strengthen their understanding of God&rsquo;s Word and motivate them to study the Scriptures diligently. Outstanding performers are recognised and encouraged during the annual prize-giving and Christmas celebrations.
            </p>
          </div>

          {/* Annual Programs */}
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
              marginBottom: '3.5rem',
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

          {/* Leadership */}
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

          {/* Advisors */}
          <p
            style={{
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-primary-dark)',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            Advisors of Sunday School — BBSR
          </p>
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
              marginBottom: '1.5rem',
            }}
          >
            {advisors.map((a, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  padding: '1.1rem 2rem',
                  borderBottom:
                    i < advisors.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(128,0,0,0.015)',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{a.name}</span>
                <a
                  href={`tel:${a.phone}`}
                  style={{
                    padding: '0.2rem 0.85rem',
                    borderRadius: '50px',
                    background: 'rgba(128,0,0,0.07)',
                    color: 'var(--color-primary)',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    border: '1px solid rgba(128,0,0,0.12)',
                  }}
                >
                  📞 {a.phone}
                </a>
              </div>
            ))}
          </div>

          {/* Superintendent & Accountant */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              marginBottom: '3.5rem',
            }}
          >
            <div
              style={{
                background: 'var(--color-white)',
                border: '1px solid rgba(128,0,0,0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.4rem' }}>Superintendent</p>
              <p style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.3rem' }}>Sri Ashim Kumar Das</p>
              <a href="tel:9437805935" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>📞 9437805935</a>
            </div>
            <div
              style={{
                background: 'var(--color-white)',
                border: '1px solid rgba(128,0,0,0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.4rem' }}>Accountant</p>
              <p style={{ fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.3rem' }}>Smt. Prem Lata Franklin</p>
              <a href="tel:9178253901" style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>📞 9178253901</a>
            </div>
          </div>

          {/* Vision */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(128,0,0,0.06) 0%, rgba(128,0,0,0.02) 100%)',
              border: '1px solid rgba(128,0,0,0.12)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 2.5rem',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              Our Vision
            </p>
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.8,
                maxWidth: '640px',
                margin: '0 auto',
              }}
            >
              To raise a generation of children who are <strong style={{ color: 'var(--color-text)' }}>rooted in God&rsquo;s Word</strong>, grounded in Christian values, and equipped to serve the Lord with faith, love, and obedience.
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
