export const metadata = {
  title: 'Jagatsinghpur Worship Center | Church of Christ Union Church Bhubaneswar',
  description: 'Worship Service led by Evangelist Gobinda Sahu in Jagatsinghpur, Odisha.',
}

import PageHeader from '@/components/PageHeader'

export default function JagatsinghpurPage() {
  return (
    <div>
      <PageHeader
        category="Satellite Churches"
        title="Jagatsinghpur Worship Center"
        description="Spreading the love of Christ in Jagatsinghpur, led by Evangelist Gobinda Sahu."
      />


      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Quick Schedule Banner */}
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
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Worship Timing</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Sunday Morning</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Evangelist &amp; Lead</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Bro. Gobinda Sahu</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Distance</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>~90 km from Bhubaneswar</p>
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
              Evangelist Gobinda Sahu has started a small congregation in the Jagatsinghpur area, which is about 90 kilometers from the capital city. Bro. Gobinda Sahu is a Union Church employee who has been appointed and placed in that area to share the love of Christ with others.
            </p>

            <p>
              He lives in a small rented home with his family. Every Sunday morning, they hold a small worship service in his home. Around 15–20 members (sometimes more) come to praise and worship the Risen Savior on Sunday morning. Bro. Sahu ministers to them and also actively does evangelical work in that area. Our Evangelical team is in touch with him regularly.
            </p>

            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              Please do uphold this brother and his family in your prayers as they live in an area where the Christian majority is minuscule. Let the Spirit of the Lord prevail over that area, so that more and more people would come to know the true God.
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
