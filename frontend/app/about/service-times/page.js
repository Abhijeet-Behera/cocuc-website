import PageHeader from '@/components/PageHeader'
import styles from './service-times.module.css'

export default function ServiceTimesPage() {
  return (
    <div>
      <PageHeader
        category="About"
        title="Service Times"
        description="Join us for worship, prayer, and fellowship throughout the week."
      />


      <section className="section container">
        <div className={styles.cardContainer}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Sunday Services */}
            <div>
              <h2 className={styles.categoryHeader}>
                Sunday Services
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.1rem', lineHeight: 1.8 }}>
                <li><strong>English Worship:</strong> 10:00 am</li>
                <li><strong>Odia Worship:</strong> 4:30 pm</li>
                <li><strong>C.S. Pur Worship Center:</strong> 10:00 am</li>
                <li><strong>Kalinga Vihar Worship Center:</strong> 10:00 am</li>
                <li><strong>Sundarpada Worship Center:</strong> 10:00 am</li>
              </ul>
              <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                Worship is also conducted @ Jagatsinghpur, Baripada, Nayagarh.
              </p>
            </div>

            {/* Prayer Times & Sunday School */}
            <div className={styles.gridBlock}>
              <div>
                <h2 className={styles.categoryHeader}>
                  Prayer Times
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.1rem', lineHeight: 1.8 }}>
                  <li><strong>Morning Prayer:</strong> 7:00 am (Monday-Saturday)</li>
                  <li><strong>Monday Prayer:</strong> 7:00 pm</li>
                  <li><strong>Cottage Prayer:</strong> 7:00 pm every Thursday <br/><span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>(held in 16 different Prayer zones)</span></li>
                </ul>
                <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                  Online Zoom Prayers are held too.
                </p>
              </div>

              <div>
                <h2 className={styles.categoryHeader}>
                  Sunday School
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.1rem', lineHeight: 1.8 }}>
                  <li><strong>Every Sunday Morning:</strong> 8:00 am - 9:45 am</li>
                  <li><strong>English Sunday School:</strong> starts @ 10:00 am <br/><span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>(during the English Worship Service)</span></li>
                </ul>
              </div>
            </div>

            {/* Fellowships */}
            <div>
              <h2 className={styles.categoryHeader}>
                Ladies Fellowship
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.1rem', lineHeight: 1.8 }}>
                <li><strong>Maa Sabha (Mahila Samiti):</strong> 4:00 pm every Saturday</li>
                <li><strong>Monthly Church Chain Prayer (2nd Saturday):</strong> 11:00 am - 12:00 pm</li>
                <li><strong>Fasting Prayer (Last Saturday):</strong> 11:00 am - 1:00 pm</li>
              </ul>
            </div>

            <div>
              <h2 className={styles.categoryHeader}>
                Youth Speaks
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.1rem', lineHeight: 1.8 }}>
                <li><strong>C.E. Union meets:</strong> 7:00 pm every Tuesday</li>
                <li><strong>Youth Fellowship meets:</strong> 5:30 pm every Saturday</li>
              </ul>
            </div>

            {/* Other Meetings */}
            <div className={styles.gridBlock}>
              <div>
                <h2 className={styles.categoryHeader}>
                  Choir Practice
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.1rem', lineHeight: 1.8 }}>
                  <li><strong>English Choir:</strong> 7:00 pm every Friday</li>
                  <li><strong>Odia Choir:</strong> 7:00 pm every Saturday</li>
                </ul>
              </div>

              <div>
                <h2 className={styles.categoryHeader}>
                  Baptism & Counselling
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.1rem', lineHeight: 1.8 }}>
                  <li><strong>Baptism Class:</strong> Every Saturday @ 4:30 pm</li>
                  <li><strong>Pre-Marital Counselling:</strong> Provided to candidates by Pastors.</li>
                  <li><strong>General Counselling:</strong> Freely available via our Pastors and Evangelists.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
