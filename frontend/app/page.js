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
import StemScrollNav from '@/components/StemScrollNav'
import styles from './page.module.css'

export default function Home() {
  return (
    <div>
      <div id="hero">
        <HeroSection />
      </div>

      <div style={{ position: 'relative' }}>
        <StemScrollNav />

        {/* Secretary Announcements Proxy */}
        <div id="church-updates">
        <SecretaryAnnouncements />
      </div>

      {/* Activities Grid */}
      <section id="activities" className={`section ${styles.activitiesSection}`}>
        <div className="container">
          <ActivitiesGrid />
        </div>
      </section>

      {/* Prayer Zones Map */}
      <div id="prayer-zones">
        <PrayerZonesMapSection />
      </div>

      {/* Our Satellite Churches Map */}
      <div id="churches">
        <ChurchesMapSection />
      </div>

      {/* Latest Videos — zig-zag three-playlist section */}
      <section id="sermons" className={`section ${styles.sermonsSection}`}>
        <div className="container">
          <LatestVideos />
        </div>
      </section>

      {/* Upcoming Events — YouTube premieres / scheduled broadcasts */}
      <section id="upcoming-events" className="section">
        <div className="container">
          <UpcomingEvents />
        </div>
      </section>

      {/* Blog & Inspiration */}
      <section id="blog" className="section container" style={{ background: 'var(--color-surface)', borderRadius: '28px', padding: '4.5rem 2rem', marginTop: '2rem', border: '1px solid rgba(128,0,0,0.05)' }}>
        <Reveal delay={0.25}>
          <h2 className="section-title-elegant">
            <span className="title-normal">Blog & </span>
            <em className="title-italic">Inspiration</em>
          </h2>
          <BlogInspiration />
        </Reveal>
      </section>

      {/* Testimonies */}
      <div id="testimonies">
        <Testimonies />
      </div>
      </div>

      <ChatBotWidget />
    </div>
  )
}
