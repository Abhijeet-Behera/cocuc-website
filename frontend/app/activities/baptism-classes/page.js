export const metadata = {
  title: 'Baptism Classes | Church of Christ Union Church Bhubaneswar',
  description:
    'The Baptism Committee of the Church of Christ (Union Church), Bhubaneswar, guides believers in their spiritual journey towards Christian baptism through structured, Bible-based classes every Saturday.',
}

export default function BaptismClassesPage() {
  const leaders = [
    'Rev. Ayub Chinchani',
    'Rev. Songram Keshari Singh',
    'Rev. Satish Pani',
    'Evangelist Ranjit Singh',
    'Evangelist Pratap Kumar Sahoo',
  ]

  const topics = [
    'Sin',
    'Repentance',
    'Forgiveness',
    'Salvation',
    'The Holy Spirit',
  ]

  const contacts = [
    'Rev. Songram Keshari Singh',
    'Evangelist Ranjit Singh',
    'Secretary Er. Michael Rajesh Behera',
  ]

  const committee = [
    { name: 'Rev. Dr. Ayub Chhinchani', role: 'Convenor' },
    { name: 'Rev. Songram Keshari Singh', role: 'Co-Convenor' },
    { name: 'Rev. Satish Kumar Pani', role: 'Co-Convenor' },
    { name: 'Er. Michael Rajesh Behera', role: 'Secretary' },
    { name: 'Evangelist Pratap Kumar Sahoo', role: 'Member' },
    { name: 'Evangelist Ranjit Singh', role: 'Member' },
    { name: 'Mrs. Jeeta Pati', role: 'Member' },
    { name: 'Mr. Asit Kumar Mohanty', role: 'Member' },
    { name: 'Mrs. Alakananda Samantaray', role: 'Member' },
    { name: 'Mrs. Madhulita Samantaray', role: 'Member' },
    { name: 'Mrs. Anita Nayak', role: 'Member' },
    { name: 'Mrs. Swarnamoyee Patra', role: 'Member' },
  ]

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section
        style={{
          background:
            'linear-gradient(135deg, var(--color-primary-dark) 0%, #4a0000 60%, #1a0000 100%)',
          color: 'var(--color-white)',
          padding: '160px 0 110px 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20rem',
              height: '30rem',
              opacity: 0.04,
              pointerEvents: 'none',
              userSelect: 'none',
              zIndex: -1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              viewBox="0 0 24 36"
              style={{
                width: '100%',
                height: '100%',
                fill: 'currentColor',
              }}
            >
              <path d="M 9,0 H 15 V 9 H 24 V 15 H 15 V 36 H 9 V 15 H 0 V 9 H 9 Z" />
            </svg>
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              opacity: 0.7,
              marginBottom: '1rem',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Activities
          </p>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              marginBottom: '1.2rem',
              letterSpacing: '-0.02em',
            }}
          >
            Baptism Classes
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              opacity: 0.85,
              maxWidth: '580px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Guiding believers in their spiritual journey towards Christian baptism.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Schedule Banner */}
          <div
            style={{
              background:
                'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
              color: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 2rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '1.5rem',
              marginBottom: '3rem',
              boxShadow: '0 8px 24px rgba(128,0,0,0.2)',
            }}
          >
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Class Day</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Saturday</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Time</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>4:00 PM</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Venue</p>
              <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>First Floor, Amenity Hall</p>
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
              The <strong style={{ color: 'var(--color-text)' }}>Baptism Committee</strong> of the Church of Christ (Union Church), Bhubaneswar, is committed to guiding believers in their spiritual journey towards Christian baptism. The committee conducts Baptism Classes every Saturday at 4:00 PM in the First Floor of the Amenity Hall, providing a structured and Bible-based understanding of the Christian faith.
            </p>
            <p>
              Recognising the needs of believers residing outside Bhubaneswar, the church also conducts <strong style={{ color: 'var(--color-text)' }}>live Zoom Baptism Classes simultaneously</strong> with the in-person sessions, ensuring that everyone has an opportunity to participate regardless of their location.
            </p>
            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              Candidates become eligible to receive Holy Baptism after successfully completing <strong>three months of instruction</strong> or a minimum of <strong>twelve Baptism classes</strong>.
            </div>
            <p>
              Upon completion, candidates appear for a <strong style={{ color: 'var(--color-text)' }}>Baptism Interview</strong> conducted by the Baptism Committee to assess their understanding of the biblical teachings and their readiness to publicly confess their faith in Jesus Christ. Following their baptism, newly baptised members are presented with a <strong style={{ color: 'var(--color-text)' }}>Baptism Certificate</strong> along with the book <em>&ldquo;Basic Bible Doctrine&rdquo;</em> by Alban Douglas, and are dedicated to the church during the Odia Service.
            </p>
          </div>

          {/* Topics Covered */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Topics Covered
          </h2>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '3.5rem',
            }}
          >
            {topics.map((t) => (
              <span
                key={t}
                style={{
                  display: 'inline-block',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '50px',
                  background: 'rgba(128,0,0,0.07)',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  border: '1px solid rgba(128,0,0,0.15)',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Class Leaders */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Classes Led By
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
            {leaders.map((l, i) => (
              <div
                key={i}
                style={{
                  padding: '1rem 2rem',
                  borderBottom: i < leaders.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(128,0,0,0.015)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  fontSize: '1rem',
                }}
              >
                {l}
              </div>
            ))}
          </div>

          {/* Enrolment */}
          <div
            style={{
              background: 'rgba(128,0,0,0.04)',
              border: '1px solid rgba(128,0,0,0.12)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 2.5rem',
              marginBottom: '3.5rem',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              Enrolment — Contact Us
            </p>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
                marginBottom: '1rem',
              }}
            >
              Those who desire to enrol in the Baptism Classes may contact:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {contacts.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    color: 'var(--color-text)',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: 'var(--color-primary)',
                      flexShrink: 0,
                    }}
                  />
                  {c}
                </div>
              ))}
            </div>
          </div>

          {/* Committee Members */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Baptism Committee Members
          </h2>
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
              marginBottom: '1rem',
            }}
          >
            {committee.map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  padding: '1.1rem 2rem',
                  borderBottom: i < committee.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(128,0,0,0.015)',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{c.name}</span>
                <span
                  style={{
                    padding: '0.2rem 0.75rem',
                    borderRadius: '50px',
                    background: c.role === 'Member' ? 'rgba(0,0,0,0.04)' : 'rgba(128,0,0,0.08)',
                    color: c.role === 'Member' ? 'var(--color-text-muted)' : 'var(--color-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  {c.role}
                </span>
              </div>
            ))}
          </div>

          {/* What Scripture Says About Baptism */}
          <h2
            style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              marginTop: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            What Scripture Says About Baptism
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              marginBottom: '1rem',
            }}
          >
            {[
              {
                ref: 'Matthew 28:19 (NIV)',
                text: '\u201cTherefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.\u201d',
              },
              {
                ref: 'Colossians 2:11-12 (NLT)',
                text: '\u201cWhen you came to Christ, you were \u201ccircumcised,\u201d but not by a physical procedure. It was a spiritual procedure\u2013the cutting away of your sinful nature. For you were buried with Christ when you were baptized. And with him you were raised to a new life because you trusted the mighty power of God, who raised Christ from the dead.\u201d',
              },
              {
                ref: 'Romans 6:4 (NIV)',
                text: '\u201cWe were therefore buried with Him through baptism into death in order that, just as Christ was raised from the dead through the glory of the Father, we too may live a new life.\u201d',
              },
            ].map((v, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  padding: '2rem 2.5rem',
                }}
              >
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

        </div>
      </section>
    </div>
  )
}
