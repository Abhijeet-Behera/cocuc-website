'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ArrowLeft,
  ArrowRight,
  Image as ImageIcon,
  Sparkles,
  Palette,
  Trophy,
  Cpu,
  HeartHandshake,
  BookOpen,
  Globe,
  Music,
  FolderOpen,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Wing, EventItem, DEFAULT_WINGS } from '../../../../types/events';
import { INITIAL_EVENTS } from '../../../../lib/eventsStore';
import WingEventCard from '../../../../components/events/WingEventCard';
import styles from './WingPage.module.css';

const ICON_MAP = {
  Sparkles,
  Palette,
  Trophy,
  Cpu,
  HeartHandshake,
  BookOpen,
  Globe,
  Music,
  Calendar,
};

export default function WingClient({ slug }) {
  const [allEvents, setAllEvents] = useState(INITIAL_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const contentViewerRef = useRef(null);

  // Find the active wing
  const wing = DEFAULT_WINGS.find((w) => w.slug === slug || w.id === slug) || DEFAULT_WINGS[0];
  const IconComponent = ICON_MAP[wing.icon] || Sparkles;

  // Fetch events from API
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setAllEvents(data.data);
          }
        }
      } catch (err) {
        console.warn('[WingClient] Fallback to cache:', err);
      }
    }
    loadEvents();
  }, []);

  // Filter events belonging to this wing / domain
  const wingEvents = allEvents.filter((e) => {
    const eWing = (e.wingId || '').toLowerCase();
    const wId = wing.id.toLowerCase();
    const wSlug = (wing.slug || '').toLowerCase();
    return (
      eWing === wId ||
      eWing === wSlug ||
      (wId === 'womens-fellowship' && eWing === 'mahila-samiti') ||
      (wId === 'mahila-samiti' && eWing === 'womens-fellowship')
    );
  });

  // Automatically select the first event card on initial load
  useEffect(() => {
    if (wingEvents.length > 0 && !selectedEventId) {
      setSelectedEventId(wingEvents[0].id);
    }
  }, [wingEvents, selectedEventId]);

  // Handle Title Card click
  const handleCardClick = (eventId) => {
    setSelectedEventId(eventId);
    // Smooth scroll to the content viewer
    setTimeout(() => {
      if (contentViewerRef.current) {
        contentViewerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // Currently selected event object
  const selectedEvent = wingEvents.find((e) => e.id === selectedEventId) || wingEvents[0];
  const selectedImages = selectedEvent?.images || [];

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
    if (typeof window !== 'undefined' && selectedEvent) {
      const shareUrl = `${window.location.origin}/events/${selectedEvent.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <main className={styles.wingPageContainer}>
      {/* 1. Breadcrumb Navigation */}
      <div className={styles.breadcrumbBar}>
        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <nav className={styles.breadcrumbNav}>
            <Link href="/" className={styles.breadcrumbLink}>Home</Link>
            <span>/</span>
            <Link href="/events" className={styles.breadcrumbLink}>Events</Link>
            <span>/</span>
            <span className={styles.breadcrumbActive}>{wing.name}</span>
          </nav>
        </div>
      </div>

      {/* 2. Wing Hero Header */}
      <section className={styles.wingHero}>
        <div
          className={styles.ambientGlow}
          style={{ backgroundColor: wing.accentColor }}
        />

        <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div className={styles.heroContent}>
            <div
              className={styles.wingTag}
            >
              <IconComponent size={14} color="#800000" />
              <span>{wing.name}</span>
            </div>

            <h1 className={styles.wingTitle}>{wing.name}</h1>
            <p className={styles.wingTagline}>{wing.tagline}</p>
            <p className={styles.wingDescription}>{wing.description}</p>
          </div>
        </div>
      </section>

      {/* 3. Main Body Container */}
      <div className={styles.mainBodyContainer}>
        {/* Back Link */}
        <Link
          href="/events"
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
          <span>Back to Bus Topology Viewer</span>
        </Link>

        {/* 4. TITLE CARDS SECTION (Made dynamically according to the title name given while uploading) */}
        {wingEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 1.5rem', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
            <FolderOpen size={48} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              No Programmes Published Yet for {wing.name}
            </h3>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Upload an event for this wing via the Admin Portal.
            </p>
            <Link href="/admin" className="btn-primary">
              Go to Admin Upload
            </Link>
          </div>
        ) : (
          <>
            <section className={styles.titleCardsSection}>
              <div className={styles.sectionHeaderRow}>
                <div>
                  <h2 className={styles.sectionTitle}>Programmes & Event Cards</h2>
                  <p className={styles.sectionSubtitle}>
                    Click any event card below to reveal the full event details and high-resolution photo gallery.
                  </p>
                </div>
              </div>

              {/* Dynamic Grid of Event Cards */}
              <div className={styles.titleCardsGrid}>
                {wingEvents.map((event) => (
                  <WingEventCard
                    key={event.id}
                    event={event}
                    wing={wing}
                    isSelected={selectedEventId === event.id}
                    onClick={() => handleCardClick(event.id)}
                    accentColor={wing.accentColor}
                  />
                ))}
              </div>
            </section>

            {/* 5. REVEALED FULL CONTENT VIEWER (Shown on Title Card click) */}
            {selectedEvent && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedEvent.id}
                  ref={contentViewerRef}
                  className={styles.contentViewerSection}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  {/* Content Header with Title & Subtitle Meta */}
                  <div className={styles.contentViewerHeader}>
                    <div className={styles.viewerMetaStrip}>
                      {selectedEvent.eventDate && (
                        <div className={styles.viewerMetaBadge}>
                          <Calendar size={14} color="#64748b" />
                          <span>
                            {new Date(selectedEvent.eventDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      )}

                      {selectedEvent.location && (
                        <div className={styles.viewerMetaBadge}>
                          <MapPin size={14} color="#64748b" />
                          <span>{selectedEvent.location}</span>
                        </div>
                      )}

                      {/* Share Button */}
                      <button
                        onClick={handleShare}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedShare ? '#16a34a' : '#64748b',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          marginLeft: 'auto',
                        }}
                      >
                        <Share2 size={14} />
                        <span>{copiedShare ? 'Link Copied!' : 'Share Event'}</span>
                      </button>

                      {/* Direct Google Drive Folder Button */}
                      {selectedEvent.folderUrl && (
                        <a
                          href={selectedEvent.folderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.driveLinkBtn}
                        >
                          <ExternalLink size={13} />
                          <span>Open Drive Folder</span>
                        </a>
                      )}
                    </div>

                    {/* Main Title */}
                    <h2 className={styles.viewerTitle}>{selectedEvent.title}</h2>
                  </div>

                  {/* Full Formatted Description (up to 1000 words) */}
                  <div className={styles.descriptionBlock}>
                    {selectedEvent.description}
                  </div>

                  {/* Sub-Title Consisting of 20 Google Drive Photos */}
                  {selectedImages.length > 0 && (
                    <div className={styles.gallerySection}>
                      <div className={styles.galleryHeader}>
                        <div>
                          <h3 className={styles.galleryHeadingTitle}>
                            <ImageIcon size={22} color={wing.accentColor} />
                            <span>Event Photo Gallery</span>
                          </h3>
                          <p className={styles.gallerySubTitle}>
                            High-resolution photos extracted from Google Drive ({selectedImages.length} Photos)
                          </p>
                        </div>

                        {selectedEvent.folderUrl && (
                          <a
                            href={selectedEvent.folderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.driveLinkBtn}
                          >
                            <ExternalLink size={13} />
                            <span>View All on Drive</span>
                          </a>
                        )}
                      </div>

                      {/* 20 Image Grid */}
                      <div className={styles.photoGrid}>
                        {selectedImages.map((imgUrl, imgIdx) => (
                          <div
                            key={imgIdx}
                            className={styles.photoThumb}
                            onClick={() => setLightboxIndex(imgIdx)}
                            title="Click to enlarge"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={`${selectedEvent.title} photo ${imgIdx + 1}`}
                              className={styles.photoThumbImg}
                              loading="lazy"
                            />
                            <div className={styles.photoOverlay}>
                              <Maximize2 size={22} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </>
        )}

        {/* 6. Explore Other Wings Strip */}
        <section style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
            Explore Other Ministry Wings
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {DEFAULT_WINGS.filter((w) => w.slug !== wing.slug).map((otherWing) => {
              const OtherIcon = ICON_MAP[otherWing.icon] || Sparkles;

              return (
                <Link
                  key={otherWing.id}
                  href={`/events/wing/${otherWing.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    textDecoration: 'none',
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = otherWing.accentColor;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <OtherIcon size={16} color={otherWing.accentColor} />
                    <span>{otherWing.name}</span>
                  </div>
                  <ArrowRight size={15} color="#94a3b8" />
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* 7. Perfectly Centered Lightbox Modal Popup */}
      <AnimatePresence>
        {lightboxIndex !== null && selectedImages.length > 0 && (
          <motion.div
            className={styles.lightboxBackdrop}
            onClick={() => setLightboxIndex(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close button */}
            <button
              className={styles.lightboxCloseBtn}
              onClick={() => setLightboxIndex(null)}
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            {/* Navigation buttons */}
            {selectedImages.length > 1 && (
              <>
                <button
                  className={`${styles.lightboxNavBtn} ${styles.lightboxPrev}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((lightboxIndex - 1 + selectedImages.length) % selectedImages.length);
                  }}
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  className={`${styles.lightboxNavBtn} ${styles.lightboxNext}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((lightboxIndex + 1) % selectedImages.length);
                  }}
                  aria-label="Next photo"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Centered Image Container */}
            <motion.div
              className={styles.lightboxCenterContainer}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImages[lightboxIndex]}
                alt="Full resolution preview"
                className={styles.lightboxCenterImage}
              />
            </motion.div>

            {/* Centered Counter */}
            <div className={styles.lightboxCounter}>
              Photo {lightboxIndex + 1} of {selectedImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
