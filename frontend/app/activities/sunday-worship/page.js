export const metadata = {
  title: 'Sunday Worship | Church of Christ Union Church Bhubaneswar',
  description:
    'Join us every Sunday for our English and Odia worship services at Union Church, Bhubaneswar, and our satellite worship centres.',
}

import PageHeader from '@/components/PageHeader'
import styles from './sunday-worship.module.css'

export default function SundayWorshipPage() {
  return (
    <div>
      <PageHeader
        category="Activities"
        title="Sunday Worship"
        description="Gathering together in the name of Christ — every Sunday, across all our centres."
      />


      {/* ── Content ── */}
      <section className="section">
        <div className={`container ${styles.contentContainer}`}>
          {/* Service Times Card Row */}
          <div className={styles.timesGrid}>
            {[
              { label: 'English Service', time: '10:00 AM', loc: 'Union Church' },
              { label: 'Odia Service', time: '4:30 PM', loc: 'Union Church' },
              { label: 'Satellite Centres', time: '10:00 AM', loc: 'C.S. Pur · Kalinga Vihar · Sundarpada' },
            ].map((s) => (
              <div key={s.label} className={styles.timeCard}>
                <p
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    marginBottom: '0.4rem',
                  }}
                >
                  {s.label}
                </p>
                <p
                  style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: 'var(--color-primary-dark)',
                    fontFamily: 'var(--font-heading)',
                    marginBottom: '0.3rem',
                  }}
                >
                  {s.time}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>{s.loc}</p>
              </div>
            ))}
          </div>

          {/* Main text */}
          <div className={styles.infoCard}>
            <p>
              Two Worship Services are held in Union Church every Sunday. The <strong style={{ color: 'var(--color-text)' }}>English Service</strong> starts at <strong style={{ color: 'var(--color-text)' }}>10:00 AM</strong>, while the <strong style={{ color: 'var(--color-text)' }}>Odia Worship Service</strong> commences at <strong style={{ color: 'var(--color-text)' }}>4:30 PM</strong> . Apart from this, we have 3 more Worship centres in Chandrasekharpur, Kalinga Vihar and Sundarpada. The Worship starts in all these centres at <strong style={{ color: 'var(--color-text)' }}>10:00 AM</strong> every Sunday morning. We have another small Congregation in the Jagatsinghpur area, where Evangelist Bro. Gobinda Sahu leads the Worship.
            </p>

            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              Lord&rsquo;s Supper is observed in the 1st week here in Union Church. It is observed in the 2nd week in C.S. Pur, 3rd week in Kalinga Vihar Worship centre and 4th week in the Sundarpada Worship centre. Our Pastors conduct the Holy Communion on an alternate basis every month.
            </div>

            <p>
              Besides Pastors <strong style={{ color: 'var(--color-text)' }}>(Rev. Songram Keshari Singh</strong> , <strong style={{ color: 'var(--color-text)' }}>Rev. Dr. Ayub Chhinchani</strong> and <strong style={{ color: 'var(--color-text)' }}>Rev. Satish Kumar Pani)</strong> , preachers from within and outside the city and state are invited to share God&rsquo;s Word on Sundays.
            </p>

            <p>
              We are a Bible believing Church and we share the Gospel of Jesus Christ in its entirety. We believe the Church of Christ is not a pleasure boat, but a <strong style={{ color: 'var(--color-primary)' }}>life boat for souls to be saved</strong> to the Kingdom of God.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
