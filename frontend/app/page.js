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
import SecretaryAnnouncements from '@/components/SecretaryAnnouncements'
import styles from './page.module.css'

export default function Home() {
  return (
    <div>
      <HeroSection />

      {/* Secretary Announcements Proxy */}
      <SecretaryAnnouncements />

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



      {/* Blog & Inspiration */}
      <section className="section container" style={{ backgroundColor: '#fdfbfb', borderRadius: '24px', padding: '4rem 2rem', marginTop: '2rem' }}>
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
