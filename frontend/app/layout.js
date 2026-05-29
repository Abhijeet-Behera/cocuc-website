import './globals.css'
import Navbar from '@/components/Navbar'
import Providers from '@/components/Providers'
import styles from './layout.module.css'

export const metadata = {
  title: 'Church of Christ - Union Church, Bhubaneswar',
  description: 'Welcome to Church of Christ (Union Church), Bhubaneswar. Join us for worship, sermons, and community.',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>
              <h3 className={styles.footerTitle}>Church of Christ (Union Church)</h3>
              
              <div className={styles.footerInfo}>
                <div>
                  <strong>Address:</strong><br />
                  Lokseva Marg, Unit-4, PO Box 751001<br />Odisha, India
                </div>
                <div>
                  <strong>General Contact:</strong><br />
                  (+91) 9437400283<br />
                  info@unionchurch.org.in
                </div>
                <div>
                  <strong>Prayer Requests:</strong><br />
                  prayerrequest@unionchurch.org.in<br />
                  (+91) 9437418423 / 9437284415
                </div>
              </div>
              
              <div className={styles.footerCopy}>
                &copy; {new Date().getFullYear()} Church of Christ (Union Church), Bhubaneswar. All rights reserved.
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
