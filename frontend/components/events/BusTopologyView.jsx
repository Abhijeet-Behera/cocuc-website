'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Palette,
  Trophy,
  Cpu,
  HeartHandshake,
  BookOpen,
  Globe,
  Music,
  Calendar,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Layers,
  LayoutGrid,
} from 'lucide-react';
import { DEFAULT_WINGS } from '../../types/events';
import styles from './BusTopologyView.module.css';

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

export default function BusTopologyView({
  wings = DEFAULT_WINGS,
  events = [],
  onSelectWing,
  selectedWingId,
}) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('topology');
  const [activeWingId, setActiveWingId] = useState(
    selectedWingId || wings[0]?.id || 'general-church'
  );
  const scrollRef = useRef(null);

  // Smooth Pan Controls
  const panBy = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Jump to specific Wing
  const jumpToWing = (wing) => {
    setActiveWingId(wing.id);
    if (scrollRef.current) {
      const targetCard = scrollRef.current.querySelector(`[data-wing-id="${wing.id}"]`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  // Wing click handler (triggers custom callback if provided, else navigates to wing page)
  const handleWingClick = (wing) => {
    setActiveWingId(wing.id);
    if (onSelectWing) {
      onSelectWing(wing);
    } else {
      router.push(`/events/wing/${wing.slug || wing.id}`);
    }
  };

  // Get events mapped to a specific wing
  const getWingEvents = (wingId) => {
    return events.filter((e) => e.wingId?.toLowerCase() === wingId.toLowerCase());
  };

  return (
    <section className={styles.topologySection} id="events-topology">
      <div className={styles.ambientGlow} />

      {/* Header Container */}
      <div className={styles.headerContainer}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.topologyBadge}>
            <span className={styles.pulseDot} />
            Interactive Wing Topology
          </div>
          <h2 className={styles.sectionTitle}>Explore Church Wings & Events</h2>
          <p className={styles.sectionSubtitle}>
            Click any ministry wing along the horizontal bus backbone to open its dedicated page, view programmes, and explore full Google Drive photo galleries.
          </p>
        </motion.div>
      </div>

      {/* Controls Bar */}
      <div className={styles.controlsBar}>
        {/* View Mode Toggle */}
        <div className={styles.viewModeToggle}>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'topology' ? styles.active : ''}`}
            onClick={() => setViewMode('topology')}
            title="Interactive Bus Topology View"
          >
            <Layers size={16} />
            <span>Bus Topology</span>
          </button>
          <button
            className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
            title="Responsive Grid View"
          >
            <LayoutGrid size={16} />
            <span>Grid View</span>
          </button>
        </div>

        {/* Navigation Quick Help */}
        <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>Click any card to open its dedicated page</span>
        </div>
      </div>

      {/* Quick Wing Navigation Bar */}
      <div className={styles.wingQuickNav}>
        {wings.map((wing) => {
          const isActive = wing.id === activeWingId;
          const IconComponent = ICON_MAP[wing.icon] || Sparkles;

          return (
            <button
              key={wing.id}
              className={`${styles.wingPill} ${isActive ? styles.activePill : ''}`}
              onClick={() => {
                jumpToWing(wing);
                handleWingClick(wing);
              }}
            >
              <IconComponent size={14} color={isActive ? '#ffffff' : wing.accentColor} />
              <span>{wing.name}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. HORIZONTAL BUS TOPOLOGY VIEW (Zig-Zag Alternating)      */}
      {/* ========================================================= */}
      {viewMode === 'topology' && (
        <div className={styles.viewportContainer}>
          {/* Floating Pan Navigation Buttons */}
          <div className={styles.floatingNavControls}>
            <button
              className={styles.navArrowBtn}
              onClick={() => panBy(-500)}
              aria-label="Scroll left along bus"
              title="Pan Left"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className={styles.navArrowBtn}
              onClick={() => panBy(500)}
              aria-label="Scroll right along bus"
              title="Pan Right"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div ref={scrollRef} className={styles.busScrollArea}>
            <div className={styles.topologyCanvas}>
              {/* TOP ROW OF WINGS (Even indices: 0, 2, 4, 6) */}
              <div className={`${styles.nodesRow} ${styles.topRow}`}>
                {wings.map((wing, index) => {
                  const isTop = index % 2 === 0;
                  const wingEvents = getWingEvents(wing.id);
                  const IconComponent = ICON_MAP[wing.icon] || Sparkles;

                  if (!isTop) {
                    return <div key={`spacer-top-${wing.id}`} className={styles.nodeSlot} style={{ visibility: 'hidden' }} />;
                  }

                  return (
                    <motion.div
                      key={wing.id}
                      data-wing-id={wing.id}
                      className={styles.nodeSlot}
                      initial={{ opacity: 0, y: -30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: index * 0.06 }}
                    >
                      {/* Node Branch Label */}
                      <div className={styles.nodeAddressLabel}>
                        <span style={{ color: wing.accentColor }}>●</span> {wing.name}
                      </div>

                      {/* Wing Card (Direct click navigates to Wing Page) */}
                      <WingCardItem
                        wing={wing}
                        events={wingEvents}
                        onClick={() => handleWingClick(wing)}
                        IconComponent={IconComponent}
                      />

                      {/* Vertical Branch Line dropping to Central Bus */}
                      <div
                        className={styles.branchLineTop}
                        style={{
                          background: `linear-gradient(180deg, ${wing.accentColor} 0%, rgba(128,0,0,0.8) 100%)`,
                        }}
                      >
                        <div
                          className={`${styles.tJunction} ${styles.junctionTop}`}
                          style={{ borderColor: wing.accentColor }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CENTRAL MAIN BUS CABLE */}
              <div className={styles.centralBusLineWrapper}>
                {/* Left Bus Terminator */}
                <div className={`${styles.busTerminator} ${styles.terminatorLeft}`}>
                  <span className={`${styles.terminatorDot} ${styles.active}`} />
                  <span>BUS_LINE</span>
                </div>

                {/* Glowing Horizontal Wire */}
                <div className={styles.mainBusCable}>
                  <div className={styles.signalPacket} />
                  <div className={`${styles.signalPacket} ${styles.signalPacket2}`} />
                </div>

                {/* Right Bus Terminator */}
                <div className={`${styles.busTerminator} ${styles.terminatorRight}`}>
                  <span>BUS_END</span>
                  <span className={styles.terminatorDot} />
                </div>
              </div>

              {/* BOTTOM ROW OF WINGS (Odd indices: 1, 3, 5, 7) */}
              <div className={`${styles.nodesRow} ${styles.bottomRow}`}>
                {wings.map((wing, index) => {
                  const isBottom = index % 2 === 1;
                  const wingEvents = getWingEvents(wing.id);
                  const IconComponent = ICON_MAP[wing.icon] || Sparkles;

                  if (!isBottom) {
                    return <div key={`spacer-bottom-${wing.id}`} className={styles.nodeSlot} style={{ visibility: 'hidden' }} />;
                  }

                  return (
                    <motion.div
                      key={wing.id}
                      data-wing-id={wing.id}
                      className={styles.nodeSlot}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: index * 0.06 }}
                    >
                      {/* Vertical Branch Line rising from Central Bus */}
                      <div
                        className={styles.branchLineBottom}
                        style={{
                          background: `linear-gradient(180deg, rgba(128,0,0,0.8) 0%, ${wing.accentColor} 100%)`,
                        }}
                      >
                        <div
                          className={`${styles.tJunction} ${styles.junctionBottom}`}
                          style={{ borderColor: wing.accentColor }}
                        />
                      </div>

                      {/* Node Branch Label */}
                      <div className={styles.nodeAddressLabel}>
                        <span style={{ color: wing.accentColor }}>●</span> {wing.name}
                      </div>

                      {/* Wing Card (Direct click navigates to Wing Page) */}
                      <WingCardItem
                        wing={wing}
                        events={wingEvents}
                        onClick={() => handleWingClick(wing)}
                        IconComponent={IconComponent}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. RESPONSIVE MODERN GRID VIEW                            */}
      {/* ========================================================= */}
      {viewMode === 'grid' && (
        <div className={styles.gridContainer}>
          {wings.map((wing, index) => {
            const wingEvents = getWingEvents(wing.id);
            const IconComponent = ICON_MAP[wing.icon] || Sparkles;

            return (
              <motion.div
                key={wing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <WingCardItem
                  wing={wing}
                  events={wingEvents}
                  onClick={() => handleWingClick(wing)}
                  IconComponent={IconComponent}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// -------------------------------------------------------------
// Subcomponent: Individual Wing Card Item
// -------------------------------------------------------------
function WingCardItem({
  wing,
  events,
  onClick,
  IconComponent,
}) {
  const latestImages = events.flatMap((e) => e.images || []).slice(0, 4);

  return (
    <div
      className={styles.wingCard}
      onClick={onClick}
      style={{ '--card-accent': wing.accentColor, cursor: 'pointer' }}
    >
      <div className={styles.cardGlowOverlay} style={{ backgroundColor: wing.accentColor }} />

      <div className={styles.cardHeader}>
        <div
          className={styles.iconCircle}
          style={{
            background: `linear-gradient(135deg, ${wing.accentColor} 0%, ${wing.secondaryColor || '#111827'} 100%)`,
          }}
        >
          <IconComponent size={24} />
        </div>
        {wing.badge && <span className={styles.badgePill}>{wing.badge}</span>}
      </div>

      <h3 className={styles.wingName}>{wing.name}</h3>
      <p className={styles.wingTagline}>{wing.tagline}</p>

      {/* Meta row with preview thumbnails */}
      <div className={styles.cardMeta}>
        <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
          {wing.name} Events
        </div>

        {latestImages.length > 0 && (
          <div className={styles.thumbnailStack}>
            {latestImages.slice(0, 3).map((imgUrl, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={imgUrl}
                alt="Event preview"
                className={styles.stackImg}
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>

      {/* View Action Footer */}
      <div className={styles.viewActionRow} style={{ color: wing.accentColor }}>
        <span>View Wing & Drive Gallery</span>
        <ArrowRight size={16} className={styles.arrowIcon} />
      </div>
    </div>
  );
}
