'use client'
import { motion } from 'framer-motion'

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1 
      }}
    >
      {children}
    </motion.div>
  )
}
