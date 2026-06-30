import PageHeader from '@/components/PageHeader'
import styles from './ce-union.module.css'

export const metadata = {
  title: 'C.E Union | Church of Christ Union Church Bhubaneswar',
  description:
    'The Christian Endeavour (CE) Union at Church of Christ Union Church, Bhubaneswar, established since 28 May 1972 — gathering in fellowship, prayer, and service to strengthen young believers for Christ and His Church.',
}

export default function CEUnionPage() {
  const founders = [
    { name: 'Mr. Daniel Das', note: '' },
    { name: 'Mr. Bidyut Kumar Pramanik', note: '' },
    { name: 'Mr. Elin Kumar Rout', note: '1st President' },
    { name: 'Mr. Paresh Kumar Das', note: '' },
    { name: 'Late Mr. Binoy Kumar Muduli', note: '' },
    { name: 'Mr. David Kamal Pradhan', note: '' },
    { name: 'Mr. Jayanta Das', note: '1st Secretary' },
    { name: 'Mrs. Sudhamati Pradhan', note: '' },
  ]

  const cardinalPrinciples = [
    'Confession of Christ',
    'Service for Christ',
    "Loyalty to Christ's Church",
    "Fellowship with all Christ's people",
  ]

  const essentials = [
    'Weekly devotional meeting',
    'Monthly consecration service',
    'The covenant of pledge',
    'Committee work',
  ]

  const meetings = [
    {
      freq: 'Weekly — Every Tuesday',
      title: 'CE Prayer Meeting',
      desc: 'CE prayer meeting every Tuesday at 7:00 PM at COCUC Bhubaneswar, continuing since 28 May 1972.',
    },
    {
      freq: 'Weekly — Every Sunday',
      title: 'Sangeet Upasana',
      desc: 'Sangeet Upasana held by Boithak Committee members of CE in the home of an invited family at 7:00 PM.',
    },
    {
      freq: 'Monthly — First Tuesday',
      title: 'Consecration Service',
      desc: 'Our Pastors lead the consecration service and the meeting concludes by announcing the Oath of CE.',
    },
    {
      freq: 'Annual — 2nd February',
      title: 'World CE Prayer Day',
      desc: 'Observed every year on 2nd February with a morning service and Flag Hoisting with our respected elder brothers of CE at COCUC Bhubaneswar.',
    },
    {
      freq: 'Annual',
      title: 'Annual Picnic',
      desc: 'Once a year, CE and Church members visit outside together for fellowship and fun.',
    },
    {
      freq: 'Annual — 28th May',
      title: 'Local CE Day',
      desc: 'Celebrated on 28th May with a three-day programme: two days of revival meetings featuring invited resource persons, concluding in a love feast with a cultural programme on the 3rd day. Brothers and sisters who have served are honoured with momentos.',
    },
  ]



  return (
    <div>
      <PageHeader
        category="Activities"
        title="C.E Union"
        description="Christian Endeavour Union — established 28 May 1972, gathering young believers in fellowship, prayer, and service for Christ and His Church."
      />

      {/* ── Content ── */}
      <section className="section">
        <div className={`container ${styles.contentContainer}`}>

          {/* Meeting info banner */}
          <div className={styles.infoBanner}>
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Established</p>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>28 May 1972</p>
            </div>
            <div className={styles.infoDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Weekly Meeting</p>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Tuesday @ 7 PM</p>
            </div>
          </div>

          {/* About */}
          <div className={styles.aboutCard}>
            <p>
              The Christian endeavour (CE) union was established on  <strong style={{ color: 'var(--color-text)' }}>28th Of May, 1972</strong> at <strong style={{ color: 'var(--color-text)' }}>Church of Christ (Union Church), Bhubaneswar</strong>.
              For over five decades we have gathered in fellowship, prayer and service to
              strengthen young believers for Christ and His Church.
            </p>
            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              CE is a training platform to equip and prepare all members and young people for
              service in Christ and in the Church. There is no age bar for members in CE Union
              Bhubaneswar.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Annual membership fee:</span>
              <div className={styles.membershipContainer}>
                <span className={styles.membershipBox}>
                  Non-earning members — <strong style={{ color: 'var(--color-primary)' }}>₹100</strong>
                </span>
                <span className={styles.membershipBox}>
                  Earning members — <strong style={{ color: 'var(--color-primary)' }}>₹200</strong>
                </span>
                <span className={styles.membershipBox}>
                  Lifetime membership — <strong style={{ color: 'var(--color-primary)' }}>₹1,000</strong>
                </span>
              </div>
            </div>
          </div>

          {/* CE Union */}
          <div style={{ background: 'var(--color-white)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.04)', marginBottom: '3.5rem' }}>
            <h2 className="section-title-elegant" style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <span className="title-normal">Christian Endeavour </span>
              <em className="title-italic">Union (CE)</em>
            </h2>
            <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
              Newly elected CE board members for the year 2026 to 2028
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {[
                { label: "President", name: "Dr Purnananda Pradhan" },
                { label: "Vice President", name: "Santanu Kumar Rout" },
                { label: "Secretary", name: "Rev Amos Pradhan" },
                { label: "Asst Secy", name: "Samuel K Pradhan" },
                { label: "Treasurer", name: "Benjamin Chouhan" },
                { label: "Lookout Com Secy", name: "Smrutirekha Pradhan" },
                { label: "Lookout Asst Secy", name: "Kalpita Pradhan" },
                { label: "Social Com Secy", name: "Kabita Das" },
                { label: "Social Com Secy", name: "Sudipta Pradhan" },
                { label: "Boithak Secy", name: "John Augustin Nayak" },
                { label: "Programme Com Secy", name: "Sujoy kumar" },
                { label: "Auditor", name: "Ratan Dash" }
              ].map((item, idx) => (
                <div key={idx} style={{ background: 'linear-gradient(135deg, rgba(128,0,0,0.01) 0%, rgba(128,0,0,0.03) 100%)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(128,0,0,0.04)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', textTransform: 'uppercase', display: 'block', fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)' }}>{item.name}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text)', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)', textAlign: 'center', fontWeight: 700 }}>CE Union Advisers</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
                {[
                  "Rev Songram K. Singh",
                  "Rev. Dr. Ayub Chhinchani",
                  "Rev. Satish Kumar Pani",
                  "Joachim Manas Ranjan",
                  "Asit Kumar Mohanty",
                  "Asish Das",
                  "Ranjan Kumar Nayak"
                ].map((adviser, idx) => (
                  <span key={idx} style={{ background: 'var(--color-surface)', border: '1px solid rgba(0,0,0,0.05)', padding: '0.5rem 1.25rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text)' }}>
                    {adviser}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Founder Members */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Founder Members of CE Union Bhubaneswar
          </h2>
          <div className={styles.foundersCard}>
            {founders.map((f, i) => (
              <div
                key={i}
                className={`${styles.foundersRow} ${i % 2 !== 0 ? styles.foundersRowAlt : ''}`}
              >
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{f.name}</span>
                {f.note && (
                  <span
                    style={{
                      padding: '0.2rem 0.75rem',
                      borderRadius: '50px',
                      background: 'rgba(128,0,0,0.08)',
                      color: 'var(--color-primary)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    {f.note}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Cardinal Principles & Essentials side by side */}
          <div className={styles.principlesGrid}>
            {/* Cardinal Principles */}
            <div className={styles.principleCard}>
              <h2
                style={{
                  fontSize: '1.2rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: '1.25rem',
                }}
              >
                Four Cardinal Principles of CE
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {cardinalPrinciples.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'var(--color-primary)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: '0.1rem',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.97rem', lineHeight: 1.5 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Four Essentials */}
            <div className={styles.principleCard}>
              <h2
                style={{
                  fontSize: '1.2rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: '1.25rem',
                }}
              >
                Four Essentials of CE
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {essentials.map((e, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: 'var(--color-primary)',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: '0.1rem',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.97rem', lineHeight: 1.5 }}>{e}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regular Meetings & Services */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Regular Meetings &amp; Services
          </h2>
          <div className={styles.meetingsContainer}>
            {meetings.map((m, i) => (
              <div key={i} className={styles.meetingCard}>
                <p
                  style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    marginBottom: '0.3rem',
                  }}
                >
                  {m.freq}
                </p>
                <p
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {m.title}
                </p>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            ))}
          </div>



          {/* Service & Outreach */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Service &amp; Outreach
          </h2>
          <div className={styles.outreachCard}>
            <p>
              CE members are ready to help those in need — physically, mentally, and financially — whenever possible. We actively participate in:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
              {['Burial assistance', 'Medical aid', 'Blood donation drives', 'Patient care support'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--color-primary)',
                      flexShrink: 0,
                    }}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Governance */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Governance
          </h2>
          <div className={styles.governanceCard}>
            The office bearers and executive members are elected or appointed for the tenure of two years in the General Body Meeting, held in the presence of the Chief Advisor and other Pastors.
          </div>

        </div>
      </section >
    </div >
  )
}
