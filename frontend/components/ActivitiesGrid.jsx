'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Link from 'next/link'
import styles from './ActivitiesGrid.module.css'

export default function ActivitiesGrid() {
  const containerRef = useRef(null)

  const activities = [
    {
      title: 'Service Timing',
      link: '/about/service-times',
      description: (
        <div className={`${styles.scheduleInfo} ${styles.compactSchedule}`}>
          <div className={styles.scheduleRow}>
            <span className={styles.scheduleLabel}>
              English Worship
            </span>
            <span className={styles.scheduleTime}>
              10:00 am
            </span>
          </div>

          <div className={styles.scheduleRow}>
            <span className={styles.scheduleLabel}>
              Odia Worship
            </span>
            <span className={styles.scheduleTime}>
              4:30 pm
            </span>
          </div>

          <div className={styles.scheduleRow}>
            <span className={styles.scheduleLabel}>
              C.S. Pur Worship Center
            </span>
            <span className={styles.scheduleTime}>
              10:00 am
            </span>
          </div>

          <div className={styles.scheduleRow}>
            <span className={styles.scheduleLabel}>
              Kalinga Vihar Worship Center
            </span>
            <span className={styles.scheduleTime}>
              10:00 am
            </span>
          </div>

          <div className={styles.scheduleRow}>
            <span className={styles.scheduleLabel}>
              Sundarpada Worship Center
            </span>
            <span className={styles.scheduleTime}>
              10:00 am
            </span>
          </div>
        </div>
      ),

      imageUrl:
        'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200&auto=format&fit=crop',
      alt: 'Church interior with warm ambient lighting during a service',
    },
    {
      title: 'Sunday School',
      link: '#',
      description: (
        <div className={`${styles.scheduleInfo} ${styles.sundaySchedule}`}>
          <div className={styles.scheduleRow}>
            <span className={styles.scheduleLabel}>
              Every Sunday Morning
            </span>

            <span className={styles.scheduleTime}>
              8:00 am – 9:45 am
            </span>
          </div>

          <div className={styles.scheduleRow}>
            <span className={styles.scheduleLabel}>
              Extended English Sunday School
            </span>

            <span className={styles.scheduleTime}>
              10:00 am onwards
            </span>
          </div>
        </div>
      ),

      imageUrl:
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop',
      alt: 'Children studying together in a bright classroom',
    },
    {
      title: 'Counselling and Baptism',
      link: '#',
      description: (
        <div className={styles.ceSchedule}>
          <div className={styles.ceScheduleItem}>
            <span className={styles.ceScheduleLabel}>
              Class Day
            </span>

            <span className={styles.ceScheduleValue}>
              Saturday
            </span>
          </div>

          <div className={styles.ceScheduleItem}>
            <span className={styles.ceScheduleLabel}>
              Time
            </span>

            <span className={styles.ceScheduleValue}>
              4:30 PM
            </span>
          </div>

          <div className={styles.ceScheduleItem}>
            <span className={styles.ceScheduleLabel}>
              Venue
            </span>

            <span className={styles.ceScheduleValue}>
              Union Church Vestry
            </span>
          </div>
        </div>
      ),

      imageUrl:
        'https://images.pexels.com/photos/267559/pexels-photo-267559.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Counselling and baptism ministry',
    },
    {
      title: 'CE Union',
      link: '#',
      description: (
        <div className={styles.ceSchedule}>
          <div className={styles.ceScheduleItem}>
            <span className={styles.ceScheduleLabel}>
              Meeting Day
            </span>

            <span className={styles.ceScheduleValue}>
              Every Tuesday
            </span>
          </div>

          <div className={styles.ceScheduleItem}>
            <span className={styles.ceScheduleLabel}>
              Time
            </span>

            <span className={styles.ceScheduleValue}>
              7:00 PM
            </span>
          </div>

          <div className={styles.ceScheduleItem}>
            <span className={styles.ceScheduleLabel}>
              Venue
            </span>

            <span className={styles.ceScheduleValue}>
              Union Church
            </span>
          </div>
        </div>
      ),

      imageUrl:
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop',
      alt: 'Group of young people gathered for Christian Endeavour fellowship',
    },
    {
      title: "Women's Fellowship",
      link: '#',
      description: (
        <div className={styles.ceSchedule}>
          <div className={styles.ceScheduleItem}>
            <span className={styles.ceScheduleLabel}>
              Meeting Day
            </span>

            <span className={styles.ceScheduleValue}>
              Every Saturday
            </span>
          </div>

          <div className={styles.ceScheduleItem}>
            <span className={styles.ceScheduleLabel}>
              Time
            </span>

            <span className={styles.ceScheduleValue}>
              4:00 PM
            </span>
          </div>

          <div className={styles.ceScheduleItem}>
            <span className={styles.ceScheduleLabel}>
              Venue
            </span>

            <span className={styles.ceScheduleValue}>
              Union Church Aminity Hall Ground Floor
            </span>
          </div>
        </div>
      ),

      imageUrl:
        'https://images.pexels.com/photos/17030051/pexels-photo-17030051.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Women gathered together in a warm fellowship setting',
    },
    {
      title: 'Youth Fellowship',
      link: '#',
      description: (
        <div className={styles.ceSchedule}>
          <div className={styles.ceScheduleItem}>
            <span className={styles.ceScheduleLabel}>
              Meeting Day
            </span>

            <span className={styles.ceScheduleValue}>
              Every Saturday
            </span>
          </div>

          <div className={styles.ceScheduleItem}>
            <span className={styles.ceScheduleLabel}>
              Time
            </span>

            <span className={styles.ceScheduleValue}>
              5:30 PM
            </span>
          </div>

          <div className={styles.ceScheduleItem}>
            <span className={styles.ceScheduleLabel}>
              Venue
            </span>

            <span className={styles.ceScheduleValue}>
              Union Church Aminity Hall First Floor
            </span>
          </div>
        </div>
      ),

      imageUrl:
        'https://images.unsplash.com/photo-1523803326055-9729b9e02e5a?q=80&w=1200&auto=format&fit=crop',
      alt: 'Young people worshipping together at a youth gathering',
    },
  ];
  const [activeCard, setActiveCard] = useState(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.gridItem}`)) {
        setActiveCard(null)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        `.${styles.gridItem}`,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: `.${styles.grid}`,
            start: 'top 80%',
            once: true,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className={styles.gridContainer} ref={containerRef}>
      <div className={styles.grid}>
        {activities.map((item, index) => (
          <div 
            key={index} 
            className={`${styles.gridItem} ${activeCard === index ? styles.active : ''}`}
            tabIndex={0}
            role="button"
            aria-expanded={activeCard === index}
            onMouseEnter={() => {
              if (window.matchMedia('(hover: hover)').matches) {
                setActiveCard(index);
              }
            }}
            onMouseLeave={() => {
              if (window.matchMedia('(hover: hover)').matches) {
                setActiveCard(null);
              }
            }}
            onClick={(e) => {
              if (e.target.closest('a')) return; // Allow Read More link to navigate
              
              if (window.matchMedia('(hover: none)').matches) {
                // Mobile/Touch: Toggle to close if clicked again
                setActiveCard(activeCard === index ? null : index);
              } else {
                // PC: Click only opens, never closes (unless clicked outside)
                setActiveCard(index);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (e.target.closest('a')) return;
                e.preventDefault();
                setActiveCard(activeCard === index ? null : index);
              }
            }}
          >
            {/* Full-bleed background image */}
            <img
              src={item.imageUrl}
              alt={item.alt}
              className={styles.cardImage}
              loading="lazy"
            />

            {/* Dark gradient overlay */}
            <div className={styles.cardOverlay} />

            {/* Icon badge */}
            <div className={styles.badge}>
              <img src={item.iconUrl} alt="" aria-hidden="true" />
            </div>

            {/* Content: title + description + CTA */}
            <div
              className={`${styles.cardContent} ${item.title === 'Service Timing'
                ? styles.serviceTimingContent
                : ''
                }`}
            >
              <h3
                className={`${styles.itemTitle} ${[
                  'Counselling and Baptism',
                  "Women's Fellowship",
                  'Youth Fellowship',
                ].includes(item.title)
                  ? styles.longTitle
                  : ''
                  }`}
                aria-label={item.title}
              >
                {item.title.split(' ').map((word, wordIndex) => (
                  <span
                    key={`${word}-${wordIndex}`}
                    className={
                      wordIndex === 0
                        ? styles.titleSolid
                        : styles.titleOutline
                    }
                  >
                    {word}
                  </span>
                ))}
              </h3>

              <div className={styles.cardDescription}>
                {item.description}
              </div>

              <Link href={item.link} className={styles.itemLink}>
                Read More
              </Link>
            </div>


          </div>
        ))}
      </div>
    </div>

  )
}