import PageHeader from '@/components/PageHeader'

export const metadata = {
  title: "Secretary's Corner | Church of Christ Union Church Bhubaneswar",
  description: "Updates, greetings, and messages from the Church Secretary of the Church of Christ (Union Church), Bhubaneswar.",
}

export default function SecretaryCornerPage() {
  return (
    <div>
      <PageHeader
        category="About"
        title="Secretary's Corner"
        description="Greetings and administrative updates from the Desk of the Church Secretary."
      />

      <section className="section container">
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            backgroundColor: 'var(--color-white)',
            padding: '3rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              fontSize: '1.1rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.8,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <h2
              style={{
                fontSize: '2rem',
                color: 'var(--color-primary)',
                marginBottom: '1rem',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Greetings in the name of our Lord and Savior Jesus Christ!
            </h2>

            <p>
              It is a great privilege and honor to serve as the Secretary of the Church of Christ (Union Church), Bhubaneswar. God has been extremely faithful to our congregation as we grow not just in numbers, but in our spiritual walk and commitment to His Kingdom.
            </p>

            <p>
              Our church stands as a beacon of hope in Bhubaneswar. Through the cooperative efforts of our Church Board, the Supervisory Committee, and our faithful members, we manage the administrative affairs of the main church and our various wings including the Sunday School, C.E. Union, Women’s Fellowship, and Worship Teams. We also extend our pastoral outreach and care through our satellite worship centers in Sundarpada, Kalinga Vihar, Chandrasekharpur, and Jagatsinghpur.
            </p>

            <p>
              As the administrative heart of the church, the Secretary’s office works closely with our pastoral team to ensure all worship services, cottage prayers, special celebrations, and outreach programs are conducted in an orderly and prayerful manner. We are dedicated to maintaining transparent communication, organizing fellowship activities, and facilitating the spiritual growth of all members.
            </p>

            <p>
              We invite you to actively participate in the life of our church. Whether through joining a prayer cell, volunteering in church ministries, or participating in fellowship programs, your unique gifts can serve to glorify God and build up this body of believers.
            </p>

            <p style={{ marginTop: '2rem', fontWeight: 'bold', color: 'var(--color-text)' }}>
              In His Service,
            </p>

            <p style={{ lineHeight: 1.2 }}>
              <strong style={{ color: 'var(--color-primary)', fontSize: '1.2rem' }}>
                Er. Michael Rajesh Behera
              </strong>
              <br />
              <span>Secretary, Church of Christ (Union Church), Bhubaneswar</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
