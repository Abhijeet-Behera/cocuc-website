'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  MapPin,
  Image as ImageIcon,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Sparkles,
  Palette,
  Trophy,
  Cpu,
  HeartHandshake,
  BookOpen,
  Globe,
  Music,
  PlusCircle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { Wing, EventItem } from '../../types/events';
import styles from './WingDetailModal.module.css';

interface WingDetailModalProps {
  wing: Wing | null;
  events: EventItem[];
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminUpload?: (wingId: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
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

export default function WingDetailModal({
  wing,
  events,
  isOpen,
  onClose,
  onOpenAdminUpload,
}: WingDetailModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImageIndex !== null) {
          setLightboxImageIndex(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, lightboxImageIndex, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !wing) return null;

  // Filter events belonging to this wing and search query
  const wingEvents = events.filter((e) => {
    const eWing = (e.wingId || '').toLowerCase();
    const wId = wing.id.toLowerCase();
    const matchesWing =
      eWing === wId ||
      (wId === 'womens-fellowship' && eWing === 'mahila-samiti') ||
      (wId === 'mahila-samiti' && eWing === 'womens-fellowship');
    if (!matchesWing) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      (e.location && e.location.toLowerCase().includes(q))
    );
  });

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxImageIndex(index);
  };

  const nextLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxImageIndex !== null && lightboxImages.length > 0) {
      setLightboxImageIndex((lightboxImageIndex + 1) % lightboxImages.length);
    }
  };

  const prevLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxImageIndex !== null && lightboxImages.length > 0) {
      setLightboxImageIndex((lightboxImageIndex - 1 + lightboxImages.length) % lightboxImages.length);
    }
  };

  const IconComponent = ICON_MAP[wing.icon] || Sparkles;

  return (
    <AnimatePresence>
      <div className={styles.modalBackdrop} onClick={onClose}>
        <motion.div
          className={styles.modalContainer}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', duration: 0.45, bounce: 0.1 }}
        >
          {/* Close Button */}
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>

          {/* Wing Hero Banner */}
          <div className={styles.wingHeroHeader}>
            <div
              className={styles.headerAmbientCircle}
              style={{ backgroundColor: wing.accentColor }}
            />

            <div className={styles.heroContent}>
              <div className={styles.topBadgeRow}>
                <div
                  className={styles.wingPillBadge}
                  style={{ borderColor: wing.accentColor, color: '#ffffff' }}
                >
                  <IconComponent size={14} color={wing.accentColor} />
                  <span>{wing.name}</span>
                </div>
                {wing.badge && <span className={styles.wingPillBadge}>{wing.badge}</span>}
              </div>

              <h2 className={styles.wingHeaderTitle}>{wing.name} Events</h2>
              <p className={styles.wingHeaderTagline}>{wing.tagline}</p>
              <p className={styles.wingDescription}>{wing.description}</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className={styles.filterBar}>
            <div className={styles.searchBox}>
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder={`Search programmes in ${wing.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {onOpenAdminUpload ? (
                <button
                  onClick={() => onOpenAdminUpload(wing.id)}
                  className="btn-primary"
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.45rem 1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    borderRadius: '30px',
                    textTransform: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <PlusCircle size={15} />
                  <span>Upload Event</span>
                </button>
              ) : (
                <Link
                  href={`/admin?wing=${wing.id}#upload-event`}
                  className="btn-primary"
                  style={{
                    fontSize: '0.8rem',
                    padding: '0.45rem 1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    borderRadius: '30px',
                    textTransform: 'none',
                  }}
                >
                  <PlusCircle size={15} />
                  <span>Upload Event</span>
                </Link>
              )}
            </div>
          </div>

          {/* Modal Body: Event Cards */}
          <div className={styles.modalBody}>
            {wingEvents.length === 0 ? (
              <div className={styles.emptyStateContainer}>
                <FolderOpen size={48} color="#94a3b8" style={{ margin: '0 auto' }} />
                <h4 className={styles.emptyStateTitle}>No Programmes Found</h4>
                <p className={styles.emptyStateDesc}>
                  {searchQuery
                    ? `No programmes matching "${searchQuery}". Try a different keyword.`
                    : `There are currently no events uploaded for this wing. Use the Admin Portal to upload an event with Google Drive photos.`}
                </p>
                <Link
                  href="/admin"
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '0.6rem 1.4rem' }}
                >
                  Go to Admin Uploader
                </Link>
              </div>
            ) : (
              wingEvents.map((event) => {
                const isExpanded = !!expandedCards[event.id];
                const isLongText = event.description.length > 280;

                return (
                  <motion.div
                    key={event.id}
                    className={styles.eventCard}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Event Header */}
                    <div className={styles.eventCardHeader}>
                      <div className={styles.eventMetaBadges}>
                        {event.eventDate && (
                          <span className={styles.metaBadge}>
                            <Calendar size={13} color="#64748b" />
                            <span>
                              {new Date(event.eventDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </span>
                        )}

                        {event.location && (
                          <span className={styles.metaBadge}>
                            <MapPin size={13} color="#64748b" />
                            <span>{event.location}</span>
                          </span>
                        )}
                      </div>

                      {/* Clickable Title navigating to dedicated Event Page */}
                      <h3 className={styles.eventTitle}>
                        <Link
                          href={`/events/${event.id}`}
                          style={{
                            color: 'inherit',
                            textDecoration: 'none',
                            transition: 'color 0.2s',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.color = wing.accentColor;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.color = '';
                          }}
                          title="Click to open full page with drive gallery"
                        >
                          {event.title}
                        </Link>
                      </h3>
                    </div>

                    {/* Event Description (1000 words supported with Read More) */}
                    <div className={styles.eventDescriptionWrapper}>
                      <p
                        className={`${styles.descriptionText} ${
                          !isExpanded && isLongText ? styles.descriptionCollapsed : ''
                        }`}
                      >
                        {event.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {isLongText && (
                          <button
                            className={styles.readMoreBtn}
                            onClick={() => toggleExpand(event.id)}
                          >
                            <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        )}

                        <Link
                          href={`/events/${event.id}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: wing.accentColor,
                            textDecoration: 'none',
                            marginLeft: 'auto',
                          }}
                        >
                          <span>Open Full Page & Gallery</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>

                    {/* Dynamic Google Drive Photo Gallery */}
                    {event.images && event.images.length > 0 && (
                      <div className={styles.gallerySection}>
                        <div className={styles.galleryHeaderRow}>
                          <div className={styles.galleryTitle}>
                            <ImageIcon size={16} color={wing.accentColor} />
                            <span>Event Photo Gallery</span>
                          </div>

                          {event.folderUrl && (
                            <a
                              href={event.folderUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.driveLinkBtn}
                              title="Open original folder in Google Drive"
                            >
                              <ExternalLink size={13} />
                              <span>View on Google Drive</span>
                            </a>
                          )}
                        </div>

                        <div className={styles.photoGrid}>
                          {event.images.map((imgUrl, imgIdx) => (
                            <div
                              key={imgIdx}
                              className={styles.photoThumbnail}
                              onClick={() => openLightbox(event.images, imgIdx)}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imgUrl}
                                alt={`${event.title} photo ${imgIdx + 1}`}
                                className={styles.photoImg}
                                loading="lazy"
                              />
                              <div className={styles.photoOverlay}>
                                <Maximize2 size={20} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* Lightbox / Fullscreen Image Modal */}
      {lightboxImageIndex !== null && (
        <div className={styles.lightboxBackdrop} onClick={() => setLightboxImageIndex(null)}>
          <button
            className={styles.lightboxCloseBtn}
            onClick={() => setLightboxImageIndex(null)}
            aria-label="Close Lightbox"
          >
            <X size={24} />
          </button>

          {lightboxImages.length > 1 && (
            <>
              <button
                className={`${styles.lightboxNavBtn} ${styles.lightboxPrev}`}
                onClick={prevLightboxImage}
                aria-label="Previous photo"
              >
                <ChevronLeft size={30} />
              </button>
              <button
                className={`${styles.lightboxNavBtn} ${styles.lightboxNext}`}
                onClick={nextLightboxImage}
                aria-label="Next photo"
              >
                <ChevronRight size={30} />
              </button>
            </>
          )}

          <div
            className={styles.lightboxImageWrapper}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImages[lightboxImageIndex]}
              alt="Full resolution preview"
              className={styles.lightboxImage}
            />
          </div>

          <div className={styles.lightboxCounter}>
            {lightboxImageIndex + 1} / {lightboxImages.length}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
