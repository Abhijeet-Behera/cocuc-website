'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { EventItem, Wing } from '../../types/events';
import styles from './WingEventCard.module.css';

interface WingEventCardProps {
  event: EventItem;
  wing?: Wing;
  isSelected?: boolean;
  onClick?: () => void;
  accentColor?: string;
}

export default function WingEventCard({
  event,
  wing,
  isSelected = false,
  onClick,
  accentColor = '#800000',
}: WingEventCardProps) {
  const coverImg = event.coverImage || (event.images && event.images[0]);
  const imageCount = event.images?.length || (coverImg ? 1 : 0);
  const color = wing?.accentColor || accentColor;

  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <motion.div
      className={`${styles.eventCard} ${isSelected ? styles.selectedCard : ''}`}
      onClick={onClick}
      style={{ '--card-accent': color } as React.CSSProperties}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      {/* 1. Cover / Thumbnail Container */}
      <div className={styles.coverContainer}>
        {coverImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImg}
            alt={event.title}
            className={styles.coverImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.coverPlaceholder}>
            <ImageIcon size={32} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>No Photo Attached</span>
          </div>
        )}

        {/* Domain Tag / Category Badge */}
        <span className={styles.categoryBadge} style={{ color }}>
          {event.wingName || wing?.name || 'Church Wing'}
        </span>

        {/* Image Count Badge: e.g. "📸 12 Photos" */}
        {imageCount > 0 && (
          <div className={styles.photoCountBadge}>
            <span>📸 {imageCount} Photo{imageCount === 1 ? '' : 's'}</span>
          </div>
        )}
      </div>

      {/* 2. Card Body */}
      <div className={styles.cardBody}>
        {/* Meta Row: Date & Location */}
        <div className={styles.metaRow}>
          {formattedDate && (
            <span className={styles.dateTag}>
              <Calendar size={13} color="#64748b" />
              <span>{formattedDate}</span>
            </span>
          )}

          {event.location && (
            <span className={styles.locationTag} title={event.location}>
              <MapPin size={13} color="#64748b" />
              <span>{event.location}</span>
            </span>
          )}
        </div>

        {/* 3. Event Title */}
        <h3 className={styles.eventTitle}>
          {event.title}
        </h3>

        {/* 4. Formatted Description Snippet */}
        <p className={styles.descriptionSnippet}>
          {event.description}
        </p>

        {/* 5. Card Footer */}
        <div className={styles.cardFooter}>
          <span className={styles.actionLink} style={{ color }}>
            <span>{isSelected ? 'Viewing Event Below' : 'View Details & Gallery'}</span>
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
