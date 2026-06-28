import Link from 'next/link'

export const metadata = {
  title: 'Satellite Churches | Church of Christ Union Church Bhubaneswar',
  description:
    'Satellite worship centres of Church of Christ (Union Church), Bhubaneswar — extending worship, fellowship, and services across Chandrasekharpur, Kalinga Vihar, and Sundarpada.',
}

import PageHeader from '@/components/PageHeader'

export default function SatelliteChurchesPage() {
  const churches = [
    {
      id: 'chandrasekharpur',
      name: 'Chandrasekharpur Worship Center',
      timing: 'Sundays @ 9:30 AM',
      location: '96, District Center, Chandrasekharpur',
      brief:
        "Serving the community since the early 90s, offering Odia worship services and children's Sunday school.",
    },
    {
      id: 'kalinga-vihar',
      name: 'Kalinga Vihar Worship Center',
      timing: 'Sundays @ 9:30 AM',
      location: 'Kalinga Vihar, Bhubaneswar',
      brief:
        'Established in July 2015, this growing congregation gathers weekly for Odia worship and fellowship.',
    },
    {
      id: 'sundarpada',
      name: 'Sundarpada Worship Center',
      timing: 'Sundays @ 9:30 AM',
      location: 'Sundarpada, Bhubaneswar',
      brief:
        'Our third worship center established in 2017 to expand our outreach and bring the Gospel to Sundarpada.',
    },
  ]

  return (
    <div>
      <PageHeader
        category="Activities"
        title="Satellite Churches"
        description="Extending our worship, fellowship, and services across various regions in Bhubaneswar and beyond."
      />


      {/* ── Cards Section ── */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {churches.map((church) => (
              <Link
                key={church.id}
                href={`/activities/satellite-churches/${church.id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--color-white)',
                  border: '1px solid rgba(128,0,0,0.1)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                }}
                className="sat-card"
              >
                {/* Timing badge */}
                <span
                  style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.85rem',
                    borderRadius: '50px',
                    background: 'rgba(128,0,0,0.07)',
                    color: 'var(--color-primary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '1.1rem',
                    width: 'fit-content',
                  }}
                >
                  {church.timing}
                </span>

                <h2
                  style={{
                    fontSize: '1.3rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    color: 'var(--color-text)',
                    marginBottom: '0.75rem',
                    lineHeight: 1.3,
                  }}
                >
                  {church.name}
                </h2>

                <p
                  style={{
                    fontSize: '0.96rem',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.7,
                    flexGrow: 1,
                    marginBottom: '1.5rem',
                  }}
                >
                  {church.brief}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                    paddingTop: '1.1rem',
                    marginTop: 'auto',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--color-text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '65%',
                    }}
                  >
                    📍 {church.location}
                  </span>
                  <span
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
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

      <style>{`
        .sat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(128, 0, 0, 0.12);
          border-color: rgba(128, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}
