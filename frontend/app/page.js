import Link from 'next/link'
import YouTubeFeed from '@/components/YouTubeFeed'
import LatestBlogs from '@/components/LatestBlogs'
import Reveal from '@/components/Reveal'
import HeroSection from '@/components/HeroSection'
import ActivitiesGrid from '@/components/ActivitiesGrid'
import styles from './page.module.css'

export default function Home() {
  return (
    <div>
      <HeroSection />

      {/* Activities Grid */}
      <section className={`section ${styles.activitiesSection}`}>
        <div className="container">
          <ActivitiesGrid />
        </div>
      </section>

      {/* Visual Video Library */}
      <section id="sermons" className={`section ${styles.sermonsSection}`}>
        <Reveal>
          <div className="container">
            <h2 className="section-title">Latest Sermons</h2>
            <YouTubeFeed />
            <div className={styles.buttonContainer}>
              <Link href="/sermons" className={`btn-primary ${styles.sermonButton}`}>
                View All Sermons
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Blogs & Updates */}
      <section className="section container">
        <Reveal delay={0.25}>
          <h2 className="section-title">News & Updates</h2>
          <LatestBlogs />
        </Reveal>
      </section>
    </div>
  )
}
