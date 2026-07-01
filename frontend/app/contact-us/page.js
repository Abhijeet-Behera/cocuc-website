"use client";

import PageHeader from '@/components/PageHeader';
import styles from './contact.module.css';


export default function ContactUsPage() {
  return (
    <div>
      <PageHeader
        category="Contact Us"
        title="Get in Touch"
        description="We would love to hear from you. Reach out for prayer, support, or general inquiries."
      />

      <section className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className={styles.container}>
          
          <div className={styles.grid}>
            
            {/* Pastors Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Need Prayers!!!</h2>
                <p className={styles.cardSubtitle}>Call our Pastors</p>
              </div>
              
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Rev. Dr. Ayub Chhinchani</span>
                  <div className={styles.contactValue}>
                    <a href="tel:+916370484780" className={styles.link}>+91 6370484780</a>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Rev. Songram Keshari Singh</span>
                  <div className={styles.contactValue}>
                    <a href="tel:+919437284415" className={styles.link}>+91 9437284415</a>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Rev. Satish Pani</span>
                  <div className={styles.contactValue}>
                    <a href="tel:+917008535404" className={styles.link}>+91 7008535404</a>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Email Us</span>
                  <div className={styles.contactValue}>
                    <a href="mailto:pastor@unionchurch.in" className={styles.link}>pastor@unionchurch.in</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Secretary Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Church Issues!</h2>
                <p className={styles.cardSubtitle}>Talk to Secretary</p>
              </div>
              
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Er. Michael Rajesh Behera</span>
                  <div className={styles.contactValue} style={{ flexDirection: 'column', gap: '0.25rem' }}>
                    <a href="tel:+919439919188" className={styles.link}>+91 9439919188</a>
                    <a href="tel:+917337377288" className={styles.link}>+91 7337377288</a>
                  </div>
                </div>
                
                <div className={styles.contactItem}>
                  <span className={styles.contactLabel}>Email Us</span>
                  <div className={styles.contactValue}>
                    <a href="mailto:secretary@unionchurch.in" className={styles.link}>secretary@unionchurch.in</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Connect Card */}
            <div className={styles.card} style={{ gridColumn: '1 / -1' }}>
              <div className={styles.cardHeader} style={{ textAlign: 'center' }}>
                <h2 className={styles.cardTitle}>Connect with us</h2>
                <p className={styles.cardSubtitle}>Follow our social media channels to stay updated</p>
              </div>

              <div className={styles.socialsGrid}>
                <a href="https://facebook.com/cocbhubaneswar" target="_blank" rel="noopener noreferrer" className={styles.socialBox}>
                  <div className={styles.socialIconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.39-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </div>
                  <span className={styles.socialName}>Facebook</span>
                  <span className={styles.socialHandle}>facebook.com/cocbhubaneswar</span>
                </a>

                <a href="https://youtube.com/cocbhubaneswar" target="_blank" rel="noopener noreferrer" className={styles.socialBox}>
                  <div className={styles.socialIconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                  </div>
                  <span className={styles.socialName}>YouTube</span>
                  <span className={styles.socialHandle}>youtube.com/cocbhubaneswar</span>
                </a>

                <a href="https://www.instagram.com/cocbbsr/" target="_blank" rel="noopener noreferrer" className={styles.socialBox}>
                  <div className={styles.socialIconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                  <span className={styles.socialName}>Instagram</span>
                  <span className={styles.socialHandle}>instagram.com/cocbbsr</span>
                </a>

                <a href="https://www.twitter.com/COCUCBBSR/" target="_blank" rel="noopener noreferrer" className={styles.socialBox}>
                  <div className={styles.socialIconWrapper}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </div>
                  <span className={styles.socialName}>Twitter</span>
                  <span className={styles.socialHandle}>twitter.com/COCUCBBSR</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
