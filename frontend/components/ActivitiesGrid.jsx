'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import styles from './ActivitiesGrid.module.css'

export default function ActivitiesGrid() {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
  }

  return (
    <div className={styles.gridContainer}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className={styles.grid}
      >
        {activities.map((item, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            whileHover={{ y: -8 }}
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

            {/* Title & Button */}
            <h3 className={styles.itemTitle}>
              {item.title}
            </h3>
            
            <Link href={item.link} className={styles.itemLink}>
              READ MORE
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
