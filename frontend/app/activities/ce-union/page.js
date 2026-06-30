import PageHeader from '@/components/PageHeader'

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
        <div className="container" style={{ maxWidth: '880px', margin: '0 auto' }}>

          {/* Meeting info banner */}
          <div
            style={{
              background:
                'linear-gradient(90deg, #3d0055 0%, var(--color-primary-dark) 100%)',
              color: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 2rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.5rem',
              marginBottom: '3rem',
              boxShadow: '0 8px 24px rgba(61,0,85,0.3)',
            }}
          >
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Established</p>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>28 May 1972</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Weekly Meeting</p>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Tuesday @ 7 PM</p>
            </div>

            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}></p>
              <p style={{ fontSize: '1.05rem', fontWeight: 600 }}></p>
            </div>
          </div>

          {/* About */}
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              border: '1px solid rgba(0,0,0,0.05)',
              fontSize: '1.05rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.85,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              marginBottom: '3.5rem',
            }}
          >
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
            <p>
              Annual membership fee: Non-earning members &mdash; <strong style={{ color: 'var(--color-text)' }}>₹100</strong> &nbsp;|&nbsp;
              Earning members &mdash; <strong style={{ color: 'var(--color-text)' }}>₹200</strong> &nbsp;|&nbsp;
              Lifetime membership &mdash; <strong style={{ color: 'var(--color-text)' }}>₹1,000</strong>
            </p>
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
                    🎓 {adviser}
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
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
              marginBottom: '3.5rem',
            }}
          >
            {founders.map((f, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 2rem',
                  borderBottom:
                    i < founders.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(61,0,85,0.018)',
                }}
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3.5rem',
            }}
          >
            {/* Cardinal Principles */}
            <div
              style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid rgba(0,0,0,0.05)',
                padding: '2rem',
              }}
            >
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
            <div
              style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid rgba(0,0,0,0.05)',
                padding: '2rem',
              }}
            >
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
                        background: 'rgba(61,0,85,0.8)',
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
              marginBottom: '3.5rem',
            }}
          >
            {meetings.map((m, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--color-white)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.5rem 2rem',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
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
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              padding: '2rem 2.5rem',
              marginBottom: '3.5rem',
              fontSize: '1rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.8,
            }}
          >
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
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              padding: '2rem 2.5rem',
              fontSize: '1rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.8,
              marginBottom: '1rem',
            }}
          >
            The office bearers and executive members are elected or appointed for the tenure of two years in the General Body Meeting, held in the presence of the Chief Advisor and other Pastors.
          </div>

        </div>
      </section >
    </div >
  )
}
