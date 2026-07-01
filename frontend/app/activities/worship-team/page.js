import PageHeader from '@/components/PageHeader'
import styles from './worship-team.module.css'

export const metadata = {
  title: 'Worship Team | Church of Christ Union Church Bhubaneswar',
  description:
    'Church of Christ (Union Church), Bhubaneswar is blessed with two vibrant worship ministries — the Susamachar Sangita Dala (Odia Choir) and the English Choir Worship Team — that lead the congregation in praising and glorifying God.',
}

export default function WorshipTeamPage() {
  const odiaChoir = [
    { name: 'Mr. Asit Kumar Mohanty', role: 'Convenor' },
    { name: 'Mr. Pradeep Kumar Roul', role: 'Co-Convenor' },
    { name: 'Mrs. Swarnamayee Patra', role: 'Member' },
    { name: 'Mrs. Jharana Pradhan', role: 'Member' },
    { name: 'Mr. Gokula Chandra Pradhan', role: 'Member' },
    { name: 'Mr. Obed Ranjan Singh', role: 'Member' },
    { name: 'Mr. Benjamin Peter', role: 'Member' },
    { name: 'Mrs. Dheera Rani Supakar', role: 'Member' },
    { name: 'Er. Michael Rajesh Behera', role: 'Secretary' },
  ]

  const englishChoir = [
    { name: 'Mr. Santanu Kumar Mohanty', role: 'Convenor' },
    { name: 'Miss. Indira Patra', role: 'Co-Convenor' },
    { name: 'Mr. Adarsh Vasa', role: 'Member' },
    { name: 'Mrs. K. T. Mary', role: 'Member' },
    { name: 'Mr. Amlan Nag', role: 'Member' },
    { name: 'Mr. Vinod Mohanty', role: 'Member' },
    { name: 'Er. Michael Rajesh Behera', role: 'Secretary' },
  ]

  const MemberList = ({ members }) => (
    <div className={styles.membersCard}>
      {members.map((m, i) => (
        <div
          key={i}
          className={`${styles.membersRow} ${i % 2 !== 0 ? styles.membersRowAlt : ''}`}
          style={{
            borderBottom: i < members.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.98rem' }}>
            {m.name}
          </span>
          <span
            style={{
              padding: '0.2rem 0.8rem',
              borderRadius: '50px',
              background:
                m.role === 'Convenor' || m.role === 'Co-Convenor'
                  ? 'rgba(128,0,0,0.1)'
                  : m.role === 'Secretary, Church'
                    ? 'rgba(128,0,0,0.06)'
                    : 'rgba(0,0,0,0.04)',
              fontSize: '0.85rem',
              color: 'var(--color-primary)',
              fontWeight: 700,
              letterSpacing: '0.03em',
            }}
          >
            {m.role}
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <div>
      <PageHeader
        category="Activities"
        title="Worship Team"
        description="Leading the congregation in praising and glorifying God through music and worship."
      />

      {/* ── Content ── */}
      <section className="section">
        <div className={`container ${styles.contentContainer}`}>

          {/* Scripture Quote */}
          <div className={styles.quoteBanner}>
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', lineHeight: 1.75, marginBottom: '0.75rem' }}>
              &ldquo;Let everything that has breath praise the Lord. Praise the Lord!&rdquo;
            </p>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.85 }}>
              &mdash; Psalm 150:6
            </p>
          </div>

          {/* Intro */}
          <div className={styles.introCard}>
            The Church of Christ (Union Church), Bhubaneswar is blessed with{' '}
            <strong style={{ color: 'var(--color-text)' }}>two vibrant worship ministries</strong>{' '}
            that lead the congregation in praising and glorifying God through music and worship.
          </div>

          {/* Odia Choir */}
          <div
            style={{
              marginBottom: '3.5rem',
            }}
          >
            <div className={styles.choirHeader}>
              <div className={styles.headerAccent} />
              <div>
                <h2
                  style={{
                    fontSize: '1.45rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.15rem',
                  }}
                >
                  Odia Choir &mdash; Susamachar Sangita Dala
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Leading worship in Odia through gospel songs, hymns, and special musical presentations.
                </p>
              </div>
            </div>

            {/* Schedule strip */}
            <div className={styles.scheduleContainer}>
              {[
                { label: 'Leads Worship', value: 'During the Odia Service' },
                { label: 'Choir Practice', value: 'Every Saturday @ 7:00 PM' },
              ].map((s) => (
                <div key={s.label} className={styles.scheduleCard}>
                  <p style={{ fontSize: '0.7rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: 'var(--color-primary-dark)',
                fontWeight: 700,
                marginBottom: '0.6rem',
              }}
            >
              Committee Members
            </p>
            <MemberList members={odiaChoir} />
          </div>

          {/* English Choir */}
          <div
            style={{
              marginBottom: '3.5rem',
            }}
          >
            <div className={styles.choirHeader}>
              <div className={styles.headerAccent} />
              <div>
                <h2
                  style={{
                    fontSize: '1.45rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    color: 'var(--color-primary-dark)',
                    marginBottom: '0.15rem',
                  }}
                >
                  English Choir &mdash; Worship Team
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Leading the congregation in contemporary and traditional worship songs during the English Service.
                </p>
              </div>
            </div>

            {/* Schedule strip */}
            <div className={styles.scheduleContainer}>
              {[
                { label: 'Leads Worship', value: 'During the English Service' },
                { label: 'Choir Practice', value: 'Every Friday @ 7:00 PM' },
              ].map((s) => (
                <div key={s.label} className={styles.scheduleCard}>
                  <p style={{ fontSize: '0.7rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: 'var(--color-primary-dark)',
                fontWeight: 700,
                marginBottom: '0.6rem',
              }}
            >
              Committee Members
            </p>
            <MemberList members={englishChoir} />
          </div>

          {/* Purpose */}
          <div className={styles.purposeCard}>
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              Purpose of Both Choir Ministries
            </p>
            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.8,
              }}
            >
              To <strong style={{ color: 'var(--color-text)' }}>glorify God</strong>, strengthen fellowship among believers, and use music as a ministry to spread the message of salvation. Both choirs play an integral role in the worship life of the Church of Christ (Union Church), fostering unity, discipleship, and a spirit of praise as they minister through music and lead the congregation in worship.
            </p>
          </div>

          {/* Join CTA */}
          <div className={styles.ctaCard}>
            <div>
              <p
                style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: '0.4rem',
                }}
              >
                Interested in Joining?
              </p>
              <p style={{ fontSize: '0.98rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                If you are willing to join the Odia or English Choir Worship Team, please connect with the respective <strong style={{ color: 'var(--color-text)' }}>Convenor or Co-Convenor</strong> listed above.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
