import PageHeader from '@/components/PageHeader'
import Link from 'next/link'
import { Phone, BookOpen } from 'lucide-react'

export const metadata = {
  title: "Secretary's Corner | Church of Christ Union Church Bhubaneswar",
  description: "Greetings, updates, and foundational core identities from the Desk of the Church Secretary, Er. Michael Rajesh Behera.",
}

export default function SecretaryCornerPage() {
  const identities = [
    {
      icon: <BookOpen size={24} style={{ color: 'var(--color-primary)' }} />,
      title: 'Bible Centered',
      description: 'Grounded in the unchanging truth of Scripture.',
    },
    {
      icon: <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)' }}>†</span>,
      title: 'Christ Centered',
      description: 'Jesus Christ at the heart of all we do.',
    },
    {
      icon: <span style={{ fontSize: '24px' }}>🕊️</span>,
      title: 'Peace Loving',
      description: 'Committed to unity, grace, and harmony.',
    },
    {
      icon: <span style={{ fontSize: '24px' }}>🤝</span>,
      title: 'Interdenominational',
      description: 'Open to all who seek the living God.',
    },
    {
      icon: <span style={{ fontSize: '24px' }}>🙏</span>,
      title: 'Prayer & Counsel',
      description: 'Available for spiritual help to anyone who seeks.',
    },
    {
      icon: <span style={{ fontSize: '18px', fontWeight: '800', color: '#64748b' }}>IN</span>,
      title: 'Nation Building',
      description: 'Fulfilling God\'s divine will for our community.',
    },
  ]

  return (
    <div style={{ backgroundColor: '#fcfaf7', minHeight: '100vh', paddingBottom: '4rem' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .phone-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #fff5f5;
          border: 1px solid rgba(139, 0, 0, 0.15);
          border-radius: 30px;
          padding: 0.6rem 1.25rem;
          color: var(--color-primary);
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(139, 0, 0, 0.04);
        }
        .phone-pill:hover {
          background-color: var(--color-primary) !important;
          color: #ffffff !important;
        }
        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(139, 0, 0, 0.08) !important;
          border-color: rgba(139, 0, 0, 0.15) !important;
        }
      `}} />
      <PageHeader
        category="About"
        title="Secretary's Corner"
        description="Greetings and administrative updates from the Desk of the Church Secretary."
      />

      <div className="container" style={{ maxWidth: '960px', margin: '3rem auto 0 auto', padding: '0 1rem' }}>
        {/* ── Top Header Box ── */}
        <div
          style={{
            backgroundColor: '#fffdfb',
            border: '1px solid rgba(139, 0, 0, 0.08)',
            borderRadius: '20px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(139, 0, 0, 0.02)',
            marginBottom: '2.5rem',
          }}
        >
          <h2
            style={{
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              fontWeight: '800',
              marginBottom: '0.5rem',
              letterSpacing: '-0.01em',
            }}
          >
            Church of Christ, Union Church
          </h2>
          <p
            style={{
              fontSize: '0.85rem',
              letterSpacing: '0.25em',
              fontWeight: '600',
              color: '#555555',
              textTransform: 'uppercase',
            }}
          >
            Worship • Fellowship • Witness
          </p>
        </div>

        {/* ── Main Letter Card ── */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid rgba(139, 0, 0, 0.06)',
            borderRadius: '24px',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.04)',
            marginBottom: '4.5rem',
          }}
        >
          <div
            style={{
              fontSize: '1.08rem',
              color: '#334155',
              lineHeight: 1.8,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.6rem',
              fontFamily: 'var(--font-body)',
            }}
          >
            <h3
              style={{
                fontSize: '1.8rem',
                color: 'var(--color-primary)',
                fontStyle: 'italic',
                fontFamily: 'var(--font-heading)',
                fontWeight: '700',
                marginBottom: '0.5rem',
              }}
            >
              Dear friends,
            </h3>

            <p>
              Greetings to you on behalf of the Pastors & leaders of Church of Christ, Union Church, Bhubaneswar.
            </p>

            <p>
              It's a joy & privilege for me to welcome you to this online facility service.
            </p>

            <p>
              Church of Christ (Union Church) is interdenominational, Bible centered, Christ-centered, peace-loving, open to providing spiritual help or prayer support, counseling to anyone aspiring to know GOD or about the eternal Salvation he has provided to mankind, and overall non-promoting of any religion but committed to nation-building or fulfilling of GOD's divine Will, and thereby enhancing GOD'S Kingdom purposes for the good of one & all.
            </p>

            <p>
              The details on Worship, prayer meetings, events for children, youth, women, elders, families, media & social work related endeavours, festive events, etc., can all be found in this web site.
            </p>

            <p>
              This GOD-given premises/Church has been a blessing since year 1964, to many & believe will continue to be so for all the generations to come, for his own glory.
            </p>

            <p>
              If you have been staying in Bhubaneswar or visiting Bhubaneswar, please don't hesitate to come over to visit this "house of prayer" and be blessed! For any details please contact me or any of the Pastors!
            </p>

            <div style={{ marginTop: '1rem', fontStyle: 'italic', color: '#475569' }}>
              <p style={{ marginBottom: '0.2rem' }}>With thanks & prayers,</p>
              <p>Yours in His service,</p>
            </div>

            {/* Divider with Cross symbol */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
              <span style={{ padding: '0 1rem', color: 'var(--color-primary)', fontSize: '1.2rem' }}>†</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            </div>

            {/* Signoff profile */}
            <div>
              <h4
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '800',
                  color: 'var(--color-primary)',
                  marginBottom: '0.25rem',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                Er. Michael Rajesh Behera
              </h4>
              <p
                style={{
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#475569',
                  marginBottom: '0.1rem',
                }}
              >
                Secretary, Church of Christ
              </p>
              <p style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Union Church, Bhubaneswar
              </p>

              {/* Phone contact pill button */}
              <a href="tel:9439919188" className="phone-pill">
                <Phone size={14} />
                <span>94399 19188</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Our Core Identity Section ── */}
        <div style={{ marginBottom: '4.5rem' }}>
          <h3
            style={{
              fontSize: '2.2rem',
              color: 'var(--color-primary)',
              textAlign: 'center',
              fontWeight: '800',
              fontFamily: 'var(--font-heading)',
              marginBottom: '2.5rem',
            }}
          >
            Our Core Identity
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {identities.map((item, index) => (
              <div
                key={index}
                className="hover-card"
                style={{
                  backgroundColor: '#fffdfa',
                  border: '1px solid rgba(139, 0, 0, 0.06)',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </div>
                <h4
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: 'var(--color-primary)',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {item.title}
                </h4>
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Since 1964 Bottom Banner ── */}
        <div
          style={{
            position: 'relative',
            backgroundColor: 'var(--color-primary-dark)',
            borderRadius: '24px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            color: '#ffffff',
            boxShadow: '0 20px 40px rgba(139, 0, 0, 0.15)',
            overflow: 'hidden',
            isolation: 'isolate',
          }}
        >
          {/* Subtle faint cross graphic in the background */}
          <div
            style={{
              position: 'absolute',
              right: '5%',
              bottom: '-20%',
              opacity: 0.03,
              color: '#ffffff',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          >
            <svg width="200" height="300" viewBox="0 0 24 36" fill="currentColor">
              <path d="M 9,0 H 15 V 9 H 24 V 15 H 15 V 36 H 9 V 15 H 0 V 9 H 9 Z" />
            </svg>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h4
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: '700',
                fontFamily: 'var(--font-heading)',
                marginBottom: '1rem',
                letterSpacing: '-0.02em',
              }}
            >
              Since 1964
            </h4>
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                opacity: 0.9,
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6,
                fontWeight: '500',
              }}
            >
              A GOD-given house of prayer — a blessing to generations past, present, and those yet to come.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
