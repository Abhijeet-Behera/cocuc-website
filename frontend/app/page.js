import LatestBlogs from '@/components/LatestBlogs'
import Reveal from '@/components/Reveal'
import HeroSection from '@/components/HeroSection'
import ActivitiesGrid from '@/components/ActivitiesGrid'
import LatestVideos from '@/components/LatestVideos'
import UpcomingEvents from '@/components/UpcomingEvents'
import ChurchesMapSection from '@/components/ChurchesMapSection'
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

      {/* Our Satellite Churches Map */}
      <ChurchesMapSection />

      {/* Latest Videos — zig-zag three-playlist section */}
      <section id="sermons" className={`section ${styles.sermonsSection}`}>
        <div className="container">
          <LatestVideos />
        </div>
      </section>

      {/* Upcoming Events — YouTube premieres / scheduled broadcasts */}
      <section className="section">
        <div className="container">
          <UpcomingEvents />
        </div>
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
