'use client'

import { useState, useEffect } from 'react'

export default function PageHeader({ category, title, description }) {
  const [bgImage, setBgImage] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const updateBg = () => {
      const hour = new Date().getHours()
      // Lighted room from 5:00 AM to 5:00 PM (05:00 - 16:59)
      // Dark room from 5:00 PM to 5:00 AM (17:00 - 04:59)
      if (hour >= 5 && hour < 17) {
        setBgImage('/church-light.jpg')
      } else {
        setBgImage('/church-dark.png')
      }
    }
    updateBg()
    setMounted(true)
    // Check every minute in case the theme needs to transition while the user is on the page
    const interval = setInterval(updateBg, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="page-header-section">
      <style dangerouslySetInnerHTML={{ __html: `
        .page-header-section {
          position: relative;
          color: var(--color-white);
          padding: 160px 0 110px 0;
          text-align: center;
          overflow: hidden;
          background-color: #1a0000;
          width: 100%;
        }
        @media (max-width: 768px) {
          .page-header-section {
            padding: 120px 1.25rem 80px 1.25rem;
          }
        }
        @media (max-width: 480px) {
          .page-header-section {
            padding: 100px 1rem 60px 1rem;
          }
        }
      `}} />
      {/* Background Image Container */}
      {bgImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%', // Align to center 40% vertical height to display the altar and pews
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out, background-image 0.5s ease-in-out',
            clipPath: 'inset(0 0 12.5% 0)', // Crop bottom 12.5% to hide watermark
            transform: 'scale(1.15)', // Scale up to compensate for cropped bottom area
            transformOrigin: 'top center',
          }}
        />
      )}


      {/* Dark Overlay for text legibility */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          zIndex: 1,
        }}
      />

      {/* Content Container */}
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {category && (
          <p
            style={{
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              opacity: 0.7,
              marginBottom: '1rem',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {category}
          </p>
        )}

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            marginBottom: '1.2rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          {title}
        </h1>

        {description && (
          <p
            style={{
              fontSize: '1.15rem',
              opacity: 0.85,
              maxWidth: '580px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
