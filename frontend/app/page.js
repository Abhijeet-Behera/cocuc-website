import LatestBlogs from '@/components/LatestBlogs'
import BlogInspiration from '@/components/BlogInspiration'
import Testimonies from '@/components/Testimonies'
import Reveal from '@/components/Reveal'
import HeroSection from '@/components/HeroSection'
import ActivitiesGrid from '@/components/ActivitiesGrid'
import LatestVideos from '@/components/LatestVideos'
import UpcomingEvents from '@/components/UpcomingEvents'
import ChurchesMapSection from '@/components/ChurchesMapSection'
import PrayerZonesMapSection from '@/components/PrayerZonesMapSection'
import ChatBotWidget from '@/components/ChatBotWidget'
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

      {/* Prayer Zones Map */}
      <PrayerZonesMapSection />

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

      {/* News & Updates */}
      <section className="section container">
        <Reveal delay={0.25}>
          <h2 className="section-title-elegant">
            <span className="title-normal">News & </span>
            <em className="title-italic">Updates</em>
          </h2>
          <LatestBlogs />
        </Reveal>
      </section>

      {/* Blog & Inspiration */}
      <section className="section container" style={{ background: 'linear-gradient(160deg, #fffdf9 0%, #fdf6ee 100%)', borderRadius: '28px', padding: '4.5rem 2rem', marginTop: '2rem', border: '1px solid rgba(128,0,0,0.05)' }}>
        <Reveal delay={0.25}>
          <h2 className="section-title-elegant">
            <span className="title-normal">Blog & </span>
            <em className="title-italic">Inspiration</em>
          </h2>
          <BlogInspiration />
        </Reveal>
      </section>

      {/* Testimonies */}
      <Testimonies />

      <ChatBotWidget />
    </div>
  )
}
