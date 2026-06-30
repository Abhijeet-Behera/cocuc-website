import PageHeader from '@/components/PageHeader'
import styles from './womens-fellowship.module.css'

export const metadata = {
  title: "Women's Fellowship | Church of Christ Union Church Bhubaneswar",
  description:
    "Learn about our Mahila Sabha (Women’s Fellowship) — a prayerful ministry dedicated to the spiritual growth, fellowship, and service of the women of the Church of Christ (Union Church), Bhubaneswar.",
}

export default function WomensFellowshipPage() {
  const committee = [
    { name: 'Mrs. Manaharini Muduli', role: 'President' },
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
      <PageHeader
        category="Activities"
        title="Women's Fellowship"
        description="Mahila Sabha — nurturing women in their walk with Christ through prayer, fellowship, and service."
      />

      {/* ── Content ── */}
      <section className="section">
        <div className={`container ${styles.contentContainer}`}>

          {/* Meeting Info Banner */}
          <div className={styles.infoBanner}>
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Meeting Day</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Saturday</p>
            </div>
            <div className={styles.infoDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Time</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>4:30 PM</p>
            </div>
            <div className={styles.infoDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Venue</p>
              <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>Amenity Hall (Ground Floor), Union Church</p>
            </div>
          </div>

          {/* Winter Note */}
          <div className={styles.noticeCard}>
            <strong>Winter Season Notice:</strong> The fellowship is preponed to <strong>4:00 PM</strong> during the winter season.
          </div>

          {/* About Section */}
          <div className={styles.aboutCard}>
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
          <div className={styles.servicesCard}>
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

          <div className={styles.committeeCard}>
            {committee.map((c, i) => (
              <div
                key={i}
                className={`${styles.committeeRow} ${i % 2 !== 0 ? styles.committeeRowAlt : ''}`}
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

          <div className={styles.satelliteGrid}>
            {satelliteCentres.map((c, i) => (
              <div key={i} className={styles.satelliteCard}>
                <p
                  style={{
                    fontWeight: 700,
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.4rem',
                    fontSize: '1rem',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {c.location}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Coordinator:</span> {c.coordinator}
                </p>
              </div>
            ))}
          </div>

          {/* 3rd Saturday Combined Meeting */}
          <div className={styles.monthlyGatheringCard}>
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
