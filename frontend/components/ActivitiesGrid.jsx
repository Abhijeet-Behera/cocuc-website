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
      title: 'SERVICE TIMING',
      link: '/about/service-times',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2836/2836790.png',
      badgeIcon: '🍂'
    },
    {
      title: 'SUNDAY SCHOOL',
      link: '#',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/4243/4243161.png',
      badgeIcon: '📚'
    },
    {
      title: 'SUNDAY WORSHIP',
      link: '#',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/10002/10002951.png',
      badgeIcon: '✝️'
    },
    {
      title: 'CE UNION',
      link: '#',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/2916/2916298.png',
      badgeIcon: '🎧'
    },
    {
      title: "Women's Fellowship",
      link: '#',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/4392/4392500.png',
      badgeIcon: '⭐'
    },
    {
      title: 'YOUTH FELLOWSHIP',
      link: '#',
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3233/3233483.png',
      badgeIcon: '📊'
    }
  ]

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    
    const ctx = gsap.context(() => {
      // Stagger animate cards on scroll
      gsap.fromTo(`.${styles.gridItem}`, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.grid}`,
            start: "top 80%",
            once: true
          }
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
            className={styles.gridItem}
          >
            {/* Card Graphic */}
            <div className={styles.cardGraphic}>
              {/* Overlay to fade background slightly */}
              <div className={styles.cardOverlay}></div>
              
              {/* Top Circular Badge */}
              <div className={styles.badge}>
                {item.badgeIcon}
              </div>

              {/* Center Logo Box */}
              <div className={styles.centerBox}>
                <img src={item.iconUrl} alt={item.title} className={styles.centerBoxImg} />
              </div>
            </div>

            {/* Content Container (For Flex Mobile Layout) */}
            <div className={styles.itemContent}>
              <h3 className={styles.itemTitle}>
                {item.title}
              </h3>
              
              <Link href={item.link} className={styles.itemLink}>
                READ MORE
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
