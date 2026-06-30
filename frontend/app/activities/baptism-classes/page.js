import PageHeader from '@/components/PageHeader'
import styles from './baptism-classes.module.css'

export const metadata = {
  title: 'Baptism Classes | Church of Christ Union Church Bhubaneswar',
  description:
    'The Baptism Committee of the Church of Christ (Union Church), Bhubaneswar, guides believers in their spiritual journey towards Christian baptism through structured, Bible-based classes every Saturday.',
}

export default function BaptismClassesPage() {
  const leaders = [
    'Rev. Ayub Chinchani',
    'Rev. Songram Keshari Singh',
    'Rev. Satish Kumar Pani',
    'Evg. Ranjit Singh',
    'Evg. Pratap Kumar Sahoo',
  ]

  const topics = [
    'Sin',
    'Repentance',
    'Forgiveness',
    'Salvation',
    'The Holy Spirit',
  ]

  const contacts = [
    'Rev. Songram Keshari Singh',
    'Evg. Ranjit Singh',
    'Er. Michael Rajesh Behera (Secretary)',
  ]

  const committee = [
    { name: 'Rev. Dr. Ayub Chhinchani', role: 'Convenor' },
    { name: 'Rev. Songram Keshari Singh', role: 'Co-Convenor' },
    { name: 'Rev. Satish Kumar Pani', role: 'Co-Convenor' },
    { name: 'Er. Michael Rajesh Behera', role: 'Secretary' },
    { name: 'Evg. Pratap Kumar Sahoo', role: 'Member' },
    { name: 'Evg. Ranjit Singh', role: 'Member' },
    { name: 'Mr. Asit Kumar Mohanty', role: 'Member' },
    { name: 'Mrs. Jeeta Pati', role: 'Member' },
    { name: 'Mrs. Alakananda Samantaray', role: 'Member' },
    { name: 'Mrs. Madhuleeta Samantaray', role: 'Member' },
    { name: 'Mrs. Anita Nayak', role: 'Member' },
    { name: 'Mrs. Swarnamayee Patra', role: 'Member' },
  ]

  return (
    <div>
      <PageHeader
        category="Activities"
        title="Baptism Classes"
        description="Guiding believers in their spiritual journey towards Christian baptism."
      />

      {/* ── Content ── */}
      <section className="section">
        <div className={`container ${styles.contentContainer}`}>

          {/* Schedule Banner */}
          <div className={styles.scheduleBanner}>
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Class Day</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Every Saturday</p>
            </div>
            <div className={styles.timingDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Time</p>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>4:00 PM</p>
            </div>
            <div className={styles.timingDivider} />
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.8 }}>Venue</p>
              <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>First Floor, Amenity Hall</p>
            </div>
          </div>

          {/* About */}
          <div className={styles.aboutCard}>
            <p>
              The <strong style={{ color: 'var(--color-text)' }}>Baptism Committee</strong> of the Church of Christ (Union Church), Bhubaneswar, is committed to guiding believers in their spiritual journey towards Christian baptism. The committee conducts Baptism Classes every Saturday at 4:00 PM in the First Floor of the Amenity Hall, providing a structured and Bible-based understanding of the Christian faith.
            </p>
            <p>
              Recognising the needs of believers residing outside Bhubaneswar, the church also conducts <strong style={{ color: 'var(--color-text)' }}>live Zoom Baptism Classes simultaneously</strong> with the in-person sessions, ensuring that everyone has an opportunity to participate regardless of their location.
            </p>
            <div
              style={{
                borderLeft: '3px solid var(--color-primary)',
                paddingLeft: '1.25rem',
                fontStyle: 'italic',
                color: 'var(--color-text)',
              }}
            >
              Candidates become eligible to receive Holy Baptism after successfully completing <strong>three months of instruction</strong> or a minimum of <strong>twelve Baptism classes</strong>.
            </div>
            <p>
              Upon completion, candidates appear for a <strong style={{ color: 'var(--color-text)' }}>Baptism Interview</strong> conducted by the Baptism Committee to assess their understanding of the biblical teachings and their readiness to publicly confess their faith in Jesus Christ. Following their baptism, newly baptised members are presented with a <strong style={{ color: 'var(--color-text)' }}>Baptism Certificate</strong> along with the book <em>&ldquo;Basic Bible Doctrine&rdquo;</em> by Alban Douglas, and are dedicated to the church during the Odia Service.
            </p>
          </div>

          {/* Topics Covered */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Topics Covered
          </h2>
          <div className={styles.topicsList}>
            {topics.map((t) => (
              <span key={t} className={styles.topicTag}>
                {t}
              </span>
            ))}
          </div>

          {/* Class Leaders */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              marginBottom: '1.25rem',
            }}
          >
            Classes Led By
          </h2>
          <div className={styles.leadersCard}>
            {leaders.map((l, i) => (
              <div
                key={i}
                className={`${styles.leadersRow} ${i % 2 !== 0 ? styles.leadersRowAlt : ''}`}
              >
                {l}
              </div>
            ))}
          </div>

          {/* Enrolment */}
          <div className={styles.contactCard}>
            <p
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                fontWeight: 700,
                marginBottom: '0.75rem',
              }}
            >
              Enrolment — Contact Us
            </p>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
                marginBottom: '1rem',
              }}
            >
              Those who desire to enrol in the Baptism Classes may contact:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {contacts.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    color: 'var(--color-text)',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: 'var(--color-primary)',
                      flexShrink: 0,
                    }}
                  />
                  {c}
                </div>
              ))}
            </div>
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
            Baptism Committee Members
          </h2>
          <div className={styles.committeeCard}>
            {committee.map((c, i) => (
              <div
                key={i}
                className={`${styles.committeeRow} ${i % 2 !== 0 ? styles.committeeRowAlt : ''}`}
              >
                <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{c.name}</span>
                <span
                  style={{
                    padding: '0.2rem 0.75rem',
                    borderRadius: '50px',
                    background: c.role === 'Member' ? 'rgba(0,0,0,0.04)' : 'rgba(128,0,0,0.08)',
                    color: c.role === 'Member' ? 'var(--color-text-muted)' : 'var(--color-primary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  {c.role}
                </span>
              </div>
            ))}
          </div>

          {/* What Scripture Says About Baptism */}
          <h2
            style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              color: 'var(--color-primary-dark)',
              marginTop: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            What Scripture Says About Baptism
          </h2>
          <div className={styles.scripturesContainer}>
            {[
              {
                ref: 'Matthew 28:19 (NIV)',
                text: '\u201cTherefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.\u201d',
              },
              {
                ref: 'Colossians 2:11-12 (NIV)',
                text: '\u201cIn him you were also circumcised with a circumcision not performed by human hands. Your whole self ruled by the flesh was put off when you were circumcised by Christ, having been buried with him in baptism, in which you were also raised with him through your faith in the working of God, who raised him from the dead.\u201d',
              },
              {
                ref: 'Romans 6:4 (NIV)',
                text: '\u201cWe were therefore buried with Him through baptism into death in order that, just as Christ was raised from the dead through the glory of the Father, we too may live a new life.\u201d',
              },
            ].map((v, idx) => (
              <div key={idx} className={styles.scriptureCard}>
                <p
                  style={{
                    fontStyle: 'italic',
                    fontSize: '1.05rem',
                    color: 'var(--color-text)',
                    lineHeight: 1.75,
                    marginBottom: '1rem',
                  }}
                >
                  {v.text}
                </p>
                <p
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--color-primary)',
                  }}
                >
                  &mdash; {v.ref}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
