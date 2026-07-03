import PageHeader from '@/components/PageHeader'

export const metadata = {
  title: 'About Us | Church of Christ - Union Church',
  description: 'Learn about the history, mission, and leadership of Church of Christ (Union Church) in Bhubaneswar.',
}

export default function AboutUs() {
  const boardMembers = [
    { name: 'Dr. Johnson Smith', role: 'Senior Pastor & Chairman' },
    { name: 'Rev. Mark Taylor', role: 'Associate Pastor & Vice-Chairman' },
    { name: 'Mrs. Sarah OConnor', role: 'Secretary' },
    { name: 'Mr. David Lee', role: 'Treasurer' },
    { name: 'Mr. Samuel Jackson', role: 'Board Member' }
  ]

  return (
    <div>
      <PageHeader
        category="About"
        title="About Us"
        description="Learn more about our mission, vision, and the people behind Union Church."
      />


      <section className="section container">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Our History & Mission</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
            The Church, located in the heart of the city is being used as a WORSHIP CENTER meeting the Spiritual needs of the people. In 1998, the Church was registered as a society under the SOCIETIES REGISTRATION ACT. God has been gracious and we are here not by our strength but by His faithfulness.
          </p>
        </div>

        {/* 
        <div>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', textAlign: 'center', marginBottom: '3rem' }}>Board Members</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {boardMembers.map((member, index) => (
              <div key={index} style={{
                backgroundColor: 'var(--color-surface)',
                padding: '2.5rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 1.5rem'
                }}>
                  {member.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{member.name}</h3>
                <p style={{ color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
        */}
      </section>
    </div>
  )
}
