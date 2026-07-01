import Link from 'next/link'

export const metadata = {
  title: 'Satellite Churches | Church of Christ Union Church Bhubaneswar',
  description:
    'Satellite worship centres of Church of Christ (Union Church), Bhubaneswar — extending worship, fellowship, and services across Chandrasekharpur, Kalinga Vihar, and Sundarpada.',
}

import PageHeader from '@/components/PageHeader'
import styles from './satellite-churches.module.css'

export default function SatelliteChurchesPage() {
  const churches = [
    {
      id: 'chandrasekharpur',
      name: 'Chandrasekharpur Worship Center',
      timing: 'Sundays @ 10:00 AM',
      location: '96, District Center, Chandrasekharpur',
      brief:
        "Serving the community since the early 90s, offering Odia worship services and children's Sunday school.",
    },
    {
      id: 'kalinga-vihar',
      name: 'Kalinga Vihar Worship Center',
      timing: 'Sundays @ 10:00 AM',
      location: 'Kalinga Vihar, Bhubaneswar',
      brief:
        'Established in July 2015, this growing congregation gathers weekly for Odia worship and fellowship.',
    },
    {
      id: 'sundarpada',
      name: 'Sundarpada Worship Center',
      timing: 'Sundays @ 10:00 AM',
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
          <div className={styles.churchGrid}>
            {churches.map((church) => (
              <Link
                key={church.id}
                href={`/activities/satellite-churches/${church.id}`}
                className={styles.satCard}
              >
                {/* Timing badge */}
                <span className={styles.timingBadge}>
                  {church.timing}
                </span>

                <h2 className={styles.cardTitle}>
                  {church.name}
                </h2>

                <p className={styles.cardDesc}>
                  {church.brief}
                </p>

                <div className={styles.bottomBar}>
                  <span className={styles.locationSpan}>
                    📍 {church.location}
                  </span>
                  <span className={styles.actionSpan}>
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
