import PageHeader from '@/components/PageHeader'
import styles from './youth-fellowship.module.css'

export const metadata = {
  title: 'Youth Fellowship | Church of Christ Union Church Bhubaneswar',
  description:
    'The Youth Fellowship of Church of Christ (Union Church), Bhubaneswar — a vibrant ministry dedicated to nurturing young believers in spiritual growth, leadership, and fellowship in Christ.',
}

export default function YouthFellowshipPage() {
  const gatheringElements = [
    'Live Worship and Praises',
    'Games and Interactive Activities',
    'Youth Centric Sermons and Discussions',
    'Prayer and Intercession',
    'Fellowship and Spiritual Encouragements',
  ]

  const topics = [
    'Identity in Christ',
    'How to Overcome Temptation',
    'Discovering God\'s Purpose and Calling',
    'Building Godly Relationships and Friendships',
    'Purity and Holiness',
    'Dealing with Peer Pressure',
    'Digital Distractions & Setting Boundaries',
    'Managing Social Media from a Christian Perspective',
    'Faith in Difficult Times',
    'Forgiveness and Reconciliation',
    'Stewardship and Responsibility',
    'Christian Living & Modesty',
    'Mental and Emotional Well-being in Christ',
  ]

  const annualActivities = [
    {
      icon: '',
      title: 'Church Youth Retreat',
      when: 'Every year — 15th August',
      desc: 'The Youth Fellowship conducts a special Youth Retreat for all young people of the Church every year on 15th August, and all youth from the city are invited.',
    },
    {
      icon: '',
      title: 'Youth Summer Camp',
      when: 'Annually in June (School & College Vacations)',
      desc: 'One of the major annual activities — a three-day residential outing camp aimed at spiritual formation. In 2024 & 2025, held at St. Vincent Retreat Center, Gopalpur. In 2026, held at Ishopanti Ashram, Puri (15–17 June), featuring live worship, interactive sessions, indoor & outdoor fun activities, group discussions, and united prayer.',
    },
    {
      icon: '',
      title: 'Youth Christmas Celebration',
      when: 'First Saturday of December, Every Year',
      desc: 'Held every year, the celebration includes Christmas carols worship/Kirtan, Bible games, fellowship, gift exchange, and special performances by the youth.',
    },
  ]

  const scriptures = [
    {
      ref: '1 Timothy 4:12',
      text: '"Don\'t let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity."',
    },
    {
      ref: 'Psalm 119:9',
      text: '"How can a young person stay on the path of purity? By living according to your word."',
    },
    {
      ref: 'Proverbs 4:10-13',
      text: '"Hear, my son, and accept my words, and the years of your life will be many. I have taught you the way of wisdom; I have led you in straight paths. Enter them, do not turn aside. Keep hold of instruction, do not let go; guard it, for it is your life."',
    },
  ]

  const committee = [
    { name: 'Mr. Smruti Ranjan Nayak', role: 'Joint Secretary & Convenor' },
    { name: 'Mr. JM Manna Whitson', role: 'Co-Convenor' },
    { name: 'Er. Michael Rajesh Behera', role: 'Secretary' },
    { name: 'Mr. Paresh Kumar Das', role: 'Committee Member' },
    { name: 'Rev. Songram Keshari Singh', role: 'Committee Member & Pastor' },
    { name: 'Rev. Satish Kumar Pani', role: 'Committee Member & Pastor' },
    { name: 'Rev. Satya Ranjan Singh', role: 'Committee Member & Pastor' },
    { name: 'Mr. Prafulla Kumar Dash', role: 'Committee Member' },
    { name: 'Mrs. Aniva Chand', role: 'Committee Member' },
  ]

  const leaderRoles = ['Joint Secretary & Convenor', 'Secretary', 'Co-Convenor']

  return (
    <div>
      <PageHeader
        category="Activities"
        title="Youth Fellowship"
        description="Nurturing young believers in spiritual growth, leadership, and fellowship in Christ."
      />

      {/* ── Content ── */}
      <section className="section">
        <div className={`container ${styles.contentContainer}`}>

          {/* Schedule Banner */}
          <div className={styles.timingBanner}>
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Meeting Day</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Saturday</p>
            </div>
            <div className={styles.timingDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Time</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>5:30 PM – 7:00 PM</p>
            </div>
            <div className={styles.timingDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Venue</p>
              <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>First Floor, Amenity Hall</p>
            </div>
          </div>

          {/* About */}
          <div className={styles.aboutCard}>
            <p>
              The <strong style={{ color: 'var(--color-text)' }}>Youth Fellowship</strong> of Church of Christ (Union Church), Bhubaneswar is a vibrant ministry dedicated to nurturing young believers in their spiritual growth, leadership, and fellowship with one another in Christ.
            </p>
            <p>
              The fellowship provides an environment where young people can worship together, study the Word of God, build meaningful Christian friendships, and discover their God-given purpose.
            </p>
            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              Through worship, Bible study, fellowship, and service, the youth are strengthened in their faith and equipped to become effective witnesses for Christ.
            </div>
          </div>

          {/* Each Gathering Consists Of */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Each Gathering Consists Of
          </h2>
          <div className={styles.gatheringGrid}>
            {gatheringElements.map((g, i) => (
              <div key={i} className={styles.gatheringCard}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(128,0,0,0.08)',
                    color: 'var(--color-primary)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.96rem' }}>
                  {g}
                </span>
              </div>
            ))}
          </div>

          {/* Topics */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '0.6rem',
            }}
          >
            Topics Taught Throughout the Year
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
            Relevant and practical topics to equip young believers in their spiritual journey:
          </p>
          <div className={styles.topicsContainer}>
            {topics.map((t) => (
              <span key={t} className={styles.topicTag}>
                {t}
              </span>
            ))}
          </div>

          {/* Annual Activities */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Annual Activities
          </h2>
          <div className={styles.annualActivitiesContainer}>
            {annualActivities.map((a, i) => (
              <div key={i} className={styles.annualActivityCard}>
                <span style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{a.icon}</span>
                <div>
                  <p
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      color: 'var(--color-text)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    {a.title}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.18rem 0.75rem',
                      borderRadius: '50px',
                      background: 'rgba(128,0,0,0.07)',
                      color: 'var(--color-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {a.when}
                  </span>
                  <p style={{ fontSize: '0.97rem', color: 'var(--color-text-muted)', lineHeight: 1.75 }}>
                    {a.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* What Scripture Says */}
          <h2
            style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            What Scripture Says About Youth
          </h2>
          <div className={styles.scripturesContainer}>
            {scriptures.map((v, idx) => (
              <div key={idx} className={styles.scriptureCard}>
                <p
                  style={{
                    fontStyle: 'italic',
                    fontSize: '1.05rem',
                    color: 'var(--color-text)',
                    lineHeight: 1.75,
                    marginBottom: '1rem',
                  }}
                >
                  {v.text}
                </p>
                <p
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-primary)',
                  }}
                >
                  &mdash; {v.ref}
                </p>
              </div>
            ))}
          </div>

          {/* Youth Committee */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Youth Committee
          </h2>
          <div className={styles.committeeContainer}>
            {committee.map((m, i) => (
              <div
                key={i}
                className={`${styles.committeeRow} ${i % 2 !== 0 ? styles.committeeRowAlt : ''}`}
                style={{
                  borderBottom: i < committee.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '1rem' }}>
                  {m.name}
                </span>
                <span
                  style={{
                    padding: '0.22rem 0.85rem',
                    borderRadius: '50px',
                    background: leaderRoles.some((r) => m.role.includes(r.split(' ')[0]))
                      ? 'rgba(128,0,0,0.09)'
                      : 'rgba(0,0,0,0.04)',
                    color: leaderRoles.some((r) => m.role.includes(r.split(' ')[0]))
                      ? 'var(--color-primary)'
                      : 'var(--color-text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  {m.role}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
