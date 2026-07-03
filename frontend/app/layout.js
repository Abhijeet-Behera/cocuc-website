import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import Preloader from '@/components/Preloader'
import ErrorLogger from '@/components/ErrorLogger'
import PrivacyBanner from '@/components/PrivacyBanner'
import styles from './layout.module.css'

export const metadata = {
  metadataBase: new URL('https://unionchurch.in'),
  title: {
    default: 'Church of Christ - Union Church, Bhubaneswar',
    template: '%s | Church of Christ - Union Church',
  },
  alternates: {
    canonical: 'https://unionchurch.in',
  },
  description: 'Welcome to Church of Christ (Union Church), Bhubaneswar. Join us for worship, sermons, Odia Christian fellowship, and community in Odisha. Best church in Bhubaneswar.',
  keywords: ['Church in Bhubaneswar', 'Union Church', 'Church of Christ', 'Odia Christian', 'Christian worship Bhubaneswar', 'Sunday service Bhubaneswar', 'Church of Christ Bhubaneswar', 'best church in odisha', 'prayer', 'youth ministry'],
  authors: [{ name: 'Church of Christ (Union Church)' }],
  creator: 'Church of Christ (Union Church)',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://unionchurch.in',
    title: 'Church of Christ - Union Church, Bhubaneswar',
    description: 'Welcome to Church of Christ (Union Church), Bhubaneswar. Join us for worship, sermons, Odia Christian fellowship, and community in Odisha.',
    siteName: 'Church of Christ (Union Church)',
    images: [
      {
        url: '/church-logo.png',
        width: 1200,
        height: 630,
        alt: 'Church of Christ - Union Church, Bhubaneswar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Church of Christ - Union Church, Bhubaneswar',
    description: 'Welcome to Church of Christ (Union Church), Bhubaneswar. Join us for worship, sermons, Odia Christian fellowship, and community in Odisha.',
    images: ['/church-logo.png'],
    creator: '@COCUCBBSR',
  },
  icons: {
    icon: '/favicon.png',
  },
  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE_HERE',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Church", "LocalBusiness"],
              "name": "Church of Christ (Union Church)",
              "description": "Welcome to Church of Christ (Union Church), Bhubaneswar. Join us for worship, sermons, Odia Christian fellowship, and community in Odisha.",
              "image": "https://unionchurch.in/church-logo.png",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bhubaneswar",
                "addressRegion": "Odisha",
                "addressCountry": "IN"
              },
              "url": "https://unionchurch.in",
              "sameAs": [
                "https://facebook.com/cocbhubaneswar",
                "https://youtube.com/cocbhubaneswar",
                "https://www.instagram.com/cocbbsr/",
                "https://twitter.com/COCUCBBSR"
              ]
            })
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ErrorLogger />
        <Preloader />
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
        <PrivacyBanner />
      </body>
    </html>
  )
}
