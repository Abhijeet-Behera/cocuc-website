import Link from 'next/link'
import HeroAnimation from './HeroAnimation'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  return (
    <section className={styles.heroSection}>
      {/* Background Graphic */}
      <div className={styles.heroBackground}></div>

      <HeroAnimation 
        title="Welcome to Union Church Bhubaneswar" 
        subtitle='"He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty." Join us this Sunday and experience the presence of God.'
      />
      <div className={styles.heroContent}>
        <Link href="/about" className={`btn-primary ${styles.heroButton}`}>
          Plan a Visit
        </Link>
      </div>
    </section>
  )
}
