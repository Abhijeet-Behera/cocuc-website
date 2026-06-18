export const metadata = {
  title: 'Baptism Classes | Church of Christ Union Church Bhubaneswar',
  description: 'Learn about the biblical significance of water baptism and join our baptism classes held every Saturday.',
}

export default function BaptismClassesPage() {
  const scriptureVerses = [
    {
      ref: 'Matthew 28:19 (NIV)',
      text: '“Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.”'
    },
    {
      ref: 'Colossians 2:11-12 (NLT)',
      text: '“When you came to Christ, you were “circumcised,” but not by a physical procedure. It was a spiritual procedure–the cutting away of your sinful nature. For you were buried with Christ when you were baptized. And with him you were raised to a new life because you trusted the mighty power of God, who raised Christ from the dead.”'
    },
    {
      ref: 'Romans 6:4 (NIV)',
      text: '“We were therefore buried with Him through baptism into death in order that, just as Christ was raised from the dead through the glory of the Father, we too may live a new life.”'
    }
  ]

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, #4a0000 60%, #1a0000 100%)',
          color: 'var(--color-white)',
          padding: '160px 0 110px 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '28rem',
            opacity: 0.04,
            fontWeight: 900,
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
            fontFamily: 'serif',
          }}
        >
          ✝
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
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
            An outward confession of an inward experience, identifying with Christ.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
          
          {/* Class Schedule Banner */}
          <div
            style={{
              background: 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
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
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Class Timing</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Saturday @ 4:30 PM</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Instructors</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Rev. Ayub Chhinchani &amp; Rev. B.N. Satpathy</p>
            </div>
          </div>

          {/* Main Description */}
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
              Water Baptism is a significant step in the life of a Christian. It identifies the believer with the Godhead – Father, Son and Holy Spirit. It also identifies the believer with Christ in His death, burial and resurrection.
            </p>

            <p>
              Baptism is an act of obedience for the believer. It should be preceded by repentance, which simply means &ldquo;change.&rdquo; It is turning from our sin and selfishness to serve the Lord with purity. It means placing our pride, our past and all of our possessions before the Lord and giving the control of our lives over to Him.
            </p>

            <p>
              Water Baptism is a public testimony – the outward confession of an inward experience. In baptism, we stand before witnesses confessing our identification with the Lord. Jesus said, &ldquo;If you do not confess me before men, then I will not confess you before my Father, which is in Heaven.&rdquo;
            </p>

            <p>
              To guide those wishing to make this public declaration of faith, we have a dedicated <strong style={{ color: 'var(--color-text)' }}>Baptism Committee</strong> in the Church. We provide thorough, Bible-based classes for those seeking Baptism. Once the candidate is fully convinced of why they should take Water Baptism, the committee gives the consent for the candidate to be baptized.
            </p>

            <p>
              Both our Associate Pastors, <strong style={{ color: 'var(--color-text)' }}>Rev. Ayub Chhinchani</strong> and <strong style={{ color: 'var(--color-text)' }}>Rev. B.N. Satpathy</strong>, conduct these baptism classes every Saturday afternoon at <strong style={{ color: 'var(--color-text)' }}>4:30 PM</strong>. They teach candidates about the real significance of the Christian faith and why Baptism is necessary for every believer.
            </p>
          </div>

          {/* Scripture Cards */}
          <h2
            style={{
              fontSize: '1.8rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 750,
              color: 'var(--color-primary-dark)',
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            What Scripture Says About Baptism
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {scriptureVerses.map((v, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--color-white)',
                  borderLeft: '4px solid var(--color-primary)',
                  borderRadius: '0 var(--radius-lg) var(--radius-lg) 0',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid rgba(0,0,0,0.04)',
                  borderLeftWidth: '4px',
                }}
              >
                <p
                  style={{
                    fontStyle: 'italic',
                    fontSize: '1.1rem',
                    color: 'var(--color-text)',
                    lineHeight: 1.7,
                    marginBottom: '1rem',
                  }}
                >
                  {v.text}
                </p>
                <p
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--color-primary)',
                  }}
                >
                  — {v.ref}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
