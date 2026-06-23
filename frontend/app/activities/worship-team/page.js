export const metadata = {
  title: 'Worship Team | Church of Christ Union Church Bhubaneswar',
  description:
    'Church of Christ (Union Church), Bhubaneswar is blessed with two vibrant worship ministries — the Susamachar Sangita Dala (Odia Choir) and the English Choir Worship Team — that lead the congregation in praising and glorifying God.',
}

export default function WorshipTeamPage() {
  const odiaChoir = [
    { name: 'Mr. Asit Kumar Mohanty',   role: 'Convenor'            },
    { name: 'Mr. Pradeep Kumar Roul',   role: 'Co-Convenor'         },
    { name: 'Mrs. Swarnamoyee Patra',   role: 'Member'              },
    { name: 'Mrs. Jharana Pradhan',     role: 'Member'              },
    { name: 'Mr. Gokula Pradhan',       role: 'Member'              },
    { name: 'Mr. Obed Ranjan Singh',    role: 'Member'              },
    { name: 'Mr. Benjamin Peter',       role: 'Member'              },
    { name: 'Mrs. Dheerarani Supakar',  role: 'Member'              },
    { name: 'Mr. Michael Rajesh Behera',role: 'Secretary, Church'   },
  ]

  const englishChoir = [
    { name: 'Mr. Santanu Kumar Mohanty',role: 'Convenor'            },
    { name: 'Miss. Indira Patra',       role: 'Co-Convenor'         },
    { name: 'Mr. Adarsh Vasa',          role: 'Member'              },
    { name: 'Mrs. K. T. Mary',          role: 'Member'              },
    { name: 'Mr. Amlan Nag',            role: 'Member'              },
    { name: 'Mr. Vinod Mohanty',        role: 'Member'              },
    { name: 'Mr. Michael Rajesh Behera',role: 'Secretary, Church'   },
  ]

  const MemberList = ({ members }) => (
    <div
      style={{
        background: 'var(--color-white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden',
        marginBottom: '0',
      }}
    >
      {members.map((m, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            padding: '1rem 2rem',
            borderBottom: i < members.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
            background: i % 2 === 0 ? 'transparent' : 'rgba(128,0,0,0.015)',
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.98rem' }}>
            {m.name}
          </span>
          <span
            style={{
              padding: '0.2rem 0.8rem',
              borderRadius: '50px',
              background:
                m.role === 'Convenor' || m.role === 'Co-Convenor'
                  ? 'rgba(128,0,0,0.1)'
                  : m.role === 'Secretary, Church'
                  ? 'rgba(128,0,0,0.06)'
                  : 'rgba(0,0,0,0.04)',
              color:
                m.role === 'Convenor' || m.role === 'Co-Convenor'
                  ? 'var(--color-primary)'
                  : m.role === 'Secretary, Church'
                  ? 'var(--color-primary-dark)'
                  : 'var(--color-text-muted)',
              fontSize: '0.76rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
            }}
          >
            {m.role}
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section
        style={{
          background:
            'linear-gradient(135deg, #0d001a 0%, #3a0050 55%, #1a0030 100%)',
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
              style={{ width: '100%', height: '100%', fill: 'currentColor' }}
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
            Worship Team
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
            Leading the congregation in praising and glorifying God through music and worship.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Scripture Quote */}
          <div
            style={{
              background:
                'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
              color: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 2.5rem',
              marginBottom: '3.5rem',
              boxShadow: '0 8px 24px rgba(128,0,0,0.2)',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', lineHeight: 1.75, marginBottom: '0.75rem' }}>
              &ldquo;Let everything that has breath praise the Lord. Praise the Lord!&rdquo;
            </p>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.85 }}>
              &mdash; Psalm 150:6
            </p>
          </div>

          {/* Intro */}
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: 'clamp(2rem, 5vw, 3rem)',
              border: '1px solid rgba(0,0,0,0.05)',
              fontSize: '1.05rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.85,
              marginBottom: '3.5rem',
            }}
          >
            The Church of Christ (Union Church), Bhubaneswar is blessed with{' '}
            <strong style={{ color: 'var(--color-text)' }}>two vibrant worship ministries</strong>{' '}
            that lead the congregation in praising and glorifying God through music and worship.
          </div>

          {/* Odia Choir */}
          <div
            style={{
              marginBottom: '3.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '2.5rem',
                  borderRadius: '2px',
                  background: 'var(--color-primary)',
                  flexShrink: 0,
                }}
              />
              <div>
                <h2
                  style={{
                    fontSize: '1.45rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.15rem',
                  }}
                >
                  Odia Choir &mdash; Susamachar Sangita Dala
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Leading worship in Odia through gospel songs, hymns, and special musical presentations.
                </p>
              </div>
            </div>

            {/* Schedule strip */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              {[
                { label: 'Leads Worship', value: 'During the Odia Service' },
                { label: 'Choir Practice', value: 'Every Saturday @ 7:00 PM' },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: 'rgba(128,0,0,0.05)',
                    border: '1px solid rgba(128,0,0,0.1)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.7rem 1.25rem',
                  }}
                >
                  <p style={{ fontSize: '0.7rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: 'var(--color-primary-dark)',
                fontWeight: 700,
                marginBottom: '0.6rem',
              }}
            >
              Committee Members
            </p>
            <MemberList members={odiaChoir} />
          </div>

          {/* English Choir */}
          <div
            style={{
              marginBottom: '3.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '2.5rem',
                  borderRadius: '2px',
                  background: 'var(--color-primary)',
                  flexShrink: 0,
                }}
              />
              <div>
                <h2
                  style={{
                    fontSize: '1.45rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.15rem',
                  }}
                >
                  English Choir &mdash; Worship Team
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Leading the congregation in contemporary and traditional worship songs during the English Service.
                </p>
              </div>
            </div>

            {/* Schedule strip */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              {[
                { label: 'Leads Worship', value: 'During the English Service' },
                { label: 'Choir Practice', value: 'Every Friday @ 7:00 PM' },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    background: 'rgba(128,0,0,0.05)',
                    border: '1px solid rgba(128,0,0,0.1)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.7rem 1.25rem',
                  }}
                >
                  <p style={{ fontSize: '0.7rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: 'var(--color-primary-dark)',
                fontWeight: 700,
                marginBottom: '0.6rem',
              }}
            >
              Committee Members
            </p>
            <MemberList members={englishChoir} />
          </div>

          {/* Purpose */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(128,0,0,0.06) 0%, rgba(128,0,0,0.02) 100%)',
              border: '1px solid rgba(128,0,0,0.12)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 2.5rem',
              marginBottom: '2.5rem',
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
              Purpose of Both Choir Ministries
            </p>
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.8,
              }}
            >
              To <strong style={{ color: 'var(--color-text)' }}>glorify God</strong>, strengthen fellowship among believers, and use music as a ministry to spread the message of salvation. Both choirs play an integral role in the worship life of the Church of Christ (Union Church), fostering unity, discipleship, and a spirit of praise as they minister through music and lead the congregation in worship.
            </p>
          </div>

          {/* Join CTA */}
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              padding: '2rem 2.5rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}
          >
            <span style={{ fontSize: '2rem', lineHeight: 1 }}>🎵</span>
            <div>
              <p
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: '0.4rem',
                }}
              >
                Interested in Joining?
              </p>
              <p style={{ fontSize: '0.98rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                If you are willing to join the Odia or English Choir Worship Team, please connect with the respective <strong style={{ color: 'var(--color-text)' }}>Convenor or Co-Convenor</strong> listed above.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
