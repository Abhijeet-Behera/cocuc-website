'use client'

import Link from 'next/link'

export default function SatelliteChurchesPage() {
  const churches = [
    {
      id: 'chandrasekharpur',
      name: 'Chandrasekharpur Worship Center',
      timing: 'Sundays @ 9:30 AM',
      location: '96, District Center, Chandrasekharpur',
      brief: 'Serving the community since the early 90s, offering Odia worship services and children’s Sunday school.',
      color: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)'
    },
    {
      id: 'kalinga-vihar',
      name: 'Kalinga Vihar Worship Center',
      timing: 'Sundays @ 9:30 AM',
      location: 'Kalinga Vihar, Bhubaneswar',
      brief: 'Established in July 2015, this growing congregation gathers weekly for Odia worship and fellowship.',
      color: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)'
    },
    {
      id: 'sundarpada',
      name: 'Sundarpada Worship Center',
      timing: 'Sundays @ 9:30 AM',
      location: 'Sundarpada, Bhubaneswar',
      brief: 'Our third worship center established in 2017 to expand our outreach and bring the Gospel to Sundarpada.',
      color: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)'
    },
    {
      id: 'jagatsinghpur',
      name: 'Jagatsinghpur Worship Center',
      timing: 'Sundays @ 9:30 AM',
      location: 'Jagatsinghpur (90 km from capital)',
      brief: 'A dedicated home congregation sharing the love of Christ in a miniscule Christian majority region.',
      color: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)'
    }
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1f0000 0%, #0c0014 50%, #000000 100%)', color: '#fff' }}>
      {/* ── Hero Banner ── */}
      <section
        style={{
          padding: '180px 0 80px 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontSize: '0.85rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              opacity: 0.7,
              marginBottom: '1rem',
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-primary-light)',
              fontWeight: 700,
            }}
          >
            Our Extensions
          </p>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              marginBottom: '1.5rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #fff, #ffc0c0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Satellite Churches
          </h1>
          <p
            style={{
              fontSize: '1.2rem',
              opacity: 0.8,
              maxWidth: '650px',
              margin: '0 auto',
              lineHeight: 1.8,
            }}
          >
            Extending our worship, fellowship, and services across various regions in Bhubaneswar and beyond to Jagatsinghpur.
          </p>
        </div>
      </section>

      {/* ── Glassmorphic Cards Section ── */}
      <section style={{ padding: '0 0 100px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              padding: '1rem',
            }}
          >
            {churches.map((church) => (
              <Link
                key={church.id}
                href={`/activities/satellite-churches/${church.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '24px',
                  padding: '2.5rem 2rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                  boxShadow: '0 10px 30px 0 rgba(0, 0, 0, 0.3)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                className="hover-card"
              >
                {/* Glow effect on hover */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'radial-gradient(circle, rgba(128,0,0,0.15) 0%, transparent 60%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                    pointerEvents: 'none',
                  }}
                  className="glow-effect"
                />

                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#ff8080',
                    marginBottom: '0.75rem',
                  }}
                >
                  {church.timing}
                </span>

                <h2
                  style={{
                    fontSize: '1.6rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    color: '#fff',
                  }}
                >
                  {church.name}
                </h2>

                <p
                  style={{
                    fontSize: '0.95rem',
                    color: 'rgba(255,255,255,0.7)',
                    lineHeight: 1.6,
                    marginBottom: '2rem',
                    flexGrow: 1,
                  }}
                >
                  {church.brief}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '1.25rem',
                  }}
                >
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                    📍 {church.location}
                  </span>
                  <span
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#ff8080',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Styled JSX for the interactive card zoom & glow effects */}
      <style jsx global>{`
        .hover-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 128, 128, 0.3);
          box-shadow: 0 20px 40px 0 rgba(128, 0, 0, 0.25);
          background: rgba(255, 255, 255, 0.08) !important;
        }
        .hover-card:hover .glow-effect {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
