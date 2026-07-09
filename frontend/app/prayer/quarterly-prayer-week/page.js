import PageHeader from '@/components/PageHeader'
import styles from './quarterly-prayer-week.module.css'

export const metadata = {
  title: 'Quarterly Prayer Week | Church of Christ Union Church Bhubaneswar',
  description:
    'Join Church of Christ (Union Church), Bhubaneswar for our Quarterly Prayer Week — gathering as one body every first week of a new quarter to intercede for mission fields, communities, and spiritual growth.',
}

const orderOfService = [
  { time: '00 – 20 Mins', segment: 'Opening Prayer, Singing & Worship' },
  { time: '20 – 35 Mins', segment: "Sharing from God's Word (Speaker of the Day)" },
  { time: '35 – 55 Mins', segment: 'Sharing Prayer Points & Intercessory Prayer' },
  { time: '55 – 60 Mins', segment: 'Closing Prayer & Benediction' },
]

const dailySchedule = [
  {
    date: 'Monday, 6th July 2026',
    focus: 'Mission Field – Mayurbhanj',
    presiding: 'Mr. Alekh Chandra Das',
    speaker: 'Mr. Sushil Kumar Deep',
    worship: 'Bethany Zone',
    intercession:
      'Pray for our evangelists laboring in Mayurbhanj, the breakthrough of the Gospel in tribal areas, and the local believers standing firm in faith.',
    isNew: false,
  },
  {
    date: 'Tuesday, 7th July 2026',
    focus: 'Mission Field – Jagatsinghpur',
    presiding: 'Mr. Swarajya Jena',
    speaker: 'Rev. Satyaranjan Singh',
    worship: 'Bethel Zone',
    intercession:
      "Pray for the spiritual revival of Jagatsinghpur, strength for the church-planting teams, and that the hearts of those attending the fellowships will be deeply rooted in God's Word.",
    isNew: false,
  },
  {
    date: 'Wednesday, 8th July 2026',
    focus: 'Mission Field – Kendrapada',
    presiding: 'Mr. K Subhashis Rao',
    speaker: 'Mr. Suman Das',
    worship: 'Youth Fellowship',
    intercession:
      'Pray for the expansion of the ministry in Kendrapada, protection over our evangelists, and a powerful awakening among the local community.',
    isNew: false,
  },
  {
    date: 'Thursday, 9th July 2026',
    focus: 'Mission Field – Nayagarh',
    presiding: 'Rev. Benjamin Das',
    speaker: 'Mr. Jayanta Kumar Nag',
    worship: 'Golgotha Zone',
    intercession:
      'Pray for the breaking of strongholds in Nayagarh, physical and emotional renewal for our ministry workers, and resources to meet the community\'s needs.',
    isNew: false,
  },
  {
    date: 'Friday, 10th July 2026',
    focus: 'New Mission Field – Jajpur',
    presiding: 'Mr. Sandeep Kumar Mohanty',
    speaker: 'Rev. Anishim Nayak',
    worship: 'Nazareth Zone',
    intercession:
      'Pray for favor and open doors as we prepare to launch this new mission field in Jajpur. Pray that the ground is fertile for the seed of the Gospel.',
    isNew: true,
  },
  {
    date: 'Saturday, 11th July 2026',
    focus: 'Odisha — State-wide Revival',
    presiding: 'Dn. Mr. Suranjan Thomas',
    speaker: 'Rev. Dr. Ayub Chhinchani',
    worship: 'Mizpah Zone',
    intercession:
      'Pray for our leaders, peace, and revival across Odisha. We will lift our eyes to the Lord for a sweeping spiritual awakening throughout the state.',
    isNew: false,
  },
]

export default function QuarterlyPrayerWeekPage() {
  return (
    <div>
      <PageHeader
        category="Prayer Wings"
        title="Quarterly Prayer Week"
        description="Lifting Our Hearts in Unity — gathering as one body each quarter to intercede for mission fields, communities, and generations."
      />

      <section className="section">
        <div className={`container ${styles.contentContainer}`}>

          {/* Scripture Banner */}
          <div className={styles.scriptureBanner}>
            <p className={styles.scriptureText}>
              &ldquo;The earnest prayer of a righteous person has great power and produces wonderful results.&rdquo;
            </p>
            <p className={styles.scriptureRef}>– James 5:16</p>
          </div>

          {/* Info Banner */}
          <div className={styles.infoBanner}>
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>When</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>First Week of Every New Quarter</p>
            </div>
            <div className={styles.infoDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>This Quarter</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>6th – 11th July 2026</p>
            </div>
            <div className={styles.infoDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Daily Time</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>07:00 PM IST</p>
            </div>
          </div>

          {/* About */}
          <div className={styles.aboutCard}>
            <p>
              The <strong style={{ color: 'var(--color-text)' }}>Church Quarterly Prayer Week</strong> takes place every first week of a new
              quarter. Join us as we gather as one body for six evenings of focused, mission-driven prayer.
            </p>
            <p>
              Each evening, we will direct our hearts toward specific mission fields, communities, and generations — interceding for
              transformation, protection, and spiritual growth. These are not ordinary prayer meetings; they are moments where the entire
              church family unites in purpose and faith.
            </p>
          </div>

          {/* Order of Service */}
          <h2 className={styles.sectionHeading}>Evening Order of Service</h2>
          <p style={{ fontSize: '0.97rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            We value your time and have structured our 1-hour corporate prayer to be focused and Spirit-led:
          </p>
          <div className={styles.serviceTable}>
            <div className={styles.serviceTableHeader}>
              <span>Time</span>
              <span>Segment</span>
            </div>
            {orderOfService.map((row, i) => (
              <div key={i} className={`${styles.serviceRow} ${i % 2 !== 0 ? styles.serviceRowAlt : ''}`}>
                <span className={styles.serviceTime}>{row.time}</span>
                <span className={styles.serviceSegment}>{row.segment}</span>
              </div>
            ))}
          </div>

          {/* Daily Schedule */}
          <h2 className={styles.sectionHeading}>Daily Schedule &amp; Prayer Focus — July 2026</h2>
          <p style={{ fontSize: '0.97rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            Each day is anchored to a specific mission field. Come prepared to intercede with purpose and faith.
          </p>
          <div className={styles.dayCards}>
            {dailySchedule.map((day, i) => (
              <div key={i} className={styles.dayCard}>
                <div className={`${styles.dayCardHeader} ${day.isNew ? styles.dayCardHeaderNew : ''}`}>
                  <div className={styles.dayCardDate}>
                    {day.date}
                    {day.isNew && <span className={styles.newBadge}>Upcoming Opening!</span>}
                  </div>
                  <span className={styles.dayCardFocus}>{day.focus}</span>
                </div>
                <div className={styles.dayCardBody}>
                  <div className={styles.dayCardField}>
                    <strong>Presiding</strong>
                    <span>{day.presiding}</span>
                  </div>
                  <div className={styles.dayCardField}>
                    <strong>Speaker</strong>
                    <span>{day.speaker}</span>
                  </div>
                  <div className={styles.dayCardField}>
                    <strong>Worship Led By</strong>
                    <span>{day.worship}</span>
                  </div>
                  <div className={styles.intercessionBox}>
                    <strong>Special Intercession</strong>
                    {day.intercession}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Closing CTA */}
          <div className={styles.ctaCard}>
            <p>
              We invite every member of our congregation to set aside these six evenings and come before the Lord together. Your prayers matter.
              Your presence strengthens the body. <strong>Come, let us lift our eyes to Him in unity!</strong>
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
