'use client'
import { motion, useInView, useAnimation } from 'framer-motion'
import { useRef, useEffect } from 'react'

export default function Reveal({ children, width = '100%', delay = 0.15 }) {
  const ref = useRef(null)
  // Trigger animation when element is in view (with a 50px offset)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible")
    }
  }, [isInView, mainControls])

  return (
    <div ref={ref} style={{ position: 'relative', width }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.6, delay: delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
