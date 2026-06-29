export const metadata = {
  title: 'Supervisory Committee | Church of Christ Union Church Bhubaneswar',
  description:
    'The Supervisory Committee of Church of Christ (Union Church), Bhubaneswar — established through the constitutional amendment of November 8, 2025 to oversee the functioning of the Church and its wings.',
}

import PageHeader from '@/components/PageHeader'

export default function SupervisoryCommitteePage() {
  const members = [
    { name: 'Mr. Paresh Kumar Das', role: 'Convenor' },
    { name: 'Mr. Ranjan Pati', role: 'Member' },
    { name: 'Mr. Rajballabh Supakar', role: 'Member' },
    { name: 'Mr. Ranjan Rout', role: 'Member' },
    { name: 'Mr. Tapas Dey', role: 'Member' },
  ]

  const responsibilities = [
    'Oversee and conduct the selection of Church Board members — Elders, Deacons and Deaconesses.',
    'Supervise the functioning of different Church wings including the Mahila Sabha, Sunday School, Christian Endeavour Union, and others.',
    'Function as the Disciplinary Committee of the Church — introduced for the first time through the new amendment.',
    'Take all decisions pertaining to maintenance of discipline in the Church covering all members, associate members, Pastors, Evangelists and employees.',

  ]

  return (
    <div>
      <PageHeader
        category="About"
        title="Supervisory Committee"
        description="Established through the constitutional amendment adopted on November 8, 2025."
      />


      {/* ── Content ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>

          {/* Constitutional Background */}
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
              The <strong style={{ color: 'var(--color-text)' }}>Supervisory Committee</strong> of the Church of Christ (Union Church), Bhubaneswar, was conceived during the amendment of the Church constitution which was adopted by the <strong style={{ color: 'var(--color-text)' }}>General Body of the Church on November 8, 2025</strong>.
            </p>
            <p>
              The absence of a body to oversee the overall functioning of the Church and its different wings, maintain discipline and supervise and conduct the selection of Elders, Deacons and Deaconesses who shall constitute the Church Board, was felt since long. The entire weight of managing the Church was laid on the Church Board.
            </p>
            <p>
              A system has been put in place through the new amendment of the Constitution enabling the creation of the Supervisory Committee which shall have <strong style={{ color: 'var(--color-text)' }}>five members</strong> with one of them functioning as its <strong style={{ color: 'var(--color-text)' }}>Convenor</strong>. Two more stand-by members of the Committee shall also be selected who shall fill up a vacancy, if it arises.
            </p>
            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >

            </div>
          </div>

          {/* Responsibilities */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Roles &amp; Responsibilities
          </h2>
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              padding: '2rem 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginBottom: '3.5rem',
            }}
          >
            {responsibilities.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  color: 'var(--color-text-muted)',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    minWidth: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    marginTop: '0.6rem',
                    flexShrink: 0,
                  }}
                />
                <span>{r}</span>
              </div>
            ))}
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
            Committee Members
          </h2>
          <div
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              overflow: 'hidden',
              marginBottom: '3rem',
            }}
          >
            {members.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  padding: '1.15rem 2rem',
                  borderBottom: i < members.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(128,0,0,0.015)',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '1rem' }}>
                  {m.name}
                </span>
                <span
                  style={{
                    padding: '0.22rem 0.85rem',
                    borderRadius: '50px',
                    background: m.role === 'Convenor' ? 'rgba(128,0,0,0.1)' : 'rgba(0,0,0,0.04)',
                    color: m.role === 'Convenor' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                  }}
                >
                  {m.role}
                </span>
              </div>
            ))}
          </div>

          {/* Constitutional Note */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(128,0,0,0.05) 0%, rgba(128,0,0,0.02) 100%)',
              border: '1px solid rgba(128,0,0,0.12)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 2.5rem',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              Constitutional Authority
            </p>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.8,
                maxWidth: '640px',
                margin: '0 auto',
              }}
            >
              The Supervisory Committee also functions as the{' '}
              <strong style={{ color: 'var(--color-text)' }}>Disciplinary Committee</strong> of the Church — introduced for the first time — covering all Church members, associate members, Pastors, Evangelists and employees.
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}
