export const metadata = {
  title: 'Youth Fellowship | Church of Christ Union Church Bhubaneswar',
  description: 'Our youth fellowship is dedicated to spreading the message of hope and peace through Jesus Christ.',
}

export default function YouthFellowshipPage() {
  const scriptureVerses = [
    {
      ref: 'Philippians 4:7 (KJV)',
      text: '“And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.”'
    },
    {
      ref: 'John 14:6 (KJV)',
      text: '“Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.”'
    }
  ]

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, #3a0022 60%, #11000b 100%)',
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
            Youth Fellowship
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
            Empowering the next generation to share the Gospel of Jesus Christ.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
          
          {/* Proclamation Card */}
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              border: '1px solid rgba(0,0,0,0.05)',
              fontSize: '1.1rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.9,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.8rem',
              marginBottom: '3.5rem',
            }}
          >
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-primary-dark)', textAlign: 'center', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem' }}>
              The message of the Gospel is Jesus, Jesus, Jesus, and only JESUS!
            </p>

            <p>
              The momentous truth has never been clearer: we must get the Gospel out with all speed and intensity! We must tell a lost and frightened humanity that there is hope, and His name is Jesus Christ, the Son of God!
            </p>

            <p>
              We must tell lost and bound humanity that there is a way out, and His name is Jesus! We must tell them that there is only one door through which they can enter and find peace of mind, peace of soul, and safety, and His name is Jesus!
            </p>

            <div
              style={{
                borderLeft: '4px solid var(--color-primary)',
                paddingLeft: '1.5rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
                fontSize: '1.2rem',
                lineHeight: 1.6,
                margin: '1rem 0',
              }}
            >
              The world is crying for peace that &ldquo;passeth all understanding&rdquo;, and the only way they can find that peace is through the Prince of Peace, Jesus Christ.
            </div>

            <p>
              The Son of Almighty God said: &ldquo;I am the way, the truth, and the life: no man cometh unto the Father, but by me.&rdquo; This is the message the world wants to hear; it is the message they must hear. And it is the message we must preach!
            </p>
          </div>

          {/* Scripture references */}
          <h2
            style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}
          >
            Biblical Foundation
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
