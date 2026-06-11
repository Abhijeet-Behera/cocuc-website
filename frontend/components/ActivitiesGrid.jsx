'use client'

import { useEffect, useRef } from 'react'
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
    // Use IntersectionObserver for scroll animation — no GSAP dependency,
    // so this never causes invisible cards even if GSAP crashes elsewhere.
    const items = containerRef.current?.querySelectorAll(`.${styles.gridItem}`)
    if (!items || items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const delay = Array.from(items).indexOf(entry.target) * 120
            setTimeout(() => {
              entry.target.classList.add(styles.gridItemVisible)
            }, delay)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    items.forEach(item => observer.observe(item))
    return () => observer.disconnect()
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
