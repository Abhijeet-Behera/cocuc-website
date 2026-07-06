import PageHeader from '@/components/PageHeader'
import styles from './monday-prayer.module.css'

export const metadata = {
  title: 'Monday Prayer | Church of Christ Union Church Bhubaneswar',
  description:
    'Every Monday at 7:00 PM — join the Church of Christ (Union Church), Bhubaneswar for corporate prayer, worship, and intercession in person or via Zoom.',
}

const prayerHour = [
  { time: '00 – 20 Mins', segment: 'Opening Prayer, Singing & Worship' },
  { time: '20 – 35 Mins', segment: "Sharing from God's Word" },
  { time: '35 – 55 Mins', segment: 'Sharing Prayer Points & Intercession' },
  { time: '55 – 60 Mins', segment: 'Closing Prayer & Benediction' },
]

const julySchedule = [
  {
    date: '13.07.2026',
    presiding: 'Dn. Mr. Sudhir Swain',
    message: 'Er. Michael Rajesh Behera',
    worship: 'Mr. Paresh Kumar Das',
    zones: 'Bethel Bethesda, Ebenezer, Gethsemane, Hebron & Golgotha',
  },
  {
    date: '20.07.2026',
    presiding: 'Dn. Mr. Raj Sekhar Sahu',
    message: 'Mr. Alekh Chandra Das',
    worship: '—',
    zones: 'Sinai, Bethel, Emmaus, Bethany & Sophia',
  },
  {
    date: '27.07.2026',
    presiding: 'Dn. Mr. Amrut Jena',
    message: '—',
    worship: '—',
    zones: 'Horeb, Mizpah, Hermon, Nazareth, Zion & Elim',
  },
]

export default function MondayPrayerPage() {
  return (
    <div>
      <PageHeader
        category="Prayer Wings"
        title="Monday Prayer"
        description="Starting our week in His presence — gathering every Monday as a family in prayer, worship, and intercession."
      />

      {/* ── Content ── */}
      <section className="section">
        <div className={`container ${styles.contentContainer}`}>

          {/* Info Banner */}
          <div className={styles.infoBanner}>
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Day &amp; Time</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Monday | 7:00 PM – 8:00 PM</p>
            </div>
            <div className={styles.infoDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>In-Person Venue</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Ground Floor Amenity Hall</p>
            </div>
            <div className={styles.infoDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Also Available</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>Online via Zoom</p>
            </div>
          </div>

          {/* About */}
          <div className={styles.aboutCard}>
            <p>
              There is no better way to anchor our week than coming together as a family in prayer. Every Monday, the{' '}
              <strong style={{ color: 'var(--color-text)' }}>Church of Christ (Union Church), Bhubaneswar</strong> gathers to seek God's face,
              intercede for our community, and lift up different matters of the Church.
            </p>
            <p>
              Whether you join us in person or virtually, your presence and prayers matter! This dedicated time is spent in worship through
              songs, meditation, and prayer — conducted by our Associate Pastors, Deacons, or invited leaders.
            </p>
            <div className={styles.blockquote}>
              Unless a Church prays, we cannot see lives being changed; we cannot fulfill the Great Commission which the Lord has given to His
              people. Do come and join us as we pray in faith on various matters.
            </div>
          </div>

          {/* Join Online */}
          <h2 className={styles.sectionHeading}>Join Online via Zoom</h2>
          <div className={styles.zoomCard}>
            <div className={styles.zoomIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <div className={styles.zoomDetails}>
              <h3>Online Meeting Details</h3>
              <p>Join from anywhere in the world. Open Zoom and enter the details below:</p>
              <p><strong>Meeting ID:</strong> 218 382 5185</p>
              <p><strong>Passcode:</strong> 12345</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.87rem', opacity: 0.75 }}>
                Please join a few minutes early. Mute your microphone on entry to keep the atmosphere reverent.
              </p>
            </div>
          </div>

          {/* Our Hour of Prayer */}
          <h2 className={styles.sectionHeading}>Our Hour of Prayer</h2>
          <p style={{ fontSize: '0.97rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            We value your time and follow a purposeful, 60-minute schedule to ensure we worship, learn, and pray effectively.
          </p>
          <div className={styles.serviceTable}>
            <div className={styles.serviceTableHeader}>
              <span>Time</span>
              <span>Programme</span>
            </div>
            {prayerHour.map((row, i) => (
              <div key={i} className={`${styles.serviceRow} ${i % 2 !== 0 ? styles.serviceRowAlt : ''}`}>
                <span className={styles.serviceTime}>{row.time}</span>
                <span className={styles.serviceSegment}>{row.segment}</span>
              </div>
            ))}
          </div>

          {/* July 2026 Schedule */}
          <h2 className={styles.sectionHeading}>Service Schedule — July 2026</h2>
          <p style={{ fontSize: '0.97rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Join us this month as our different church zones and leaders lead us into the throne room of grace.
          </p>
          <div className={styles.scheduleCard}>
            <div className={styles.scheduleHeader}>
              <span>Date</span>
              <span>Presided By</span>
              <span>Message By</span>
              <span>Worship Led By</span>
              <span>Participating Prayer Zones</span>
            </div>
            {julySchedule.map((row, i) => (
              <div key={i} className={`${styles.scheduleRow} ${i % 2 !== 0 ? styles.scheduleRowAlt : ''}`}>
                <div className={styles.scheduleDate}>{row.date}</div>
                <div className={styles.scheduleCell}>
                  <strong>Presided By</strong>
                  {row.presiding}
                </div>
                <div className={styles.scheduleCell}>
                  <strong>Message By</strong>
                  {row.message}
                </div>
                <div className={styles.scheduleCell}>
                  <strong>Worship Led By</strong>
                  {row.worship}
                </div>
                <div className={styles.scheduleCell}>
                  <strong>Prayer Zones</strong>
                  <span className={styles.zonesChip}>{row.zones}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Dual Scripture Footer */}
          <div className={styles.scriptureGrid}>
            <div className={styles.scriptureCard}>
              <p>
                &ldquo;Again, truly I tell you that if two of you on earth agree about anything they ask for, it will be done for them by my Father in heaven.&rdquo;
              </p>
              <span>— Matthew 18:19</span>
            </div>
            <div className={styles.scriptureCard}>
              <p>
                &ldquo;Devote yourselves to prayer, being watchful and thankful.&rdquo;
              </p>
              <span>— Colossians 4:2</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
