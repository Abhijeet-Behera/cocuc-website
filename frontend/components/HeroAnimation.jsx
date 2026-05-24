'use client'
import { motion } from 'framer-motion'

export default function HeroAnimation({ title, subtitle }) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  }

  const child = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  }

  // Split title into words for staggered animation
  const words = title.split(" ")

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'var(--color-white)' }}
    >
      <h1 style={{ 
        fontSize: '4.5rem', 
        marginBottom: '1.5rem', 
        textShadow: '0 4px 12px rgba(0,0,0,0.3)', 
        letterSpacing: '-1px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem'
      }}>
        {words.map((word, i) => (
          <motion.span key={i} variants={child} style={{ display: 'inline-block' }}>
            {word}
          </motion.span>
        ))}
      </h1>
      <motion.p 
        variants={child}
        style={{ fontSize: '1.25rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem', opacity: 0.9 }}
      >
        {subtitle}
      </motion.p>
    </motion.div>
  )
}
