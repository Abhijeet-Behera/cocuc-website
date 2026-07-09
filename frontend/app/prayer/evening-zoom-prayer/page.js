import PageHeader from '@/components/PageHeader'
import styles from './evening-zoom-prayer.module.css'

export const metadata = {
  title: 'Evening Zoom Prayer | Church of Christ Union Church Bhubaneswar',
  description:
    'Join our Evening Zoom Prayer every Friday & Saturday from 7:00 PM – 8:00 PM IST. Intercede for the sick, the elderly, and personal prayer requests from our congregation.',
}

const sessionStructure = [
  { time: '5 Minutes',  segment: 'Welcome & Opening Prayer' },
  { time: '10 Minutes', segment: 'Worship / Singing' },
  { time: '15 Minutes', segment: 'Devotional Talk' },
  { time: '25 Minutes', segment: 'Prayer & Intercession' },
  { time: '5 Minutes',  segment: "The Lord's Prayer & Benediction" },
]

const julySchedule = [
  { date: '03.07.2026', day: 'Fri', leader: 'Evg. Christopher Surya',    speaker: 'Evg. Christopher Surya',    worship: 'Mr. Arun Kumar Pradhan' },
  { date: '04.07.2026', day: 'Sat', leader: 'Mrs. Leena Pramanik',        speaker: 'Er. J K Mohanty',           worship: 'Mrs. Madhuchhanda Roul' },
  { date: '10.07.2026', day: 'Fri', leader: 'Mr. Rajesh Mohapatra',       speaker: 'Mr. Prasad Tandy',           worship: 'Ms. S Sudipta' },
  { date: '11.07.2026', day: 'Sat', leader: 'Evg. Ranjit Singh',          speaker: 'Mr. Sanjeeb Kumar Das',      worship: 'Mrs. Sujata Mohanty' },
  { date: '17.07.2026', day: 'Fri', leader: 'Elder Mr. Pradeep Roul',     speaker: 'Mr. Alekh Ch Das',           worship: 'Mrs. Sasmita Das' },
  { date: '18.07.2026', day: 'Sat', leader: 'Mrs. Binodini Sahoo',        speaker: 'Rev. Pradeep Kumar',         worship: 'Mrs. Binodini Sahoo' },
  { date: '24.07.2026', day: 'Fri', leader: 'Mr. Prasad Tandy',           speaker: 'Elder Mr. Pradeep Roul',     worship: 'Mrs. Sasmita Pradhan' },
  { date: '25.07.2026', day: 'Sat', leader: 'Mr. Alekh Ch Das',           speaker: 'Mr. Jonathan Rout',          worship: 'Mrs. Leena Pramanik' },
  { date: '31.07.2026', day: 'Fri', leader: 'Mrs. Sasmita Pradhan',       speaker: 'Mrs. Leena Pramanik',        worship: 'Mrs. Suchismita Panda' },
]

export default function EveningZoomPrayerPage() {
  return (
    <div>
      <PageHeader
        category="Prayer Wings"
        title="Evening Zoom Prayer"
        description="Every Friday & Saturday — gathering online to intercede, worship, and pray for one another from wherever you are."
      />

      {/* ── Content ── */}
      <section className="section">
        <div className={`container ${styles.contentContainer}`}>

          {/* Info Banner */}
          <div className={styles.infoBanner}>
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Days</p>
              <p style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Friday &amp; Saturday</p>
            </div>
            <div className={styles.infoDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Time</p>
              <p style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>07:00 PM – 08:00 PM IST</p>
            </div>
            <div className={styles.infoDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Platform</p>
              <p style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Zoom Only</p>
            </div>
          </div>

          {/* About */}
          <div className={styles.aboutCard}>
            <p>
              Evening Zoom Prayer takes place <strong style={{ color: 'var(--color-text)' }}>every Friday and Saturday</strong>. During these
              sessions, we passionately intercede for our congregation and community. All are welcome to join from the comfort of your home.
            </p>

            <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              During these sessions, we passionately intercede for:
            </p>

            {[
              'The diverse prayer requests submitted by our congregation.',
              'Prayer for healing of the sick.',
              'Comfort, strength, and relief for our elders suffering from various ailments.',
            ].map((point, i) => (
              <div key={i} className={styles.intercessionItem}>
                <span className={styles.intercessionDot} />
                <span>{point}</span>
              </div>
            ))}
          </div>

          {/* Zoom Details */}
          <h2 className={styles.sectionHeading}>Join on Zoom</h2>
          <div className={styles.zoomCard}>
            <div className={styles.zoomIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <div className={styles.zoomDetails}>
              <h3>Zoom Meeting Details</h3>
              <p>Open Zoom on any device and enter the details below to join:</p>
              <p><strong>Zoom ID:</strong> 218 382 5185</p>
              <p><strong>Passcode:</strong> 12345</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.87rem', opacity: 0.75 }}>
                Please join a few minutes before 7:00 PM. Mute your microphone on entry. This is a Zoom-only session — there is no in-person venue.
              </p>
            </div>
          </div>

          {/* Session Structure */}
          <h2 className={styles.sectionHeading}>Session Structure</h2>
          <p style={{ fontSize: '0.97rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Every session is structured to maximize our time in fellowship and intercession:
          </p>
          <div className={styles.serviceTable}>
            <div className={styles.serviceTableHeader}>
              <span>Duration</span>
              <span>Programme</span>
            </div>
            {sessionStructure.map((row, i) => (
              <div key={i} className={`${styles.serviceRow} ${i % 2 !== 0 ? styles.serviceRowAlt : ''}`}>
                <span className={styles.serviceTime}>{row.time}</span>
                <span className={styles.serviceSegment}>{row.segment}</span>
              </div>
            ))}
          </div>

          {/* July 2026 Speaker Schedule */}
          <h2 className={styles.sectionHeading}>July 2026 — Weekly Speaker &amp; Leader Lineup</h2>
          <p style={{ fontSize: '0.97rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Plan your attendance and support our leaders as they guide us in prayer and the Word this month.
          </p>
          <div className={styles.scheduleCard}>
            <div className={styles.scheduleHeader}>
              <span>Date &amp; Day</span>
              <span>Leader</span>
              <span>Speaker</span>
              <span>Worship</span>
            </div>
            {julySchedule.map((row, i) => (
              <div key={i} className={`${styles.scheduleRow} ${i % 2 !== 0 ? styles.scheduleRowAlt : ''}`}>
                <div>
                  <div className={styles.scheduleDate}>{row.date}</div>
                  <span className={styles.scheduleDay}>{row.day}</span>
                </div>
                <div className={styles.scheduleCell}>
                  <strong>Leader</strong>
                  {row.leader}
                </div>
                <div className={styles.scheduleCell}>
                  <strong>Speaker</strong>
                  {row.speaker}
                </div>
                <div className={styles.scheduleCell}>
                  <strong>Worship</strong>
                  {row.worship}
                </div>
              </div>
            ))}
          </div>

          {/* Contact / Prayer Request */}
          <div className={styles.contactCard}>
            <div className={styles.contactContent}>
              <h3>Connect &amp; Submit Prayer Requests</h3>
              <p>
                If you or your loved ones require prayer, please do not hesitate to reach out. We are here to pray with you and for you.
              </p>
              <p style={{ marginTop: '0.25rem', fontSize: '0.87rem', opacity: 0.75 }}>
                To submit a request, connect with us via call, WhatsApp, or email using the details on the right.
              </p>
            </div>
            <div className={styles.contactLinks}>
              <a href="tel:+917656852269" className={styles.contactLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.44 2 2 0 0 1 3.56 1.25h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.95a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call / WhatsApp: 7656852269
              </a>
              <a href="mailto:pastor@unionchurch.in" className={styles.contactLink}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                pastor@unionchurch.in
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
