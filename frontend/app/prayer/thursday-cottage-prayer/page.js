import PageHeader from '@/components/PageHeader'
import Link from 'next/link'
import styles from './thursday-cottage-prayer.module.css'

export const metadata = {
  title: 'Thursday Cottage Prayer | Church of Christ Union Church Bhubaneswar',
  description:
    'Every Thursday, Church of Christ (Union Church), Bhubaneswar gathers in 16 Prayer Zones across the city for Cottage Prayer Meetings — fellowship, worship, and intercession right in your neighborhood.',
}

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Rotating Home Hosting',
    desc: 'Every week, different houses within the same zone open their doors to host the meeting — fostering deep bonds and a true sense of extended family.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: 'Every Single Thursday',
    desc: 'These meetings take place throughout the entire year without a break — a consistent weekly rhythm of prayer and devotion in your neighborhood.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Community Intercession',
    desc: 'Each zone actively prays for their surrounding neighborhoods — interceding for those experiencing suffering, offering prayers for health and healing.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Collective Prayer Points',
    desc: "Along with local intercession, each zone prays for the collective prayer points shared by our Pastors in the Union Church WhatsApp group.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: 'Invited Speakers',
    desc: 'Speakers are invited by Prayer Coordinators in advance, planned for every 3–6 months, ensuring every meeting is enriched with the Word of God.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: 'Spiritual Growth',
    desc: 'These small-group gatherings are a wonderful opportunity to fellowship, study the Word, and grow in faith right within your local neighborhood.',
  },
]

export default function ThursdayCottagePrayerPage() {
  return (
    <div>
      <PageHeader
        category="Prayer Wings"
        title="Thursday Cottage Prayer"
        description="Gather in Fellowship — Grow in Faith. Every Thursday, across 16 zones throughout Bhubaneswar."
      />

      {/* ── Content ── */}
      <section className="section">
        <div className={`container ${styles.contentContainer}`}>

          {/* Info Banner */}
          <div className={styles.infoBanner}>
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Day</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Thursday</p>
            </div>
            <div className={styles.infoDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Prayer Zones</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>16 Zones Across Bhubaneswar</p>
            </div>
            <div className={styles.infoDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Format</p>
              <p style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Cottage (Home) Meetings</p>
            </div>
          </div>

          {/* About */}
          <div className={styles.aboutCard}>
            <p>
              Our Cottage Prayer meetings take place <strong style={{ color: 'var(--color-text)' }}>every single Thursday throughout the year</strong> at
              various locations across the city. These weekly small-group gatherings are a wonderful opportunity to fellowship, study the Word,
              and lift one another up in prayer right within your local neighborhood.
            </p>
            <p>
              Every week, different houses within the same zone open their doors to host the meeting. This rotating hospitality allows different
              families to welcome the fellowship into their households, fostering deep bonds and a true sense of extended family.
            </p>
            <div className={styles.blockquote}>
              Please tune up with your respective Zone Coordinators and kindly make it convenient to visit these Prayer meetings whenever possible.
            </div>
          </div>

          {/* Feature Grid */}
          <h2 className={styles.sectionHeading}>What Happens at a Cottage Prayer Meeting</h2>
          <div className={styles.featureGrid}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Prayer Zones */}
          <h2 className={styles.sectionHeading}>About Our Prayer Zones</h2>
          <div className={styles.zonesCard}>
            <div className={styles.zonesBadge}>
              <span className={styles.zonesBadgeNumber}>16</span>
              <span className={styles.zonesBadgeLabel}>Prayer Zones</span>
            </div>
            <div className={styles.zonesContent}>
              <p>
                To ensure everyone can find a spiritual home close by, our church is divided into{' '}
                <strong style={{ color: 'var(--color-text)' }}>16 Prayer Zones</strong> across Bhubaneswar. Each zone is led by dedicated
                Prayer Coordinators who are ready to welcome you. Want to join your local prayer zone? Simply find your location from the link
                below and get in touch with the respective Prayer Coordinator to get involved.
              </p>
              <Link href="/#prayer-zones" className={styles.zonesBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Find Your Zone
              </Link>
            </div>
          </div>

          {/* December Christmas */}
          <h2 className={styles.sectionHeading}>A Special December Celebration</h2>
          <div className={styles.christmasCard}>
            <div className={styles.christmasIcon}>🎄</div>
            <div className={styles.christmasContent}>
              <h3>Zonal Christmas Celebration</h3>
              <p>
                While we meet every week for prayer and devotion, the month of December brings a special festive joy. On one designated
                Thursday in December, every prayer zone hosts its own <strong>Zone Christmas Celebration</strong> — a beautiful time of
                festive fellowship, carols, sharing meals, and celebrating the birth of Christ together with neighbors and friends.
              </p>
            </div>
          </div>

          {/* Can't Find Your Zone CTA */}
          <div className={styles.ctaCard}>
            <h3>Can&rsquo;t Find Your Zone?</h3>
            <p>
              If you are unsure which zone your neighborhood falls under, or if you would like to host a Cottage Prayer meeting at your home,
              please reach out to the central church office or speak to us after the Sunday service.{' '}
              <strong>Come, let us pray and grow together!</strong>
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
