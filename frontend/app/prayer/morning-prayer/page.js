import PageHeader from '@/components/PageHeader'
import styles from './morning-prayer.module.css'

export const metadata = {
  title: 'Morning Prayer | Church of Christ Union Church Bhubaneswar',
  description:
    'Join us for Morning Prayer every Monday through Saturday, 7:00 AM – 8:00 AM, at Union Church, Bhubaneswar — in-person and online via Zoom. Seek the Lord\'s face and intercede for one another.',
}

const serviceStructure = [
  { time: '15 Min', segment: 'Opening Prayer, Singing & Worship' },
  { time: '15 Min', segment: 'Sharing from God\'s Word (Message by the Day\'s Speaker)' },
  { time: '25 Min', segment: 'Sharing Prayer Points & Intercessory Prayer' },
  { time: '5 Min',  segment: 'Closing Prayer & Benediction' },
]

const weeks = [
  {
    label: 'Week 1 (July 1 – July 4)',
    days: [
      { date: '01.07.2026', day: 'Wednesday', presiding: 'Mr. Peter Digal',           speaker: 'Rev. Dr. Ayub Chhinchani',      special: null },
      { date: '02.07.2026', day: 'Thursday',  presiding: 'Mr. Sanjay Mallick',         speaker: 'Mr. Sanjeeb Kumar Das',         special: null },
      { date: '03.07.2026', day: 'Friday',    presiding: 'Rev. Dr. Ayub Chhinchani',   speaker: null,                            special: 'Testimony Time' },
      { date: '04.07.2026', day: 'Saturday',  presiding: 'Mr. Tapas Dey',              speaker: 'Rev. R P Pani',                 special: null },
    ],
  },
  {
    label: 'Week 2 (July 6 – July 11)',
    days: [
      { date: '06.07.2026', day: 'Monday',    presiding: 'Mr. Samuel Pradhan',         speaker: 'Mr. Asit Kumar Mohanty',        special: null },
      { date: '07.07.2026', day: 'Tuesday',   presiding: 'Mr. Subash Pradhan',         speaker: 'Mr. Ratan Kumar Das',           special: null },
      { date: '08.07.2026', day: 'Wednesday', presiding: 'Mrs. Minati Nanda',          speaker: 'Mrs. Leena Pramanik',           special: null },
      { date: '09.07.2026', day: 'Thursday',  presiding: 'Mr. Santanu Kumar Rout',     speaker: 'Mr. Sobhajan Pradhan',          special: null },
      { date: '10.07.2026', day: 'Friday',    presiding: 'Rev. Satish Kumar Pani',     speaker: null,                            special: 'Prayer Time' },
      { date: '11.07.2026', day: 'Saturday',  presiding: 'Mrs. Sudhanshubala Dash',    speaker: 'Rev. Dr. Binay Kumar Bardhan',  special: null },
    ],
  },
  {
    label: 'Week 3 (July 13 – July 18)',
    days: [
      { date: '13.07.2026', day: 'Monday',    presiding: 'Mr. Jalen Bardhan',          speaker: 'Mr. Samuel Pradhan',            special: null },
      { date: '14.07.2026', day: 'Tuesday',   presiding: 'Mr. Sanjay Mallick',         speaker: 'Mr. Swarajya Jena',             special: null },
      { date: '15.07.2026', day: 'Wednesday', presiding: 'Mrs. Gautami Chowdhury',     speaker: 'Mrs. Mamata Das',               special: null },
      { date: '16.07.2026', day: 'Thursday',  presiding: 'Mr. Sobhajan Pradhan',       speaker: 'Dr. J M Manna Whitson',         special: null },
      { date: '17.07.2026', day: 'Friday',    presiding: 'Rev. Dr. Ayub Chhinchani',   speaker: null,                            special: 'Testimony Time' },
      { date: '18.07.2026', day: 'Saturday',  presiding: 'Mr. Prasanta Das',           speaker: 'Mr. Tapas Dey',                 special: null },
    ],
  },
  {
    label: 'Week 4 (July 20 – July 25)',
    days: [
      { date: '20.07.2026', day: 'Monday',    presiding: 'Dr. Paul Kanhar',            speaker: 'Mr. Subash Chandra Barik',      special: null },
      { date: '21.07.2026', day: 'Tuesday',   presiding: 'Mr. Tapas Dey',              speaker: 'Rev. Binod Kumar',              special: null },
      { date: '22.07.2026', day: 'Wednesday', presiding: 'Mrs. Kamalini Pradhan',      speaker: 'Mrs. Minati Roul',              special: null },
      { date: '23.07.2026', day: 'Thursday',  presiding: 'Mr. Sanjay Mallick',         speaker: 'Mr. Prasad Tandy',              special: null },
      { date: '24.07.2026', day: 'Friday',    presiding: 'Rev. Satish Kumar Pani',     speaker: null,                            special: 'Prayer Time' },
      { date: '25.07.2026', day: 'Saturday',  presiding: 'Mr. Tapas Dey',              speaker: 'Elder Mr. Pradeep Roul',        special: null },
    ],
  },
  {
    label: 'Week 5 (July 27 – July 31)',
    days: [
      { date: '27.07.2026', day: 'Monday',    presiding: 'Mr. Samuel Pradhan',         speaker: 'Mr. Subash Ch Pradhan',         special: null },
      { date: '28.07.2026', day: 'Tuesday',   presiding: 'Rev. Sunil Kar',             speaker: 'Mr. Sobhajan Pradhan',          special: null },
      { date: '29.07.2026', day: 'Wednesday', presiding: 'Mr. Peter Digal',            speaker: 'Rev. Amos Pradhan',             special: null },
      { date: '30.07.2026', day: 'Thursday',  presiding: 'Mrs. Kamalini Pradhan',      speaker: 'Mrs. Sanghamitra Supakar',      special: null },
      { date: '31.07.2026', day: 'Friday',    presiding: 'Rev. Dr. Ayub Chhinchani',   speaker: null,                            special: 'Testimony Time' },
    ],
  },
]

export default function MorningPrayerPage() {
  return (
    <div>
      <PageHeader
        category="Prayer Wings"
        title="Morning Prayer"
        description="Anchoring our hearts in scripture, worship, and community prayer — every morning, Monday through Saturday."
      />

      {/* ── Content ── */}
      <section className="section">
        <div className={`container ${styles.contentContainer}`}>

          {/* Scripture Banner */}
          <div className={styles.scriptureBanner}>
            <p className={styles.scriptureText}>
              &ldquo;In the morning, Lord, You hear my voice; in the morning I lay my requests before You and wait expectantly.&rdquo;
            </p>
            <p className={styles.scriptureRef}>– Psalm 5:3</p>
          </div>

          {/* Info Banner */}
          <div className={styles.infoBanner}>
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Days</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Mon – Sat (Except Sunday)</p>
            </div>
            <div className={styles.infoDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Time</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>07:00 AM – 08:00 AM IST</p>
            </div>
            <div className={styles.infoDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Venue</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Church & Online (Zoom)</p>
            </div>
          </div>

          {/* About */}
          <div className={styles.aboutCard}>
            <p>
              At the <strong style={{ color: 'var(--color-text)' }}>Church of Christ (Union Church), Bhubaneswar</strong>, we believe there is
              no better way to face the day than by anchoring our hearts in scripture, worship, and community prayer. Whether you are seeking
              strength for the week ahead, peace in a time of trial, or simply want to fellowship with God, our doors and hearts are open.
            </p>
            <p>
              At Union Church, faithful worshippers come every day and pray for others&rsquo; needs and also for the State and the Nation.
              Even Jesus set an example for us as He used to pray early in the morning to His Father in Heaven.
            </p>
            <div className={styles.blockquote}>
              As a Church, the importance of Prayer is utmost in these days. Because as believers, we are going to face difficult days in the future.
              We need the power from above to face trials — and that power we can receive only when we are on our knees and pray.
            </div>
            <p>
              Join us as we gather to seek the Lord&rsquo;s face, lift up our community, and intercede for one another. Both our Pastors, Deacons,
              and other members of the Church share God&rsquo;s Word during this prayer time. Those who come regularly are thoroughly blessed.
            </p>
          </div>

          {/* Join via Zoom */}
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
              <p>You can join from anywhere in the world. Open Zoom and enter the details below:</p>
              <p><strong>Meeting ID:</strong> 218 382 5185</p>
              <p><strong>Password:</strong> 12345</p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.87rem', opacity: 0.75 }}>
                Please join a few minutes early to allow time to connect. Mute your microphone on entry.
              </p>
            </div>
          </div>

          {/* Service Structure */}
          <h2 className={styles.sectionHeading}>Service Structure</h2>
          <div className={styles.serviceTable}>
            <div className={styles.serviceTableHeader}>
              <span>Time</span>
              <span>Service Segment</span>
            </div>
            {serviceStructure.map((row, i) => (
              <div key={i} className={`${styles.serviceRow} ${i % 2 !== 0 ? styles.serviceRowAlt : ''}`}>
                <span className={styles.serviceTime}>{row.time}</span>
                <span className={styles.serviceSegment}>{row.segment}</span>
              </div>
            ))}
          </div>

          {/* July 2026 Schedule */}
          <h2 className={styles.sectionHeading}>July 2026 — Speaker &amp; Presiding Schedule</h2>
          <p style={{ fontSize: '0.97rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            Keep up with our daily leadership roster. Come prepared to support our leaders and receive the Word.
          </p>

          {weeks.map((week, wi) => (
            <div key={wi} className={styles.scheduleWeek}>
              <div className={styles.weekHeader}>{week.label}</div>
              {week.days.map((day, di) => (
                <div
                  key={di}
                  className={`${styles.scheduleRow} ${di % 2 !== 0 ? styles.scheduleRowAlt : ''}`}
                >
                  <div>
                    <div className={styles.scheduleDate}>{day.date}</div>
                    <div className={styles.scheduleDay}>{day.day}</div>
                  </div>
                  <div className={styles.scheduleName}>
                    <strong>Presiding</strong>
                    {day.presiding}
                  </div>
                  <div className={styles.scheduleName}>
                    {day.special ? (
                      <>
                        <strong>Special Focus</strong>
                        <span className={styles.specialFocus}>{day.special}</span>
                      </>
                    ) : (
                      <>
                        <strong>Speaker</strong>
                        {day.speaker}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* Closing Card */}
          <div className={styles.closingCard}>
            <p>
              We encourage you as a congregation to please make yourself available to this Morning Prayer whenever it is convenient for you.
              We look forward to lifting our voices with you tomorrow morning!
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
