import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import Preloader from '@/components/Preloader'
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
        <Preloader />
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
