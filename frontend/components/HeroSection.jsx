'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import MemoryVerses from './MemoryVerses'
import styles from './HeroSection.module.css'

/* ─── IST time helpers ─────────────────────────────────────── */
function getISTHour() {
  const now = new Date()
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utcMs + 330 * 60000).getHours()
}

function getPeriod(hour) {
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  return 'night'
}

/* ─── Background image config (per IST period) ─────────────── */
const PERIOD_CONFIG = {
  morning: {
    image: '/cocuc-heroimage-morning.jpeg',
    overlayFrom: 'rgba(140, 30, 0, 0.62)',
    overlayTo: 'rgba(40, 8, 0, 0.78)',
    label: 'Morning',
  },
  afternoon: {
    image: '/cocuc-heroimage-afternoon.jpeg',
    overlayFrom: 'rgba(128, 0, 0, 0.60)',
    overlayTo: 'rgba(30, 0, 0, 0.80)',
    label: 'Afternoon',
  },
  night: {
    image: '/cocuc-heroimage-night.jpeg',
    overlayFrom: 'rgba(90, 0, 20, 0.68)',
    overlayTo: 'rgba(10, 5, 20, 0.88)',
    label: 'Night',
  },
}
const PERIODS = ['morning', 'afternoon', 'night']

/* ─── Quote carousel slides ─────────────────────────────────── */
const QUOTE_SLIDES = [
  {
    id: 'odia',
    topLine: 'ଯୀଶୁ କହିଲେ',
    bottomLine: '"ମୁଁ ପଥ, ସତ୍ୟ ଓ ଜୀବନ"',
  },
  {
    id: 'english',
    topLine: 'Jesus Said:',
    bottomLine: 'I am the WAY, the TRUTH, and the LIFE',
  },
  {
    id: 'hindi',
    topLine: 'यीशु ने कहा',
    bottomLine: 'मार्ग और सत्य और जीवन मैं ही हूँ',
  },
]

export default function HeroSection() {
  const [activePeriod, setActivePeriod] = useState(() => getPeriod(getISTHour()))
  const [activeSlide, setActiveSlide] = useState(0)
  const timerRef = useRef(null)
  const titleRef = useRef(null)
  const colsRef = useRef(null)

  /* IST period — re-check every minute */
  useEffect(() => {
    const id = setInterval(() => setActivePeriod(getPeriod(getISTHour())), 60000)
    return () => clearInterval(id)
  }, [])

  /* Carousel auto-advance — reset on manual navigation */
  const startAutoAdvance = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % QUOTE_SLIDES.length)
    }, 3000)
  }, [])

  useEffect(() => {
    startAutoAdvance()
    return () => clearInterval(timerRef.current)
  }, [startAutoAdvance])

  /* GSAP entrance animation */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })
      
      tl.fromTo(
        titleRef.current,
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
      )
      
      if (colsRef.current) {
        tl.fromTo(
          colsRef.current.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' },
          "-=0.7"
        )
      }
    })
    return () => ctx.revert()
  }, [])

  /* Navigation handlers */
  const goTo = useCallback((idx) => {
    setActiveSlide(idx)
    startAutoAdvance()
  }, [startAutoAdvance])

  const goPrev = () => goTo((activeSlide - 1 + QUOTE_SLIDES.length) % QUOTE_SLIDES.length)
  const goNext = () => goTo((activeSlide + 1) % QUOTE_SLIDES.length)

  return (
    <section className={styles.heroSection}>

      {/* ── Background image layers (IST time-based) ── */}
      <div className={styles.bgStack} aria-hidden="true">
        {PERIODS.map((period) => {
          const cfg = PERIOD_CONFIG[period]
          return (
            <div
              key={period}
              className={`${styles.bgLayer} ${period === activePeriod ? styles.bgLayerActive : ''}`}
            >
              <Image
                src={cfg.image}
                alt={`${cfg.label} view of the church`}
                fill
                sizes="100vw"
                priority={true}
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              <div
                className={styles.bgOverlay}
                style={{
                  background: `linear-gradient(160deg, ${cfg.overlayFrom} 0%, ${cfg.overlayTo} 100%)`,
                }}
              />
            </div>
          )
        })}
        <div className={styles.vignette} />
        <div className={styles.bottomFade} />
      </div>

      {/* ── Foreground content ── */}
      <div className={styles.heroFg}>

        {/* Title — full-width, centered */}
        <div ref={titleRef} className={styles.titleBlock}>
          <p className={styles.welcomeLabel}>Welcome to</p>
          <h1 className={styles.churchName}>Church of Christ</h1>
          <p className={styles.unionName}>Union Church, Bhubaneswar</p>
        </div>

        {/* Two-column row */}
        <div ref={colsRef} className={styles.heroColumns}>

          {/* ── LEFT: Quote carousel ── */}
          <div className={styles.carouselCol}>
            <div className={styles.carouselWrap}>

              <button
                className={`${styles.arrow} ${styles.arrowLeft}`}
                onClick={goPrev}
                aria-label="Previous quote"
              >
                &#8249;
              </button>

              {/* Sliding track */}
              <div className={styles.carouselViewport}>
                <div
                  className={styles.carouselTrack}
                  style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                  {QUOTE_SLIDES.map((slide) => (
                    <div key={slide.id} className={styles.carouselSlide}>
                      <p className={styles.quoteTop}>{slide.topLine}</p>
                      <p className={styles.quoteBottom}>{slide.bottomLine}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className={`${styles.arrow} ${styles.arrowRight}`}
                onClick={goNext}
                aria-label="Next quote"
              >
                &#8250;
              </button>
            </div>

            {/* Indicator dots */}
            <div className={styles.dots} role="tablist" aria-label="Quote slides">
              {QUOTE_SLIDES.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === activeSlide}
                  className={`${styles.dot} ${i === activeSlide ? styles.dotActive : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ── Vertical divider ── */}
          <div className={styles.divider} aria-hidden="true" />

          {/* ── RIGHT: Scripture quote + CTA ── */}
          <div className={styles.quoteCol}>
            <blockquote className={styles.heroSubtitle}>
              "He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty."
            </blockquote>
            <p className={styles.heroCaption}>
              Join us this Sunday and experience the presence of God.
            </p>
            <div className={styles.buttonGroup}>
              <Link href="/about" className={`btn-primary ${styles.heroButton}`}>
                Explore
              </Link>
              <a 
                href="https://www.google.com/maps/place/Union+Church,+Unit+4+Main+St,+Unit+4,+Bhouma+Nagar,+Bhubaneswar,+Odisha+751001/@20.2761087,85.8342424,18z/data=!4m6!3m5!1s0x3a19a7594579150b:0x23298f0ac9cae304!8m2!3d20.2764338!4d85.833986!16s%2Fg%2F11b8tb49mb?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-secondary ${styles.heroButtonSecondary}`}
              >
                Locate on Map
              </a>
            </div>
          </div>

        </div>

        {/* Memory Verses Section */}
        <MemoryVerses />

      </div>
    </section>
  )
}
