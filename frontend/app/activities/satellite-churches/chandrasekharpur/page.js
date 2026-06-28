export const metadata = {
  title: 'Chandrasekharpur Worship Center | Church of Christ Union Church Bhubaneswar',
  description: 'Odia Worship Service held every Sunday morning at 9:30 AM in Chandrasekharpur, Bhubaneswar.',
}

import PageHeader from '@/components/PageHeader'

export default function ChandrasekharpurPage() {
  const leaders = [];

  return (
    <div>
      <PageHeader
        category="Satellite Churches"
        title="Chandrasekharpur Worship Center"
        description="Serving the Chandrasekharpur community since the early 1990s."
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
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Sunday @ 9:30 AM</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Location</p>
              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>96, District Center, Chandrasekharpur</p>
            </div>
            <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.25)' }} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Coordinator</p>
              <p style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 }}>
                <strong>Mr. Amon Chandra Nag</strong><br />
                <strong>Evg. Pratap Kumar Sahoo</strong>
              </p>
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
              We have a vibrant Odia Worship Service held <strong style={{ color: 'var(--color-text)' }}>every Sunday morning at 9:30 AM</strong>. This worship center is located in the Chandrasekharpur area. The center started way back in the early 90&rsquo;s and we have a wonderful congregation who turns up every Sunday morning to listen to God&rsquo;s Word. On December 15, 2019, it was shifted to a new location at <strong style={{ color: 'var(--color-text)' }}>96, District Center, Chandrasekharpur</strong>.
            </p>

            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              The Lord&rsquo;s Supper is being served every 2nd Sunday of the month. It is conducted by one of our Pastors.
            </div>

            <p>
              Besides the Pastors and Deacons, preachers from within and outside the city are invited to speak at the different Worship services. Guest speakers are also invited to preach on special occasions.
            </p>

            <p>
              They have their separate Sunday School for children in the area. The Sunday School classes are held in the morning before the main Worship Service commences at 9:30 AM.
            </p>

            {/* Warning / Note Alert */}
            <div
              style={{
                background: 'rgba(128,0,0,0.04)',
                border: '1px solid rgba(128,0,0,0.1)',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-primary-dark)',
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            >
              ⚠️ <strong>Kindly Note:</strong> On Christmas and Good Friday, there is no Service in the C.S. Pur Worship center as the Special Service is held only in the main Church of Christ (Union Church).
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
