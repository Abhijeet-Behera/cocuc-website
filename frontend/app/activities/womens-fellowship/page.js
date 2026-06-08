export const metadata = {
  title: 'Women’s Fellowship | Church of Christ Union Church Bhubaneswar',
  description: 'Learn about our Mahila Sabha (Women’s Fellowship), meeting schedules, committee members, and regular prayers.',
}

export default function WomensFellowshipPage() {
  const committee = [
    { name: 'Ms. Sanjukta Sahu', role: 'President' },
    { name: 'Ms. Asima Pradhan', role: 'Vice-President' },
    { name: 'Ms. Kabita Das', role: 'Secretary' },
    { name: 'Ms. Sanchita Samantaray', role: 'Treasurer' },
    { name: 'Vacant', role: 'Joint-Secretary' }
  ]

  const weeklySchedule = [
    { type: 'Regular Weekly Meeting', time: 'Every Saturday @ 4:00 PM', desc: 'Devotional songs, testimonies, Bible message and prayers.' },
    { type: 'Chain Prayer', time: '2nd Saturday of the month @ 11:00 AM – 12:00 PM', desc: 'Special times of corporate intercessory prayers.' },
    { type: 'Fasting Prayer', time: 'Last Saturday of the month @ 11:00 AM – 1:00 PM', desc: 'A dedicated time for fasting, prayer, and spiritual encouragement.' }
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
            Women&rsquo;s Fellowship
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
            Nurturing, praying, and supporting the family and the Church of Christ.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
          
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
              A mother is an integral and precious part of any family. In fact, mothers are simply priceless. They are the real backbone of any family as they hold the family together. Mothers who pray regularly for the needs of others hold the Church in good shape too.
            </p>

            <p>
              The women&rsquo;s fellowship meets <strong style={{ color: 'var(--color-text)' }}>every Saturday at 4:00 PM</strong> in the Church. However, on the <strong style={{ color: 'var(--color-text)' }}>2nd Saturday</strong> of the month, the ladies gather for a time of Chain Prayer from 11:00 AM till 12:00 PM. On the <strong style={{ color: 'var(--color-text)' }}>last Saturday</strong> of the month, they meet between 11:00 AM and 1:00 PM for a Fasting Prayer.
            </p>

            <p>
              We should be really thankful to our mothers and sisters for praying for us and for the Church. The selection procedure for the new office bearers is in progress. They have a Program Schedule for every 6 months, and speakers are invited in advance to speak at these meetings. Their service includes devotional songs, testimonies, messages from God&rsquo;s Word, and prayer. Our Associate Pastors give their valuable time for the ladies fellowship and encourage them through their teachings.
            </p>

            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              Every year, they have a Women&rsquo;s Retreat and Mahila Divas, which is observed during a Sunday Odia Worship. In 2017, for the 1st time, the Mahila Samiti started the Christmas Celebrations in December with a host of events. Apart from that, some of the mothers visit the sick on Wednesday afternoons where there is an urgent need to pray.
            </div>

            <p>
              Please keep our Mahila Samiti (Women&rsquo;s Fellowship) in your prayers always.
            </p>
          </div>

          {/* Meeting Schedules */}
          <h2
            style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              marginBottom: '1.5rem',
            }}
          >
            Fellowship &amp; Prayer Schedule
          </h2>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              marginBottom: '3.5rem',
            }}
          >
            {weeklySchedule.map((s, idx) => (
              <div
                key={idx}
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
                    fontSize: '0.8rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    marginBottom: '0.3rem',
                  }}
                >
                  {s.type}
                </p>
                <p
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {s.time}
                </p>
                <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Office Bearers */}
          <h2
            style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              marginBottom: '1.5rem',
            }}
          >
            Mahila Sabha Office Bearers (2018 Elections)
          </h2>
          
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
              marginBottom: '2rem'
            }}
          >
            {committee.map((c, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1.25rem 2rem',
                  borderBottom: i < committee.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(128,0,0,0.015)',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{c.name}</span>
                <span
                  style={{
                    padding: '0.2rem 0.75rem',
                    borderRadius: '50px',
                    background: c.name === 'Vacant' ? 'rgba(0,0,0,0.05)' : 'rgba(128,0,0,0.08)',
                    color: c.name === 'Vacant' ? 'var(--color-text-muted)' : 'var(--color-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {c.role}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
