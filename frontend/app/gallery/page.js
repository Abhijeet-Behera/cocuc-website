/* eslint-disable @next/next/no-img-element */

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Gallery.module.css'

export default function GalleryPage() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true)
        setError(null)

        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          'http://localhost:8000'

        const response = await fetch(
          `${apiUrl}/gallery.php`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        )

        if (!response.ok) {
          throw new Error(
            `Failed to fetch gallery (${response.status})`
          )
        }

        const result = await response.json()

        if (result.status !== 'success') {
          throw new Error(
            result.message ||
            'Instagram gallery request failed'
          )
        }

        setPhotos(
          Array.isArray(result.data)
            ? result.data
            : []
        )
      } catch (err) {
        console.error('Gallery error:', err)

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load gallery'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <main className={styles.galleryPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <motion.h1
            className={styles.title}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
          >
            <span className={styles.titlePrimary}>
              Digital
            </span>{' '}
            <span className={styles.titleAccent}>
              Gallery
            </span>
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 1,
            }}
          >
            A cinematic glimpse into our church life,
            worship, and community events through our
            Instagram feed.
          </motion.p>
        </header>

        {loading ? (
          <div className="galleryLoader">
            <div className="gallerySpinner" />
            <p>Loading cinematic moments...</p>
          </div>
        ) : error ? (
          <div className="galleryError">
            <p>Unable to load gallery: {error}</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="emptyGallery">
            <p>
              No Instagram photographs are available.
            </p>
          </div>
        ) : (
          <motion.div
            className="galleryMasonry"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {photos.map((photo, index) => {
              const caption =
                photo.caption?.trim() ||
                'Church of Christ, Union Church'

              return (
                <motion.a
                  key={photo.id}
                  href={photo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="galleryCard"
                  aria-label={`${caption}. Open on Instagram`}
                  variants={itemVariants}
                  whileHover={{
                    y: -4,
                  }}
                >
                  <div className="galleryImageWrapper">
                    <img
                      src={photo.imageUrl}
                      alt={caption}
                      className="galleryImage"
                      loading={
                        index < 3 ? 'eager' : 'lazy'
                      }
                      decoding="async"
                    />

                    <div className="galleryOverlay">
                      <div className="galleryOverlayContent">
                        <p className="galleryCaption">
                          {caption}
                        </p>

                        <span className="galleryInstagramLink">
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <rect
                              x="2"
                              y="2"
                              width="20"
                              height="20"
                              rx="5"
                              ry="5"
                            />

                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />

                            <line
                              x1="17.5"
                              y1="6.5"
                              x2="17.51"
                              y2="6.5"
                            />
                          </svg>

                          See more on Instagram
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.a>
              )
            })}
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .galleryLoader,
        .emptyGallery {
          display: flex;
          min-height: 400px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #aaa;
          text-align: center;
        }

        .gallerySpinner {
          width: 40px;
          height: 40px;
          margin-bottom: 20px;
          border: 2px solid
            rgba(255, 255, 255, 0.1);
          border-left-color: #b01a1a;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .galleryError {
          padding: 60px 24px;
          border-radius: 8px;
          background: rgba(255, 0, 0, 0.05);
          color: #ff4444;
          text-align: center;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <style jsx global>{`
        .galleryMasonry {
          width: min(
            1400px,
            calc(100% - 40px)
          );
          margin: 0 auto;
          column-count: 3;
          column-gap: 12px;
        }

        .galleryCard {
          display: inline-block;
          width: 100%;
          margin: 0 0 12px;
          break-inside: avoid;
          -webkit-column-break-inside: avoid;
          color: inherit;
          text-decoration: none;
          vertical-align: top;
          outline: none;
        }

        .galleryImageWrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
          border-radius: 5px;
          background: #111;
          box-shadow:
            0 5px 18px rgba(0, 0, 0, 0.22);
        }

        .galleryImage {
          display: block;
          width: 100%;
          max-width: 100%;
          height: auto;
          object-fit: contain;
          filter: grayscale(100%);
          transform: scale(1);
          transform-origin: center;
          transition:
            transform 0.45s
              cubic-bezier(0.2, 0.7, 0.2, 1),
            filter 0.4s ease,
            opacity 0.4s ease;
        }

        .galleryOverlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding: 24px 20px 18px;
          background: linear-gradient(
            to bottom,
            transparent 35%,
            rgba(0, 0, 0, 0.35) 60%,
            rgba(0, 0, 0, 0.94) 100%
          );
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }

        .galleryOverlayContent {
          width: 100%;
          transform: translateY(18px);
          transition:
            transform 0.4s
              cubic-bezier(0.2, 0.7, 0.2, 1);
        }

        .galleryCaption {
          display: -webkit-box;
          margin: 0 0 10px;
          overflow: hidden;
          color: #fff;
          font-size: 15px;
          font-weight: 500;
          line-height: 1.45;
          text-shadow:
            0 2px 8px rgba(0, 0, 0, 0.65);
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }

        .galleryInstagramLink {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #e12626;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .galleryCard:hover .galleryImage,
        .galleryCard:focus-visible .galleryImage {
          transform: scale(1.035);
          filter: grayscale(0%);
        }

        .galleryCard:hover .galleryOverlay,
        .galleryCard:focus-visible
          .galleryOverlay {
          opacity: 1;
        }

        .galleryCard:hover
          .galleryOverlayContent,
        .galleryCard:focus-visible
          .galleryOverlayContent {
          transform: translateY(0);
        }

        .galleryCard:focus-visible
          .galleryImageWrapper {
          outline: 2px solid #b01a1a;
          outline-offset: 3px;
        }

        @media (max-width: 1024px) {
          .galleryMasonry {
            column-count: 2;
          }
        }

        @media (max-width: 640px) {
          .galleryMasonry {
            width: calc(100% - 24px);
            column-count: 1;
            column-gap: 0;
          }

          .galleryCard {
            margin-bottom: 10px;
          }

          .galleryOverlay {
            padding: 22px 16px 14px;
          }
        }

        /*
         * Phones and tablets generally do not have
         * a permanent hover state, so the caption
         * remains visible there.
         */
        @media (hover: none) {
          .galleryOverlay {
            opacity: 1;
            background: linear-gradient(
              to bottom,
              transparent 52%,
              rgba(0, 0, 0, 0.88) 100%
            );
          }

          .galleryOverlayContent {
            transform: translateY(0);
          }

          .galleryImage {
            filter: grayscale(100%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .galleryImage,
          .galleryOverlay,
          .galleryOverlayContent {
            transition: none;
          }

          .galleryCard:hover .galleryImage {
            transform: none;
          }
        }
      `}</style>
    </main>
  )
}