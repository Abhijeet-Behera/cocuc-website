import PageHeader from '@/components/PageHeader'
import styles from './secretary.module.css'

export const metadata = {
  title: "Secretary's Corner | Church of Christ Union Church Bhubaneswar",
  description:
    "A warm welcome message from the Secretary of Church of Christ (Union Church), Bhubaneswar — Er. Michael Rajesh Behera.",
}

export default function SecretarysCornerPage() {
  return (
    <div>
      <style>{`
        @media (max-width: 768px) {
          .responsive-card { padding: 1.5rem !important; }
          .responsive-banner { padding: 2rem 1.5rem !important; }
          .responsive-title { font-size: 2.2rem !important; }
        }
        .secretary-phone-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.5rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--color-primary);
          background: rgba(128,0,0,0.06);
          border: 1px solid rgba(128,0,0,0.12);
          border-radius: 50px;
          padding: 0.35rem 1rem;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .secretary-phone-link:hover {
          background: var(--color-primary) !important;
          color: #ffffff !important;
        }
      `}</style>
      <PageHeader
        category="From the Secretary's Desk"
        title="Secretary's Corner"
        description="Church of Christ, Union Church — Worship, Fellowship & Witness"
      />

      {/* ── Letter Section ── */}
      <section className="section">
        <div className={`container ${styles.letterWrapper}`}>

          {/* ── Church Header Card ── */}
          <div
            className="responsive-card"
            style={{
              background: 'linear-gradient(160deg, #fffdf9 0%, #fdf6ee 100%)',
              border: '1px solid rgba(128,0,0,0.10)',
              borderRadius: '20px',
              padding: '2.5rem 3rem',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(128,0,0,0.06)',
              position: 'relative',
            }}
          >
            {/* Top accent bar */}
            <div className={styles.headerAccentBar} />

            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                letterSpacing: '0.03em',
                marginBottom: '0.35rem',
              }}
            >
              Church of Christ, Union Church
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.82rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--color-text-muted)',
              }}
            >
              Worship &bull; Fellowship &bull; Witness
            </p>
          </div>

          {/* ── Main Letter Card ── */}
          <div
            className="responsive-card"
            style={{
              background: 'linear-gradient(160deg, #ffffff 0%, #fffaf5 100%)',
              border: '1px solid rgba(128,0,0,0.09)',
              borderRadius: '20px',
              padding: '3rem 3.5rem',
              boxShadow: '0 6px 30px rgba(128,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
              position: 'relative',
            }}
          >
            {/* Top accent bar */}
            <div className={styles.letterAccentBar} />

            {/* Salutation */}
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--color-primary)',
                marginBottom: '2rem',
                fontStyle: 'italic',
              }}
            >
              Dear friends,
            </p>

            {/* Body paragraphs */}
            {[
              'Greetings to you on behalf of the Pastors & leaders of Church of Christ, Union Church, Bhubaneswar.',
              "It's a joy & privilege for me to welcome you to this online facility service.",
              'Church of Christ (Union Church) is interdenominational, Bible centered, Christ-centered, peace-loving, open to providing spiritual help or prayer support, counseling to anyone aspiring to know GOD or about the eternal Salvation he has provided to mankind, and overall non-promoting of any religion but committed to nation-building or fulfilling of GOD\'s divine Will, and thereby enhancing GOD\'S Kingdom purposes for the good of one & all.',
              'The details on Worship, prayer meetings, events for children, youth, women, elders, families, media & social work related endeavours, festive events, etc., can all be found in this web site.',
              'This GOD-given premises/Church has been a blessing since year 1964, to many & believe will continue to be so for all the generations to come, for his own glory.',
              'If you have been staying in Bhubaneswar or visiting Bhubaneswar, please don\'t hesitate to come over to visit this "house of prayer" and be blessed! For any details please contact me or any of the Pastors!',
            ].map((para, i) => (
              <p key={i} className={styles.paraText}>
                {para}
              </p>
            ))}

            {/* Closing */}
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1.1rem',
                fontStyle: 'italic',
                color: 'var(--color-text-muted)',
                marginTop: '2rem',
                marginBottom: '0.35rem',
              }}
            >
              With thanks &amp; prayers,
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '1rem',
                fontStyle: 'italic',
                color: 'var(--color-text-muted)',
                marginBottom: '2rem',
              }}
            >
              Yours in His service,
            </p>

            {/* Ornamental divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                margin: '0.5rem 0 2rem',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(128,0,0,0.2))' }} />
              <span style={{ color: 'var(--color-primary)', fontSize: '1.1rem', opacity: 0.5 }}>✝</span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(128,0,0,0.2))' }} />
            </div>

            {/* Signature block */}
            <div>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  marginBottom: '0.2rem',
                  letterSpacing: '0.01em',
                }}
              >
                Er. Michael Rajesh Behera
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--color-text-muted)',
                  marginBottom: '0.15rem',
                }}
              >
                Secretary, Church of Christ
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.88rem',
                  color: 'var(--color-text-muted)',
                  marginBottom: '0.15rem',
                }}
              >
                Union Church, Bhubaneswar
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href="tel:+919439919188"
                  className="secretary-phone-link"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.92 5.92l.72-.72a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  +91 9439919188
                </a>
                <a
                  href="tel:+917337377288"
                  className="secretary-phone-link"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.92 5.92l.72-.72a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  +91 7337377288
                </a>
              </div>
            </div>
          </div>

          {/* ── Key Pillars Cards ── */}
          <div>
            <h2 className={styles.pillarsTitle}>
              Our Core Identity
            </h2>

            <div className={styles.pillarsGrid}>
              {[
                { icon: '📖', title: 'Bible Centered', desc: 'Grounded in the unchanging truth of Scripture.' },
                { icon: '✝', title: 'Christ Centered', desc: 'Jesus Christ at the heart of all we do.' },
                { icon: '🕊️', title: 'Peace Loving', desc: 'Committed to unity, grace, and harmony.' },
                { icon: '🤝', title: 'Interdenominational', desc: 'Open to all who seek the living God.' },
                { icon: '🙏', title: 'Prayer & Counsel', desc: 'Available for spiritual help to anyone who seeks.' },
                { icon: '🇮🇳', title: 'Nation Building', desc: "Fulfilling God\u2019s divine will for our community." },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: 'linear-gradient(160deg, #fffdf9 0%, #fdf6ee 100%)',
                    border: '1px solid rgba(128,0,0,0.08)',
                    borderRadius: '16px',
                    padding: '1.5rem 1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    boxShadow: '0 2px 12px rgba(128,0,0,0.04)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: '1.25rem', right: '1.25rem', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(128,0,0,0.22), transparent)', borderRadius: '0 0 2px 2px' }} />
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                    }}
                  >
                    {item.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.85rem',
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Since 1964 Banner ── */}
          <div
            className="responsive-banner"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
              borderRadius: '20px',
              padding: '2.5rem 3rem',
              textAlign: 'center',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                right: '-1.5rem',
                bottom: '-2rem',
                fontSize: '12rem',
                color: 'rgba(255,255,255,0.05)',
                fontFamily: 'serif',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              ✝
            </div>
            <p
              className="responsive-title"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: '3rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                marginBottom: '0.5rem',
              }}
            >
              Since 1964
            </p>
            <p className={styles.bannerDesc}>
              A GOD-given house of prayer — a blessing to generations past, present, and those yet to come.
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
