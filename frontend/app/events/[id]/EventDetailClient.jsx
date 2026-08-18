'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Share2,
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  BookOpen,
  FolderOpen
} from 'lucide-react';
import { DEFAULT_WINGS } from '../../../types/events';
import { INITIAL_EVENTS } from '../../../lib/eventsStore';
import styles from './EventDetail.module.css';

export default function EventDetailClient({ eventId }) {
  const [event, setEvent] = useState(null);
  const [allEvents, setAllEvents] = useState(INITIAL_EVENTS);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Fetch event details
  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setAllEvents(data.data);
            const found = data.data.find((e) => e.id === eventId);
            if (found) {
              setEvent(found);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('[EventDetailClient] Fallback to cache:', err);
      }

      // Fallback to initial events
      const fallback = INITIAL_EVENTS.find((e) => e.id === eventId) || INITIAL_EVENTS[0];
      setEvent(fallback || null);
      setLoading(false);
    }

    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  // Handle ESC key for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ minHeight: '80vh', textAlign: 'center', padding: '6rem 1.5rem' }}>
        <FolderOpen size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Event Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>The requested event may have been removed or does not exist.</p>
        <Link href="/events" className="btn-primary">
          Back to Events & Bus Topology
        </Link>
      </div>
    );
  }

  const wingMeta = DEFAULT_WINGS.find((w) => w.id === event.wingId) || {
    name: event.wingName || 'Ministry Wing',
    accentColor: '#800000',
    tagline: 'Church of Christ Union Church',
    slug: event.wingId,
  };

  const relatedEvents = allEvents
    .filter((e) => e.wingId === event.wingId && e.id !== event.id)
    .slice(0, 3);

  const images = event.images || [];

  return (
    <main className={styles.pageContainer}>
      {/* 1. Breadcrumb Bar */}
      <div className={styles.breadcrumbBar}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <nav className={styles.breadcrumbNav}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span>/</span>
            <Link href="/events" className={styles.breadcrumbLink}>Events</Link>
            <span>/</span>
            <Link href={`/events/wing/${wingMeta.slug || event.wingId}`} className={styles.breadcrumbLink}>
              {wingMeta.name}
            </Link>
            <span>/</span>
            <span className={styles.breadcrumbActive}>{event.title}</span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Header with Event Title & Subtitle */}
      <section className={styles.eventHero}>
        <div
          className={styles.ambientBlob}
          style={{ backgroundColor: wingMeta.accentColor }}
        />

        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className={styles.heroContent}>
            {/* Wing Tag */}
            <Link
              href={`/events/wing/${wingMeta.slug || event.wingId}`}
              className={styles.wingTag}
            >
              <Sparkles size={13} color="#800000" />
              <span>{wingMeta.name}</span>
            </Link>

            {/* Event Title */}
            <h1 className={styles.mainTitle}>{event.title}</h1>

            {/* Sub-Title Meta Strip */}
            <div className={styles.metaSubtitleBar}>
              {event.eventDate && (
                <div className={styles.metaItem}>
                  <Calendar size={15} color="#800000" />
                  <span>
                    {new Date(event.eventDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {event.location && (
                <div className={styles.metaItem}>
                  <MapPin size={15} color="#800000" />
                  <span>{event.location}</span>
                </div>
              )}

              {/* Share Button */}
              <button
                onClick={handleShare}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copiedShare ? '#16a34a' : '#800000',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  fontFamily: 'Outfit, sans-serif',
                  transition: 'color 0.2s',
                }}
                title="Copy event link"
              >
                <Share2 size={15} />
                <span>{copiedShare ? 'Link Copied!' : 'Share'}</span>
              </button>

              {/* Google Drive Link CTA */}
              {event.folderUrl && (
                <a
                  href={event.folderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.driveButton}
                >
                  <ExternalLink size={15} />
                  <span>Open Drive Folder</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Content Container */}
      <div className={styles.mainBodyContainer}>
        {/* Back Link */}
        <Link
          href={`/events/wing/${wingMeta.slug || event.wingId}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.92rem',
            color: '#64748b',
            fontWeight: 600,
            marginBottom: '2rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to {wingMeta.name}</span>
        </Link>

        {/* 4. Full Formatted Event Description (Up to 1000 words supported) */}
        <section className={styles.descriptionSection}>
          <h2 className={styles.sectionHeading}>
            <BookOpen size={22} color="#800000" />
            <span>About This Programme</span>
          </h2>
          <div className={styles.descriptionParagraphs}>
            {event.description}
          </div>
        </section>

        {/* 5. Sub-Title consisting of Drive Images & Dynamic Photo Gallery (20 Photos) */}
        {images.length > 0 && (
          <section className={styles.gallerySection}>
            <div className={styles.galleryHeader}>
              <div className={styles.galleryTitleBlock}>
                <h2 className={styles.sectionHeading} style={{ marginBottom: 0 }}>
                  <ImageIcon size={22} color="#800000" />
                  <span>Event Photo Gallery</span>
                </h2>
                <p className={styles.gallerySubTitle}>
                  Direct high-resolution photos extracted from Google Drive ({images.length} Photos)
                </p>
              </div>

              {event.folderUrl && (
                <a
                  href={event.folderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.driveButton}
                >
                  <ExternalLink size={14} />
                  <span>View All on Drive</span>
                </a>
              )}
            </div>

            {/* Responsive 20-Photo Grid */}
            <div className={styles.photoGrid}>
              {images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className={styles.photoCard}
                  onClick={() => setLightboxIndex(idx)}
                  title="Click to enlarge"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`${event.title} - Photo ${idx + 1}`}
                    className={styles.photoCardImg}
                    loading="lazy"
                  />
                  <div className={styles.photoCardOverlay}>
                    <div className={styles.overlayText}>
                      <Maximize2 size={16} />
                      <span>Click to enlarge</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Related Events from the Same Wing */}
        {relatedEvents.length > 0 && (
          <section className={styles.relatedSection}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              More from {wingMeta.name}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Explore other gatherings and programmes organized by this ministry.
            </p>

            <div className={styles.relatedGrid}>
              {relatedEvents.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/events/${rel.id}`}
                  className={styles.relatedCard}
                >
                  <h4 className={styles.relatedTitle}>{rel.title}</h4>
                  <div className={styles.relatedDate}>
                    {rel.eventDate ? new Date(rel.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Church Event'}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 7. Perfectly Centered Lightbox Modal Popup */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className={styles.lightboxBackdrop}
            onClick={() => setLightboxIndex(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className={styles.lightboxCloseBtn}
              onClick={() => setLightboxIndex(null)}
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  className={`${styles.lightboxNavBtn} ${styles.lightboxPrev}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  className={`${styles.lightboxNavBtn} ${styles.lightboxNext}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((lightboxIndex + 1) % images.length);
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            <motion.div
              className={styles.lightboxImageWrapper}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[lightboxIndex]}
                alt={`${event.title} full preview`}
                className={styles.lightboxImage}
              />
            </motion.div>

            <div className={styles.lightboxCounter}>
              Photo {lightboxIndex + 1} of {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
