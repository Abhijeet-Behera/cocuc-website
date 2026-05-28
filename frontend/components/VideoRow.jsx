'use client'

import { motion } from 'framer-motion'
import styles from './VideoRow.module.css'

/**
 * A single zig-zag row: text on one side, thumbnail on the other.
 * @param {object} props
 * @param {string} props.heading – section heading
 * @param {string} props.description – short description
 * @param {string} props.buttonLabel – "View Playlist"
 * @param {string} props.playlistId – YouTube playlist ID (for "View Playlist" link)
 * @param {'text-left'|'text-right'} props.layout – which side text goes on
 * @param {{ videoId, title, thumbnail, watchUrl }|null} props.video – fetched video data
 * @param {boolean} props.loading
 */
export default function VideoRow({
  heading,
  description,
  buttonLabel,
  playlistId,
  layout = 'text-left',
  video,
  loading,
}) {
  const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`
  const isTextLeft = layout === 'text-left'

  const rowVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  }

  return (
    <motion.div
      className={`${styles.row} ${isTextLeft ? styles.textLeft : styles.textRight}`}
      variants={rowVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {/* Text block */}
      <div className={styles.textBlock}>
        <h3 className={styles.heading}>{heading}</h3>
        <p className={styles.description}>{description}</p>
        <a
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.playlistBtn}
        >
          {buttonLabel}
        </a>
      </div>

      {/* Thumbnail block */}
      <div className={styles.thumbBlock}>
        {loading ? (
          <div className={styles.skeleton} aria-label="Loading video..." />
        ) : video ? (
          <a
            href={video.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.thumbLink}
          >
            <div className={styles.thumbWrapper}>
              {video.thumbnail ? (
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className={styles.thumbImg}
                />
              ) : (
                <div className={styles.thumbPlaceholder} />
              )}
              {/* Play overlay */}
              <div className={styles.playOverlay} aria-hidden="true">
                <div className={styles.playIcon}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <p className={styles.videoTitle}>{video.title}</p>
          </a>
        ) : (
          <div className={styles.fallback}>
            <span>No public video available at the moment.</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
